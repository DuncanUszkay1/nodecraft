const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require('../../byteStream.js');

const blockBits = 8
const sectionsize = 16
const paletteSize = 8
const numOfLongs = Math.pow(sectionsize,3) * blockBits / 64
const halfByteSize = Math.pow(sectionsize,3) / 2

class ChunkData extends Packet {
  read(bs) {
    this.x = bs.readInt()
    this.z = bs.readInt()
  }

  localize(x, z) {
    this.x = x - this.x
    this.z = z - this.z
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.writeInt(this.x)
    bs.writeInt(this.z)
    this.dataBuffer = bs.buffer
  }

  write(xpos,zpos){
    this.packetID = 0x22
    var chunkData = ChunkData.buildChunkData()
    this.dataBuffer = Buffer.concat([
      BG.int(xpos), //position (x coord / 16)
      BG.int(zpos), //position (z coord / 16)
      BG.unsignedByte(1), //Full Chunk (Bool)
      BG.varInt(1), //Primary Bit Mask
      BG.varInt(chunkData.length), //Section Data Size
      chunkData, //Section Data
      BG.varInt(0) //Number of block entities
    ])
  }

  static buildChunkData(){
    var biomes = []
    for(var i = 0; i < 256; i++){
      biomes.push(0x7F)
    }

    return Buffer.concat([
      this.buildSection(), //Section Data
      BG.array(biomes, BG.int) //Biomes
    ])
  }

  static buildPalette() {
    var palette = []
    for(var i = 0; i < paletteSize; i++){
      palette.push(i)
    }
    return Buffer.concat([
      BG.varInt(paletteSize), //Palette Size
      BG.array(palette, BG.varInt) //Palette Entries
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
      BG.unsignedByte(blockBits), //Bits per block
      ChunkData.buildPalette(), //Palette
      BG.varInt(numOfLongs), //Number of longs in following array
      blockByteStream.buffer, //Block data
      blockLightByteStream.buffer, //Block Light
      skyLightByteStream.buffer, //Sky Light
    ])
  }
}

module.exports = ChunkData
