const ByteStream = require('../../byteStream.js');

class PlayerDigging {
  constructor(packet) {
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.status = bs.readVarInt()
    this.position = bs.readPosition()
    this.face = bs.readByte()
  }

  localize(x, z) {
    this.position.x = x - this.position.x
    this.position.z = z - this.position.z
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt()
    bs.writePosition(this.position)
    this.dataBuffer = bs.buffer
  }
}

module.exports = PlayerDigging
