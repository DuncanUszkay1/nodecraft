const Packet = require('../base.js');

class EndDataHandshake extends Packet {
  write(username){
    this.packetID = 0xA1
    this.dataBuffer = Buffer.alloc(0)
  }
}

module.exports = EndDataHandshake
