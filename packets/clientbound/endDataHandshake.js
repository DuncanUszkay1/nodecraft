const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet')
const BufferGenerators = require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;

class EndDataHandshake extends Packet {
  constructor(username){
    super()
    this.packetID = 0xA1
    this.dataBuffer = Buffer.alloc(0)
  }
}

module.exports = EndDataHandshake
