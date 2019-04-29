const Packet = require('../../packet.js');
const ByteStream = require('../../byteStream.js');
const getEid = require('../../eid.js');

class RelativeEntityMove extends Packet {
  constructor(packet){
    super()
    Object.assign(this, packet)
  }

  localize(x, z, eidTable) {
    if(eidTable) {
      var bs = new ByteStream(Buffer.from(this.dataBuffer))
      bs.amendVarInt(i => eidTable[i])
      this.dataBuffer = bs.buffer
    }
  }
}

module.exports = RelativeEntityMove
