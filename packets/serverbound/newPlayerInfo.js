const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');
const BufferGenerators= require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const uuidBuffer = BufferGenerators.uuidBuffer;

class NewPlayerInfo extends Packet {
  constructor(packet) {
    super()
    Object.assign(this, packet)
  }
}

module.exports = NewPlayerInfo
