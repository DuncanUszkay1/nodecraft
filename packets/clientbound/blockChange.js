const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require('../../byteStream.js');

class BlockChange extends Packet {
  read(bs) {
    this.position = bs.readPosition()
  }

  write(playerDigging) {
    this.packetID = 0x0B
    this.dataBuffer = Buffer.concat([
        BG.position(playerDigging.position),
        BG.varInt(0)
    ])
  }

  localize(x, z) {
    this.position.x = x*16 + this.position.x
    this.position.z = z*16 + this.position.z
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.writePosition(this.position)
    this.dataBuffer = bs.buffer
  }
}

module.exports = BlockChange
