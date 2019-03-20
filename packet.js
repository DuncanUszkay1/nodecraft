const BufferGenerators = require('./bufferGenerators.js');
const ByteStream = require('./byteStream.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer
const varIntBuffer = BufferGenerators.varIntBuffer;

class Packet {
  constructor() {
    this.length = null
    this.packetID = null
    this.dataBuffer = Buffer.alloc(0)
  }

  localize(x,z) {}

  loadStringIntoDataBuffer(str) {
    this.dataBuffer = lengthPrefixedStringBuffer(str);
  }

  static loadFromBuffer(buffer) {
    var bs = new ByteStream(buffer);
    var packets = []
    var beginningOfNextPacket = 0
    while (!bs.empty()) {
      var packet = new Packet()
      packet.length = bs.readVarInt();
      beginningOfNextPacket = packet.length + bs.i
      packet.packetID = bs.readVarInt();
      packet.dataBuffer = bs.tail(beginningOfNextPacket);
      packets.push(packet)
    }
    return packets
  }

  loadIntoBuffer() {
    if(this.packetID == null){
      throw new Error("Cannot load a packet with a null id into a buffer")
    }
    this.length = BufferGenerators.varIntSizeOf(this.packetID) + this.dataBuffer.length

    return Buffer.concat([
      varIntBuffer(this.length),
      varIntBuffer(this.packetID),
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

module.exports = Packet
