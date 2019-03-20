const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet')
const BufferGenerators = require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.                          lengthPrefixedStringBuffer;

class LoginStart extends Packet {
  constructor(username){
    super()
    this.packetID = 0
    this.dataBuffer = lengthPrefixedStringBuffer(username)
  }
}

module.exports = LoginStart
