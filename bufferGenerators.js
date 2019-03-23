const Int64BE = require("int64-buffer").Int64BE;
const ByteStream = require("./byteStream.js");
const uuidParse = require("uuid-parse");

class BufferGenerators {
  static lengthPrefixedStringBuffer(str) {
    var strLengthBuffer = BufferGenerators.varIntBuffer(str.length);
    var strBuffer = Buffer.from(str)
    return Buffer.concat([strLengthBuffer, strBuffer])
  }

  static uuidBuffer(uuid) {
    return Buffer.from(uuidParse.parse(uuid))
  }

  static positionBuffer(x,y,z) {
    return (new Int64BE(((x & 0x3FFFFFF) << 38) | ((y & 0xFFF) << 26) | (z & 0x3FFFFFF))).toBuffer()
  }

  static varIntBuffer(value) {
    var byteSize = BufferGenerators.varIntSizeOf(value)
    var bs = new ByteStream(Buffer.alloc(byteSize));
    bs.writeVarInt(value);
    return bs.buffer
  }

  static arrayBuffer(values, f){
    return Buffer.concat(values.map(f))
  }

  static floatBuffer(value) {
    var b = Buffer.alloc(4)
    b.writeFloatBE(value, 0)
    return b
  }

  static doubleBuffer(value) {
    var b = Buffer.alloc(8)
    b.writeDoubleBE(value, 0)
    return b
  }

  static intBuffer(value) {
    var b = Buffer.alloc(4)
    b.writeInt32BE(value)
    return b
  }

  static shortBuffer(value) {
    var b = Buffer.alloc(2)
    b.writeInt16BE(value)
    return b
  }

  static unsignedByteBuffer(value) {
    var b = Buffer.alloc(1)
    b.writeUInt8(value)
    return b
  }

  static varIntSizeOf(x) {
      return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
  }
}


module.exports = BufferGenerators
