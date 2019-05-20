const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');
const ByteStream = require("../../byteStream.js");

class DeleteEntities extends Packet {
  write(entityIDs) {
    this.packetID = 0x35
    this.dataBuffer = Buffer.concat([
      BG.varInt(entityIDs.length),
      Buffer.concat(entityIDs.map(e => BG.varInt(e)))
    ])
  }

  localize(x, z, eidTable) {
    if(eidTable) {
      var bs = new ByteStream(Buffer.from(this.dataBuffer))
      var length = bs.readVarInt()
      for(var i = 0; i < length; i++) {
        bs.amendVarInt(eid => eidTable[eid])
      }
      this.dataBuffer = bs.buffer
    }
  }
}

module.exports = DeleteEntities
