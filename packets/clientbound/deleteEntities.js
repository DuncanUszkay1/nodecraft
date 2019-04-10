const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const shortBuffer = BufferGenerators.shortBuffer;

class DeleteEntities extends Packet {
  constructor(entityIDs){
    super()
    this.packetID = 0x35
    this.dataBuffer = Buffer.concat([
      varIntBuffer(entityIDs.length),
      Buffer.concat(entityIDs.map(e => varIntBuffer(e)))
    ])
  }

}

module.exports = DeleteEntities
