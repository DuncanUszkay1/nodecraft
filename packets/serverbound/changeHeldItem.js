const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js');

class ChangeHeldItem extends Packet {
  read(bs) {
    this.slot = bs.readShort()
  }
}

module.exports = ChangeHeldItem
