const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require('../../bytestream.js');

class EntityTeleport extends Packet {
  write(player){
    this.packetID = 0x50
    this.x = player.position.x
    this.y = player.position.y
    this.z = player.position.z
    this.yaw = 0
    this.pitch = 0
    this.dataBuffer = Buffer.concat([
      BG.varInt(player.eid),
      BG.double(this.x),
      BG.double(this.y),
      BG.double(this.z),
      BG.unsignedByte(this.yaw),
      BG.unsignedByte(this.pitch),
      BG.unsignedByte(0)
    ])
  }

  localize(x, z) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    bs.readVarInt();
    bs.amendDouble(d => d + x*16)
    bs.readDouble();
    bs.amendDouble(d => d + z*16)
    this.dataBuffer = bs.buffer
  }
}

module.exports = EntityTeleport
