const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet.js');

class PlayerPositionAndLook extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.x = bs.readDouble()
    this.y = bs.readDouble()
    this.z = bs.readDouble()
    this.yaw = bs.readFloat()
    this.pitch = bs.readFloat()
    this.onGround = bs.readByte()
  }

  localize(x, z) {
    this.x -= x * 16
    this.z -= z * 16
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.writeDouble(this.x)
    bs.writeDouble(this.y)
    bs.writeDouble(this.z)
    this.dataBuffer = bs.buffer
  }
}

module.exports = PlayerPositionAndLook
