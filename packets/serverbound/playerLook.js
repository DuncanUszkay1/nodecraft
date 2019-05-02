const Packet = require('../base.js');

class PlayerLook extends Packet {
  read(bs) {
    this.yaw = bs.readFloat()
    this.pitch = bs.readFloat()
    this.onGround = bs.readByte()
  }
}

module.exports = PlayerLook
