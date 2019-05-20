const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class BorderCrossing extends Packet {
  read(bs) {
    bs.readVarInt()
    this.x = bs.readDouble()
    this.y = bs.readDouble()
    this.z = bs.readDouble()
  }

  write(player){
    this.packetID = 0xA0
    this.x = player.position.x
    this.y = player.position.y
    this.z = player.position.z
    this.dataBuffer = Buffer.concat([
      BG.varInt(player.eid),
      BG.double(this.x),
      BG.double(this.y),
      BG.double(this.z)
    ])
  }

}

module.exports = BorderCrossing
