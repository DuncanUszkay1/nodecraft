const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class PlayerPosition extends Packet {
  write(x,y,z,ya,p){
    this.packetID = 0x32
    this.dataBuffer = Buffer.concat([
      BG.double(x),
      BG.double(y),
      BG.double(z),
      BG.float(ya),
      BG.float(p),
      BG.unsignedByte(0),
      BG.varInt(42)
    ])
  }
}

module.exports = PlayerPosition
