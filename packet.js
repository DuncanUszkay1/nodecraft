const BufferIterator = require('./buffer.js');
const ServerBoundPacketIds = require('./packetID.js');

function varIntSizeOf(x) {
    return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
}

class Packet {
  constructor(){
    this.length = null
    this.packetID = null
    this.byteArray = null
    this.type = null
  }

  adjustLength(){
    this.length = varIntSizeOf(this.packetID) + this.byteArray.length
  }

  loadStringIntoByteArray(str) {
    var lengthBuffer = new BufferIterator(Buffer.alloc(varIntSizeOf(str.length)));
    lengthBuffer.writeVarInt(str.length);
    var buffer = Buffer.concat([lengthBuffer.b, Buffer.from(str)]);
    var bi = new BufferIterator(buffer);
    this.byteArray = bi.readByteArray()
  }

  loadFromBuffer(buffer){
    var bi = new BufferIterator(buffer);
    this.length = bi.readVarInt();
    this.packetID = bi.readVarInt();
    this.byteArray = bi.readByteArray();
    this.type = ServerBoundPacketIds[this.packetID];
  }

  loadIntoBuffer(){
    var lengthBuffer = new BufferIterator(Buffer.alloc(varIntSizeOf(this.length)));
    var packetIDBuffer = new BufferIterator(Buffer.alloc(varIntSizeOf(this.packetID)));
    lengthBuffer.writeVarInt(this.length);
    packetIDBuffer.writeVarInt(this.packetID);
    return Buffer.concat([
      lengthBuffer.b,
      packetIDBuffer.b,
      Buffer(this.byteArray)
    ]);
  }
}

module.exports = Packet
