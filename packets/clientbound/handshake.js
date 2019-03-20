const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const varIntBuffer = BufferGenerators.varIntBuffer
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer

class Handshake extends Packet {
  constructor(protocolVersion, serverAddress, nextState){
    super()
    this.packetID = 0
    this.dataBuffer = Buffer.concat([
      varIntBuffer(protocolVersion),
      lengthPrefixedStringBuffer(serverAddress),
      unsignedByteBuffer(0),
      unsignedByteBuffer(0),
      varIntBuffer(nextState)
    ])
  }
}

module.exports = Handshake
