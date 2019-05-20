const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js');

class ChatMessage extends Packet {
  read(bs) {
    this.msg = bs.readString()
  }
}

module.exports = ChatMessage
