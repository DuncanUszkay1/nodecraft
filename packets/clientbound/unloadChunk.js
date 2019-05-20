const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class UnloadChunk extends Packet {
  write(position){
    this.packetID = 0x1F
    this.dataBuffer = Buffer.concat([
      BG.int(position.x),
      BG.int(position.z),
    ])
  }
}

module.exports = UnloadChunk
