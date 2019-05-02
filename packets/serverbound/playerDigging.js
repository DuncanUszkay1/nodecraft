const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js')

class PlayerDigging extends Packet {
  read(bs) {
    this.status = bs.readVarInt()
    this.position = bs.readPosition()
    this.face = bs.readByte()
  }

  localize(x, z) {
    this.position.x = this.position.x - x*16
    this.position.z = this.position.z - z*16
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt()
    bs.writePosition(this.position)
    this.dataBuffer = bs.buffer
  }
}

module.exports = PlayerDigging
