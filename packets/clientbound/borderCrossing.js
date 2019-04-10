const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const shortBuffer = BufferGenerators.shortBuffer;

class BorderCrossing extends Packet {
  constructor(player){
    super()
    this.packetID = 0xA0
    this.x = player.position.x
    this.y = player.position.y
    this.z = 0
    this.dataBuffer = Buffer.concat([
      varIntBuffer(player.eid),
      doubleBuffer(this.x),
      doubleBuffer(this.y),
      doubleBuffer(this.z)
    ])
  }

}

module.exports = BorderCrossing
