const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const doubleBuffer = BufferHelpers.doubleBuffer;
const floatBuffer = BufferHelpers.floatBuffer;
const unsignedByteBuffer = BufferHelpers.unsignedByteBuffer;
const varIntBuffer = BufferHelpers.varIntBuffer;

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
