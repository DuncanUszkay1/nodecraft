const ByteStream = require("./byteStream.js");
const uuidParse = require("uuid-parse");

function lengthPrefixedStringBuffer(str) {
  var strLengthBuffer = varIntBuffer(str.length);
  var strBuffer = Buffer.from(str)
  return Buffer.concat([strLengthBuffer, strBuffer])
}

function uuidBuffer(uuid) {
  return Buffer.from(uuidParse.parse(uuid))
}

function positionBuffer(position) {
  var x = position.x
  var y = position.y ? position.y : 16
  var z = position.z
  var firstInt32 = ((x & 0x03FFFFFF) << 6) | ((y & 0x0FC0) >>> 6)
  var secondInt32 = ((y & 0x3F) << 26) | (z & 0x03FFFFFF)

  var buf = Buffer.alloc(8)
  buf.writeInt32BE(firstInt32)
  buf.slice(4).writeInt32BE(secondInt32)
  return buf
}

function varIntBuffer(value) {
  var byteSize = varIntSizeOf(value)
  var bs = new ByteStream(Buffer.alloc(byteSize));
  bs.writeVarInt(value);
  return bs.buffer
}

function arrayBuffer(values, f){
  return Buffer.concat(values.map(f))
}

function floatBuffer(value) {
  var b = Buffer.alloc(4)
  b.writeFloatBE(value, 0)
  return b
}

function angleBuffer(value) {
  value = value % 360
  value = value < 0 ? value + 360 : value
  value = Math.floor((value/360) * 256)
  return unsignedByteBuffer(value)
}

function doubleBuffer(value) {
  var b = Buffer.alloc(8)
  b.writeDoubleBE(value, 0)
  return b
}

function intBuffer(value) {
  var b = Buffer.alloc(4)
  b.writeInt32BE(value)
  return b
}

function shortBuffer(value) {
  var b = Buffer.alloc(2)
  b.writeInt16BE(value)
  return b
}

function unsignedByteBuffer(value) {
  var b = Buffer.alloc(1)
  b.writeUInt8(value)
  return b
}

function signedByteBuffer(value) {
  var b = Buffer.alloc(1)
  b.writeInt8(value)
  return b
}

function varIntSizeOf(x) {
  return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
}

module.exports = {
  lengthPrefixedStringBuffer: lengthPrefixedStringBuffer,
  uuidBuffer: uuidBuffer,
  positionBuffer: positionBuffer,
  varIntBuffer: varIntBuffer,
  arrayBuffer: arrayBuffer,
  floatBuffer: floatBuffer,
  angleBuffer: angleBuffer,
  doubleBuffer: doubleBuffer,
  intBuffer: intBuffer,
  shortBuffer: shortBuffer,
  unsignedByteBuffer: unsignedByteBuffer,
  signedByteBuffer: signedByteBuffer,
  varIntSizeOf: varIntSizeOf
}

