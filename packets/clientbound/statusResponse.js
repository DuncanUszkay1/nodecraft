const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class StatusResponse extends Packet {
  write(serverStatus){
    this.packetID = 0
    this.serverStatus = serverStatus
    this.data = BG.string(serverStatus)
  }
}

module.exports = StatusResponse
