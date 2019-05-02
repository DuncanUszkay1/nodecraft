const ByteStream = require('../../byteStream.js');
const Packet = require('../base')
const BG = require('../../bufferGenerators.js');

class LoginStart extends Packet {
  read(bs){
    this.username = bs.readString()
  }

  write(username){
    this.packetID = 0
    this.data = BG.string(username)
  }
}

module.exports = LoginStart
