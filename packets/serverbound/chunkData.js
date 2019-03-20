const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet.js');

class ChunkData extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    this.x = bs.readInt()
    this.z = bs.readInt()
  }

  localize(x, z) {
    this.x = x - this.x
    this.z = z - this.z
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.writeInt(this.x)
    bs.writeInt(this.z)
    this.dataBuffer = bs.buffer
  }
}

module.exports = ChunkData
