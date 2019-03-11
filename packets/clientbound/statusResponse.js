const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const lengthPrefixedStringBuffer = BufferHelpers.lengthPrefixedStringBuffer;

class LoginSuccess extends Packet {
  constructor(serverStatus){
    super()
    this.packetID = 0
    this.serverStatus = serverStatus
    this.dataBuffer = lengthPrefixedStringBuffer(serverStatus)
  }
}

module.exports = LoginSuccess
