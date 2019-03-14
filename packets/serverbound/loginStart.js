const BufferHelpers = require('../../buffer.js');
const BufferIterator = BufferHelpers.BufferIterator;

class LoginStart {
  constructor(packet){
    var bi = new BufferIterator(Buffer.from(packet.dataBuffer))
    this.username = bi.readString(bi.readByte())
  }
}

module.exports = LoginStart
