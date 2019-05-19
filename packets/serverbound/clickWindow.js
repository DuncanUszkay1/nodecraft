const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js');

class ClickWindow extends Packet {
  read(bs) {
    this.windowID = bs.readByte()
    this.slot = bs.readShort()
    this.button = bs.readByte()
    this.actionNumber = bs.readShort()
    this.mode = bs.readVarInt()
    this.data = bs.readSlot()
  }
}

module.exports = ClickWindow
