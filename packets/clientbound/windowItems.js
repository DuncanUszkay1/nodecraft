const uuid = require('uuid/v1');
const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class WindowItems extends Packet {
  write(windowID, slots){
    this.packetID = 0x15
    this.dataBuffer = Buffer.concat([
      BG.unsignedByte(windowID),
      BG.short(slots.length),
      BG.array(slots, BG.slot)
    ])
  }
}

module.exports = WindowItems
