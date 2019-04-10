const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');
const getEid = require('../../eid.js');

class SpawnPlayer extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
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
    bs.amendDouble(d => d + 16*x)
    bs.readDouble()
    bs.amendDouble(d => d + 16*z)
    this.dataBuffer = bs.buffer
  }
}

module.exports = SpawnPlayer
