const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class SpawnPosition extends Packet {
  write(x,y,z){
    this.packetID = 0x49
    this.dataBuffer = BG.position([x,y,z])
  }
}

module.exports = SpawnPosition
