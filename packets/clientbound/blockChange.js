const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const ByteStream = require('../../byteStream.js');

const positionBuffer = BufferGenerators.positionBuffer
const varIntBuffer = BufferGenerators.varIntBuffer

class BlockChange extends Packet {
  constructor(playerDigging) {
      super()
      Object.assign(this, playerDigging)
      this.packetID = 0x0B
      this.dataBuffer = Buffer.concat([
          positionBuffer(playerDigging.position),
          varIntBuffer(0)
      ])
  }
}

module.exports = BlockChange
