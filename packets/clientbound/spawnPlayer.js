const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require('../../bytestream.js');
const getEid = require('../../eid.js');

class SpawnPlayer extends Packet {
  write(player){
    var ya = 0
    var p = 0
    this.packetID = 0x05
    this.dataBuffer = Buffer.concat([
      BG.varInt(player.eid),
      BG.uuid(player.uuid),
      BG.double(player.position.x),
      BG.double(player.position.y),
      BG.double(player.position.z),
      BG.float(ya),
      BG.float(p),
      BG.unsignedByte(0xff) //Entity Metadata Terminator
    ])
  }

  localize(x, z, eidTable) {
    var bs = new ByteStream(Buffer.from(this.dataBuffer))
    if(eidTable) {
      bs.amendVarInt(i => {
        if(!eidTable.hasOwnProperty(i)) { eidTable[i] = getEid() }
        return eidTable[i]
      })
    } else {
      bs.readVarInt()
    }
    bs.i += 16
    bs.amendDouble(d => { return d + 16*x })
    bs.readDouble()
    bs.amendDouble(d => { return d + 16*z })
    //bs.amendDouble(d => d + 16*z)
    this.dataBuffer = bs.buffer
  }
}

module.exports = SpawnPlayer
