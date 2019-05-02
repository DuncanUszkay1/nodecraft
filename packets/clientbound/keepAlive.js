const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class KeepAlive extends Packet {
  write() {
    this.packetID = 0x21
    this.dataBuffer = BG.double(Math.random())
  }
}

module.exports = KeepAlive
