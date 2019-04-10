const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const shortBuffer = BufferGenerators.shortBuffer;

class RelativeEntityMove extends Packet {
  constructor(player){
    super()
    this.packetID = 0x29
    var diffFactor = 128 * 32
    this.deltaX = (player.position.x - player.oldPosition.x) * diffFactor
    this.deltaY = (player.position.y - player.oldPosition.y) * diffFactor
    this.deltaZ = (player.position.z - player.oldPosition.z) * diffFactor
    this.yaw = 0
    this.pitch = 0
    this.dataBuffer = Buffer.concat([
      varIntBuffer(player.eid),
      shortBuffer(this.deltaX),
      shortBuffer(this.deltaY),
      shortBuffer(this.deltaZ),
      unsignedByteBuffer(this.yaw),
      unsignedByteBuffer(this.pitch),
      unsignedByteBuffer(0)
    ])
  }
}

module.exports = RelativeEntityMove
