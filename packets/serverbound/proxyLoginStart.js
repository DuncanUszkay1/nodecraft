const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet')

class ProxyLoginStart extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.username = bs.readString()
    this.position = bs.readPosition()
  }
}

module.exports = ProxyLoginStart
