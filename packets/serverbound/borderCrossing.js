const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');

class BorderCrossing extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt()
    this.x = bs.readDouble()
    this.y = bs.readDouble()
    this.z = bs.readDouble()
  }
}

module.exports = BorderCrossing
