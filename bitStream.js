class BitStream {
  constructor(buffer) {
    this.buffer = buffer;
    this.i = 0
  }

  readOneBit() {
    var offset = Math.floor(this.i / 8),
      shift = 7 - this.i % 8;
    this.i += 1;
    return (this.buffer[offset] >> shift) & 1;
  }

  readBits(n) {
    var value = 0;
    for (var j = 0; j < n; j += 1) {
      value = value << 1 | this.readOneBit();
    }
    return value;
  }

  readSignedInt(n) {
    var signbit = this.readOneBit()
    var mantessa = this.readBits(n-1)
    var binaryNum = signbit << 31
    if (signbit) {
      for (var m = 30; m >= 25; m--) {
        binaryNum += signbit << m;
      }
    }
    binaryNum += mantessa
    return binaryNum
  }

  writePosition(position) {
    var firstInt32 = ((position[0] & 0x03FFFFFF) << 6) | ((position[1] & 0x0FC0) >>> 6)
    var secondInt32 = ((position[1] & 0x3F) << 26) | (position[2] & 0x03FFFFFF)
    
    this.buffer.writeInt32BE(firstInt32)
    var temp = this.buffer.slice(this.i + 4, this.i + 8)
    temp.writeInt32BE(secondInt32)
    this.i += 64
  }

  empty() {
    return Math.floor(this.i / 8) >= this.buffer.length;
  }
}

module.exports = BitStream