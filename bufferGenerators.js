const ByteStream = require("./byteStream.js");
const uuidParse = require("uuid-parse");

function string(str) {
  var strLengthBuffer = varInt(str.length);
  var strBuffer = Buffer.from(str)
  return Buffer.concat([strLengthBuffer, strBuffer])
}

function uuid(uuid) {
  return Buffer.from(uuidParse.parse(uuid))
}

function position(position) {
  var x = position.x
  var y = position.y
  var z = position.z
  var firstInt32 = ((x & 0x03FFFFFF) << 6) | ((y & 0x0FC0) >>> 6)
  var secondInt32 = ((y & 0x3F) << 26) | (z & 0x03FFFFFF)

  var buf = Buffer.alloc(8)
  buf.writeInt32BE(firstInt32)
  buf.slice(4).writeInt32BE(secondInt32)
  return buf
}

function varInt(value) {
  var byteSize = varIntSizeOf(value)
  var bs = new ByteStream(Buffer.alloc(byteSize));
  bs.writeVarInt(value);
  return bs.buffer
}

function array(values, f){
  return Buffer.concat(values.map(f))
}

function float(value) {
  var b = Buffer.alloc(4)
  b.writeFloatBE(value, 0)
  return b
}

function angle(value) {
  value = value % 360
  value = value < 0 ? value + 360 : value
  value = Math.floor((value/360) * 256)
  return unsignedByte(value)
}

function double(value) {
  var b = Buffer.alloc(8)
  b.writeDoubleBE(value, 0)
  return b
}

function int(value) {
  var b = Buffer.alloc(4)
  b.writeInt32BE(value)
  return b
}

function short(value) {
  var b = Buffer.alloc(2)
  b.writeInt16BE(value)
  return b
}

function unsignedByte(value) {
  var b = Buffer.alloc(1)
  b.writeUInt8(value)
  return b
}

function signedByte(value) {
  var b = Buffer.alloc(1)
  b.writeInt8(value)
  return b
}

function varIntSizeOf(x) {
  return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
}

module.exports = {
  string: string,
  uuid: uuid,
  position: position,
  varInt: varInt,
  array: array,
  float: float,
  angle: angle,
  double: double,
  int: int,
  short: short,
  unsignedByte: unsignedByte,
  signedByte: signedByte,
  varIntSizeOf: varIntSizeOf
}

