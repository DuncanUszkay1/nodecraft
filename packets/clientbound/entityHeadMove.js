const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const angleBuffer = BufferGenerators.angleBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const shortBuffer = BufferGenerators.shortBuffer;

class EntityHeadMove extends Packet {
  constructor(player){
    super()
    this.packetID = 0x39
    this.yaw = player.position.yaw
    this.dataBuffer = Buffer.concat([
      varIntBuffer(player.eid),
      angleBuffer(this.yaw)
    ])
  }
}

module.exports = EntityHeadMove
