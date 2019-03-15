const ByteStream = require('../../byteStream.js');

class LoginStart {
  constructor(packet){
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.username = bs.readString()
  }
}

module.exports = LoginStart
