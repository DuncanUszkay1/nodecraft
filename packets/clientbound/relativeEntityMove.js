const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const shortBuffer = BufferGenerators.shortBuffer;

class RelativeEntityMove extends Packet {
  constructor(player, oldPosition, position){
    super()
    var diffFactor = 128 * 32
    var deltaX = (position.x - oldPosition.x) * diffFactor
    var deltaY = (position.y - oldPosition.y) * diffFactor
    var deltaZ = (position.z - oldPosition.z) * diffFactor
    this.packetID = 0x28
    console.log(oldPosition)
    console.log(position)
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
