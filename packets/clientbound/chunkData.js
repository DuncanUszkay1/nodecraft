const uuid = require('uuid/v1');
const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const BufferIterator = BufferHelpers.BufferIterator;
const intBuffer = BufferHelpers.intBuffer;
const unsignedByteBuffer = BufferHelpers.unsignedByteBuffer;
const varIntBuffer = BufferHelpers.varIntBuffer;
const arrayBuffer = BufferHelpers.arrayBuffer;

const tempHardcodedChunkData = {
  chunkX: 0,
  chunkZ: 0,
  numOfLongs: 16 * 16 * 16 * 14 / 64,
  fullChunk: true,
  primaryBitMask: 1,
  halfByteSize: 16 * 16 * 16 / 2,
  numberOfBlockSections: 0
}

const blockBits = 14
const sectionsize = 16
const numOfLongs = Math.pow(sectionsize,3) * blockBits / 64
const halfByteSize = Math.pow(sectionsize,3) / 2

class ChunkData extends Packet {
  constructor(xpos,zpos){
    super()
    this.packetID = 0x22
    var blockvalues = []
    for(var y = 0; y < sectionsize; y++){
      for(var z = 0; z < sectionsize; z++){
        for(var x = 0; x < sectionsize; x++){
          blockvalues.push(35)
        }
      }
    }
    var blockBufferIterator = new BufferIterator(Buffer.alloc(numOfLongs * 8))
    blockBufferIterator.writeBlocks(blockvalues)
    console.log(blockBufferIterator.b)
    var blockLightBufferIterator = new BufferIterator(Buffer.alloc(halfByteSize))
    var skyLightBufferIterator = new BufferIterator(Buffer.alloc(halfByteSize))
    for(var i = 0; i < halfByteSize; i++){
      skyLightBufferIterator.writeByte(0xFF)
      blockLightBufferIterator.writeByte(0xFF)
    }
    var biomes = []
    for(var i = 0; i < 256; i++){
      biomes.push(0x7F)
    }
    var sectionDataBuffer = Buffer.concat([
      unsignedByteBuffer(blockBits),
      varIntBuffer(numOfLongs),
      blockBufferIterator.b,
      blockLightBufferIterator.b,
      skyLightBufferIterator.b,
      arrayBuffer(biomes, intBuffer)
    ])
    this.dataBuffer = Buffer.concat([
      intBuffer(xpos),
      intBuffer(zpos),
      unsignedByteBuffer(1),
      varIntBuffer(1),
      varIntBuffer(sectionDataBuffer.length),
      sectionDataBuffer,
      varIntBuffer(0)
    ])
  }
}

module.exports = ChunkData
