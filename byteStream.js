const BitStream = require('./bitStream.js');

class ByteStream {
  constructor(buffer) {
    this.buffer = buffer
    this.i = 0
  }

  readByte() {
    if(this.empty()){
      throw new Error("Buffer is empty")
    }
    var result = this.buffer[this.i]
    this.i++
    return result
  }

  writeByte(data) {
    if(this.empty()){
      throw new Error("Buffer too small")
    }
    this.buffer[this.i] = data
    this.i++
  }


  readVarInt() {
    var numRead = 0;
    var result = 0;
    do {
        var read = this.readByte();
        var value = (read & 0b01111111);
        result |= (value << (7 * numRead));

        numRead++;
        if (numRead > 5) {
            throw new Error("VarInt is too big");
        }
    } while ((read & 0b10000000) != 0);
    return result;
  }

  writeVarInt(value) {
    do {
        var temp = value & 0b01111111;
        value >>>= 7;
        if (value != 0) {
            temp |= 0b10000000;
        }
        this.writeByte(temp);
    } while (value != 0);
  }

  writeBlocks(values, blockBits) {
    if(values.length % 64 != 0){
      throw new Error(`Size of value array must be divisible by 64`)
    }
    var nextByte = 0
    var bitsRemaining = 8
    for(var i = 0; i < values.length; i++) {
      var v = values[i]
      for(var j = blockBits-1; j >= 0; j--) {
        nextByte <<= 1
        bitsRemaining--
        if(v >= (1 << j)){
          nextByte++
          v -= (1 << j)
        }
        if(bitsRemaining == 0){
          this.writeByte(nextByte)
          nextByte = 0
          bitsRemaining = 8
        }
      }
    }
  }

  readInt() {
    var value = this.buffer.readInt32BE(this.i)
    this.i += 4
    return value
  }

  writeInt(val) {
    this.buffer.writeInt32BE(val, this.i)
    this.i += 4
  }

  readByteArray() {
    var result = []
    while(!this.empty()){
      result.push(this.readByte());
    }
    return result
  }

  readString() {
    var result = []
    var len = this.readByte()
    for(var i = 0; i < len; i++){
      result.push(this.readByte())
    }
    return Buffer.from(result).toString()
  }

  readPosition() {
    var x, y, z
    var bitStream = new BitStream(this.buffer.slice(this.i, this.i+8))
    x = bitStream.readSignedInt(26)
    y = bitStream.readSignedInt(12)
    z = bitStream.readSignedInt(26)
    return [x, y, z]
  }

  writePosition(position) {
    var bitStream = new BitStream(this.buffer.slice(this.i, this.i+8))
    bitStream.writePosition(position)
    this.i += bitStream.i
  }

  tail(upTo) {
    if(this.empty()){
      return Buffer.alloc(0)
    }
    var result = this.buffer.slice(this.i, upTo)
    this.i = upTo
    return result
  }

  empty() {
    return this.i >= this.buffer.length
  }
}

module.exports = ByteStream
