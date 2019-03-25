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
    var diffFactor = 128 * 32
    var deltaX = (player.position.x - player.oldPosition.x) * diffFactor
    var deltaY = (player.position.y - player.oldPosition.y) * diffFactor
    var deltaZ = (player.position.z - player.oldPosition.z) * diffFactor
    this.packetID = 0x28
    this.dataBuffer = Buffer.concat([
      varIntBuffer(player.eid),
      shortBuffer(deltaX),
      shortBuffer(deltaY),
      shortBuffer(deltaZ),
      unsignedByteBuffer(0)
    ])
  }
}

module.exports = RelativeEntityMove
