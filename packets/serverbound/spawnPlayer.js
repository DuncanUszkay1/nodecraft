const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');

class SpawnPlayer extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
  }

  localize(x, z) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt()
    bs.skipUuid()
    bs.amendDouble(d => d + 16*x)
    bs.readDouble()
    bs.amendDouble(d => d + 16*z)
    this.dataBuffer = bs.buffer
  }
}

module.exports = SpawnPlayer
