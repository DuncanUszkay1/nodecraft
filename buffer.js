var Int64BE = require("int64-buffer").Int64BE;

const blockBits = 14

function lengthPrefixedStringBuffer(str) {
  var strLengthBuffer = varIntBuffer(str.length);
  var strBuffer = Buffer.from(str)
  return Buffer.concat([strLengthBuffer, strBuffer])
}

function positionBuffer(x,y,z) {
  return (new Int64BE(((x & 0x3FFFFFF) << 38) | ((y & 0xFFF) << 26) | (z & 0x3FFFFFF))).toBuffer()
}

function varIntBuffer(value) {
  var bi = new BufferIterator(Buffer.alloc(varIntSizeOf(value)));
  bi.writeVarInt(value);
  return bi.b
}

function arrayBuffer(values, f){
  return Buffer.concat(values.map(v => f(v)))
}

function floatBuffer(value) {
  var b = Buffer.alloc(4)
  b.writeFloatBE(value, 0)
  return b
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

function unsignedByteBuffer(value) {
  var b = Buffer.alloc(1)
  b.writeUInt8(value)
  return b
}

function varIntSizeOf(x) {
    return x < 2 ? 1 : Math.ceil(Math.log2(x)/7);
}

class BufferIterator {
  constructor(buffer) {
    this.b = buffer
    this.i = 0
  }

  readByte() {
    if(this.empty()){
      throw new Error("Buffer is empty")
    }
    var result = this.b[this.i]
    this.i++
    return result
  }

  writeByte(data) {
    if(this.empty()){
      throw new Error("Buffer too small")
    }
    this.b[this.i] = data
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

  writeBlocks(values) {
    if(values.length % 64 != 0){
      throw new Error(`Size of value array must be divisible by 64`)
    }
    var nextByte = 0
    var remainingBits = 8
    var bitsWritten = 0
    for(var i = 0; i < values.length; i++) {
      for(var j = 0; j < blockBits; j++) {
        nextByte = (nextByte << 1) + ((values[i] & (0b1 << j)) >> j)
        remainingBits--
        if(remainingBits == 0) {
          bitsWritten++
          this.writeByte(nextByte)
          nextByte = 0
          remainingBits = 8
        }
      }
    }
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


  tail(upTo) {
    if(this.empty()){
      return Buffer.alloc(0)
    }
    var result = this.b.slice(this.i, upTo)
    this.i = upTo
    return result
  }

  empty() {
    return this.i >= this.b.length
  }
}

module.exports = {
  BufferIterator: BufferIterator,
  lengthPrefixedStringBuffer: lengthPrefixedStringBuffer,
  intBuffer: intBuffer,
  unsignedByteBuffer: unsignedByteBuffer,
  varIntBuffer: varIntBuffer,
  positionBuffer: positionBuffer,
  doubleBuffer: doubleBuffer,
  floatBuffer: floatBuffer,
  arrayBuffer: arrayBuffer
}
