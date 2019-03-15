const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;

class PlayerPosition extends Packet {
  constructor(x,y,z,ya,p){
    super()
    this.packetID = 0x32
    this.dataBuffer = Buffer.concat([
      doubleBuffer(x),
      doubleBuffer(y),
      doubleBuffer(z),
      floatBuffer(ya),
      floatBuffer(p),
      unsignedByteBuffer(0),
      varIntBuffer(42)
    ])
  }
}

module.exports = PlayerPosition
