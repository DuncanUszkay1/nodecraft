const uuid = require('uuid/v1');
const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const lengthPrefixedStringBuffer = BufferHelpers.lengthPrefixedStringBuffer;

class LoginSuccess extends Packet {
  constructor(username){
    super()
    this.packetID = 2
    this.uuid = uuid();
    this.username = username
    this.dataBuffer = Buffer.concat([
      lengthPrefixedStringBuffer(this.uuid),
      lengthPrefixedStringBuffer(this.username)
    ])
  }
}

module.exports = LoginSuccess
