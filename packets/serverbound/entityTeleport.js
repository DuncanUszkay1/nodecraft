const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');

class EntityTeleport extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
  }

  localize(x, z) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt();
    bs.amendDouble(d => d + x*16)
    bs.readDouble();
    bs.amendDouble(d => d + z*16)
    this.dataBuffer = bs.buffer
  }

}

module.exports = EntityTeleport
