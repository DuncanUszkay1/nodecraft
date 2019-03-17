const uuid = require('uuid/v1');
const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');

const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;

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
