const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class Handshake extends Packet {
  read(bs){
    this.protocolVersion = bs.readVarInt()
    this.serverAddress = bs.readString()
    bs.readByte(); //Skip the port
    bs.readByte();
    this.nextState = bs.readVarInt()
  }

  write(protocolVersion, serverAddress, nextState){
    this.packetID = 0
    this.dataBuffer = Buffer.concat([
      BG.varInt(protocolVersion),
      BG.string(serverAddress),
      BG.unsignedByte(0),
      BG.unsignedByte(0),
      BG.varInt(nextState)
    ])
  }
}

module.exports = Handshake
