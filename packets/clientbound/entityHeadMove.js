const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require("../../byteStream.js");

class EntityHeadMove extends Packet {
  write(player){
    this.packetID = 0x39
    this.yaw = player.position.yaw
    this.dataBuffer = Buffer.concat([
      BG.varInt(player.eid),
      BG.angle(this.yaw)
    ])
  }

  localize(x, z, eidTable) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.amendVarInt(i => eidTable[i])
    this.dataBuffer = bs.buffer
  }
}

module.exports = EntityHeadMove
