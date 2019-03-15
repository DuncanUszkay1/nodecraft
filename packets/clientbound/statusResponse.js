const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;

class StatusResponse extends Packet {
  constructor(serverStatus){
    super()
    this.packetID = 0
    this.serverStatus = serverStatus
    this.dataBuffer = lengthPrefixedStringBuffer(serverStatus)
  }
}

module.exports = StatusResponse
