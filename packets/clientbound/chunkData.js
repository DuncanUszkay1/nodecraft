const fs = require('fs')
const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const ByteStream = require('../../byteStream.js');
const PlayerMap = require('../../playerMap.js');

const intBuffer = BufferGenerators.intBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const arrayBuffer = BufferGenerators.arrayBuffer;

const blockBits = 8
const sectionsize = 16
const paletteSize = 8
const numOfLongs = Math.pow(sectionsize,3) * blockBits / 64
const halfByteSize = Math.pow(sectionsize,3) / 2

class ChunkData extends Packet {
  constructor(playerMap){
    super()
    this.packetID = 0x22
    this.dataBuffer = playerMap.getDataBuffer()
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
    var blockByteStream = new ByteStream(Buffer.alloc(numOfLongs * 8))
    blockByteStream.writeBlocks(blockvalues, blockBits)
    var blockLightByteStream = new ByteStream(Buffer.alloc(halfByteSize))
    var skyLightByteStream = new ByteStream(Buffer.alloc(halfByteSize))
    for(var i = 0; i < halfByteSize; i++){
      skyLightByteStream.writeByte(0xFF)
      blockLightByteStream.writeByte(0xFF)
    }
    return Buffer.concat([
      unsignedByteBuffer(blockBits), //Bits per block
      ChunkData.buildPalette(), //Palette
      varIntBuffer(numOfLongs), //Number of longs in following array
      blockByteStream.buffer, //Block data
      blockLightByteStream.buffer, //Block Light
      skyLightByteStream.buffer, //Sky Light
    ])
  }
}

module.exports = ChunkData
