const ByteStream = require('../../byteStream.js');
const Packet = require('../../packet')
const BufferGenerators = require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;
const positionBuffer = BufferGenerators.positionBuffer;


class ProxyLoginStart extends Packet {
  constructor(username, position){
    super()
    this.packetID = 0
    this.dataBuffer = Buffer.concat([
      lengthPrefixedStringBuffer(username),
      positionBuffer(position)
    ])
  }
}

module.exports = ProxyLoginStart
