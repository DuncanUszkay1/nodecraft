const BG = require('../bufferGenerators.js');
const ByteStream = require('../byteStream.js');

class PacketBase {
  constructor() {
    this.length = null
    this.packetID = null
    this.dataBuffer = Buffer.alloc(0)
  }

  read() {}

  write() {
    throw `Write on packet with id ${packetID} not implemented`
  }

  localize(x,z) {}

  loadIntoBuffer() {
    if(this.packetID == null){
      throw new Error("Cannot load a packet with a null id into a buffer")
    }
    this.length = BG.varIntSizeOf(this.packetID) + this.dataBuffer.length

    return Buffer.concat([
      BG.varInt(this.length),
      BG.varInt(this.packetID),
      this.dataBuffer
    ]);
  }

  dataEquals(otherPacket) {
    if (this.length != otherPacket.length) {
      return false;
    }

    return this.dataBuffer.equals(otherPacket.dataBuffer)
  }
}

module.exports = PacketBase
