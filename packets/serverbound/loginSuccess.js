const uuid = require('uuid/v1');
const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');

const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;

class LoginSuccess extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
  }
}

module.exports = LoginSuccess
