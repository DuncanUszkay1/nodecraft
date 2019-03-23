const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const positionBuffer = BufferGenerators.positionBuffer;

class SpawnPosition extends Packet {
  constructor(x,y,z){
    super()
    this.packetID = 0x49
    this.dataBuffer = positionBuffer([x,y,z])
  }
}

module.exports = SpawnPosition
