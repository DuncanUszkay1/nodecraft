const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;
const intBuffer = BufferGenerators.intBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;

const tempHardcode = {
  eid: 1,
  gamemode: 1,
  dimension: 0,
  difficulty: 0,
  maxPlayers: 100,
  levelType: 'flat',
  reducedDebugInfo: 0
}

class JoinGame extends Packet {
  constructor(username){
    super()
    this.packetID = 0x25
    this.eid = tempHardcode.eid
    this.gamemode = tempHardcode.gamemode
    this.dimension = tempHardcode.dimension
    this.difficulty = tempHardcode.difficulty
    this.maxPlayers = tempHardcode.maxPlayers
    this.levelType = tempHardcode.levelType
    this.reducedDebugInfo = tempHardcode.reducedDebugInfo
    this.dataBuffer = Buffer.concat([
      intBuffer(this.eid),
      unsignedByteBuffer(this.gamemode),
      intBuffer(this.dimension),
      unsignedByteBuffer(this.difficulty),
      unsignedByteBuffer(this.maxPlayers),
      lengthPrefixedStringBuffer(this.levelType),
      unsignedByteBuffer(this.reducedDebugInfo),
    ])
  }
}

module.exports = JoinGame
