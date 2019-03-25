const ByteStream = require('../../byteStream.js');

class PlayerDigging {
  constructor(packet) {
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.status = bs.readVarInt()
    this.position = bs.readPosition()
    this.face = bs.readByte()
  }
}

module.exports = PlayerDigging
