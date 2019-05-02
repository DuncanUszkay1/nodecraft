const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require("../../byteStream.js");

class RelativeEntityMove extends Packet {
  write(player){
    this.packetID = 0x29
    var diffFactor = 128 * 32
    this.deltaX = (player.position.x - player.oldPosition.x) * diffFactor
    this.deltaY = (player.position.y - player.oldPosition.y) * diffFactor
    this.deltaZ = (player.position.z - player.oldPosition.z) * diffFactor
    this.yaw = player.position.yaw
    this.pitch = player.position.pitch
    this.dataBuffer = Buffer.concat([
      BG.varInt(player.eid),
      BG.short(this.deltaX),
      BG.short(this.deltaY),
      BG.short(this.deltaZ),
      BG.angle(this.yaw),
      BG.angle(this.pitch),
      BG.unsignedByte(0)
    ])
  }

  localize(x, z, eidTable) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.amendVarInt(i => eidTable[i])
    this.dataBuffer = bs.buffer
  }
}

module.exports = RelativeEntityMove
