const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet.js');

class Handshake {
  constructor(packet){
    var bs = new ByteStream(Buffer.from(packet.dataBuffer))
    this.protocolVersion = bs.readVarInt()
    this.serverAddress = bs.readString()
    bs.readByte(); //Skip the port
    bs.readByte();
    this.nextState = bs.readVarInt()
  }
}

module.exports = Handshake
