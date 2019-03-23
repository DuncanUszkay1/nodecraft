const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const lengthPrefixedStringBuffer = BufferGenerators.lengthPrefixedStringBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const uuidBuffer = BufferGenerators.uuidBuffer;

var action = 0 //Add player
class NewPlayerInfo extends Packet {
  constructor(players) {
    super()
    this.packetID = 0x30
    this.dataBuffer = Buffer.concat([
      varIntBuffer(action), //Action
      varIntBuffer(players.length), //Number of players
      Buffer.concat(players.map(player => {
        return Buffer.concat([
          uuidBuffer(player.uuid),
          lengthPrefixedStringBuffer(player.username),
          varIntBuffer(0), //Number of properties
          varIntBuffer(0), //Gamemode
          varIntBuffer(40), //Ping
          unsignedByteBuffer(0) //has display name
        ])
      }))
    ])
  }
}

module.exports = NewPlayerInfo
