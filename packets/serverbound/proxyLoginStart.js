const ByteStream = require('../../byteStream.js');
const Packet = require('../base.js')
const BG = require('../../bufferGenerators.js');

class ProxyLoginStart extends Packet {
  read(bs) {
    this.username = bs.readString()
    this.position = bs.readPosition()
  }

  write(username, position){
    this.packetID = 0
    this.dataBuffer = Buffer.concat([
      BG.string(username),
      BG.position(position)
    ])
  }
}

module.exports = ProxyLoginStart
