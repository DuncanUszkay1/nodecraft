const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const BufferIterator = BufferHelpers.BufferIterator;
const intBuffer = BufferHelpers.intBuffer;
const unsignedByteBuffer = BufferHelpers.unsignedByteBuffer;
const varIntBuffer = BufferHelpers.varIntBuffer;
const arrayBuffer = BufferHelpers.arrayBuffer;

const blockBits = 8
const sectionsize = 16
const paletteSize = 8
const numOfLongs = Math.pow(sectionsize,3) * blockBits / 64
const halfByteSize = Math.pow(sectionsize,3) / 2

class ChunkData extends Packet {
  constructor(xpos,zpos){
    super()
    this.packetID = 0x22
    var chunkData = ChunkData.buildChunkData()
    this.dataBuffer = Buffer.concat([
      intBuffer(xpos), //position (x coord / 16)
      intBuffer(zpos), //position (z coord / 16)
      unsignedByteBuffer(1), //Full Chunk (Bool)
      varIntBuffer(1), //Primary Bit Mask
      varIntBuffer(chunkData.length), //Section Data Size
      chunkData, //Section Data
      varIntBuffer(0) //Number of block entities
    ])
  }

  static buildChunkData(){
    var biomes = []
    for(var i = 0; i < 256; i++){
      biomes.push(0x7F)
    }

    return Buffer.concat([
      this.buildSection(), //Section Data
      arrayBuffer(biomes, intBuffer) //Biomes
    ])
  }

  static buildPalette() {
    var palette = []
    for(var i = 0; i < paletteSize; i++){
      palette.push(i)
    }
    return Buffer.concat([
      varIntBuffer(paletteSize), //Palette Size
      arrayBuffer(palette, varIntBuffer) //Palette Entries
    ])

  }

  static buildSection() {
    var blockvalues = []
    for(var y = 0; y < sectionsize; y++){
      for(var z = 0; z < sectionsize; z++){
        for(var x = 0; x < sectionsize; x++){
          blockvalues.push(((x + y + z) % 2) + 1)
        }
      }
    }
    var blockBufferIterator = new BufferIterator(Buffer.alloc(numOfLongs * 8))
    blockBufferIterator.writeBlocks(blockvalues, blockBits)
    var blockLightBufferIterator = new BufferIterator(Buffer.alloc(halfByteSize))
    var skyLightBufferIterator = new BufferIterator(Buffer.alloc(halfByteSize))
    for(var i = 0; i < halfByteSize; i++){
      skyLightBufferIterator.writeByte(0xFF)
      blockLightBufferIterator.writeByte(0xFF)
    }
    return Buffer.concat([
      unsignedByteBuffer(blockBits), //Bits per block
      ChunkData.buildPalette(), //Palette
      varIntBuffer(numOfLongs), //Number of longs in following array
      blockBufferIterator.b, //Block data
      blockLightBufferIterator.b, //Block Light
      skyLightBufferIterator.b, //Sky Light
    ])
  }
}

module.exports = ChunkData
