class BufferIterator{
  constructor(buffer) {
    this.b = buffer
    this.i = 0
  }

  readByte() {
    if(this.i >= this.b.length){
      throw new Error("Buffer is empty")
    }
    var result = this.b[this.i]
    this.i++
    return result
  }

  writeByte(data) {
    if(this.i >= this.b.length){
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

  readByteArray() {
    var result = []
    while(this.i < this.b.length){
      result.push(this.readByte());
    }
    return result
  }
}

module.exports = BufferIterator;
