const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const ByteStream = require('../../byteStream.js');

const positionBuffer = BufferGenerators.positionBuffer
const varIntBuffer = BufferGenerators.varIntBuffer

class BlockChange extends Packet {
  constructor(packet) {
    super()
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    this.position = bs.readPosition()
  }

  localize(x, z) {
    console.log(this.position)
    this.position.x = x*16 + this.position.x
    this.position.z = z*16 + this.position.z
    console.log(this.position)
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.writePosition(this.position)
    this.dataBuffer = bs.buffer
  }

}

module.exports = BlockChange
