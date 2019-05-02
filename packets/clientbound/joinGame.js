const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

const tempHardcode = {
  gamemode: 1,
  dimension: 0,
  difficulty: 0,
  maxPlayers: 100,
  levelType: 'flat',
  reducedDebugInfo: 0
}

class JoinGame extends Packet {
  write(eid){
    this.packetID = 0x25
    this.eid = eid
    this.gamemode = tempHardcode.gamemode
    this.dimension = tempHardcode.dimension
    this.difficulty = tempHardcode.difficulty
    this.maxPlayers = tempHardcode.maxPlayers
    this.levelType = tempHardcode.levelType
    this.reducedDebugInfo = tempHardcode.reducedDebugInfo
    this.dataBuffer = Buffer.concat([
      BG.int(this.eid),
      BG.unsignedByte(this.gamemode),
      BG.int(this.dimension),
      BG.unsignedByte(this.difficulty),
      BG.unsignedByte(this.maxPlayers),
      BG.string(this.levelType),
      BG.unsignedByte(this.reducedDebugInfo),
    ])
  }
}

module.exports = JoinGame
