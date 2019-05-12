const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js');

class CreativeClickWindow extends Packet {
  read(bs) {
    this.slot = bs.readShort()
    this.heldItem = bs.readItem()
  }
}

module.exports = CreativeClickWindow
