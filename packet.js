const BufferHelpers = require('./buffer.js');
const BufferIterator = BufferHelpers.BufferIterator;
const lengthPrefixedStringBuffer = BufferHelpers.lengthPrefixedStringBuffer
const varIntBuffer = BufferHelpers.varIntBuffer;

function varIntSizeOf(x) {
    return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
}

class Packet {
  constructor() {
    this.length = null
    this.packetID = null
    this.dataBuffer = Buffer.alloc(0)
  }

  loadStringIntoDataBuffer(str) {
    this.dataBuffer = lengthPrefixedStringBuffer(str);
  }

  loadFromBuffer(buffer) {
    var bi = new BufferIterator(buffer);
    this.length = bi.readVarInt();
    this.packetID = bi.readVarInt();
    this.dataBuffer = bi.tail();
  }

  loadIntoBuffer() {
    if(this.packetID == null){
      throw new Error("Cannot load a packet with a null id into a buffer")
    }
    this.length = varIntSizeOf(this.packetID) + this.dataBuffer.length
    var lengthBuffer = new BufferIterator(Buffer.alloc(varIntSizeOf(this.length)));
    var packetIDBuffer = new BufferIterator(Buffer.alloc(varIntSizeOf(this.packetID)));
    lengthBuffer.writeVarInt(this.length);
    packetIDBuffer.writeVarInt(this.packetID);
    return Buffer.concat([
      lengthBuffer.b,
      packetIDBuffer.b,
      this.dataBuffer
    ]);
  }
}

module.exports = Packet
