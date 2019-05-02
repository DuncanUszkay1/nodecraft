const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

var action = 0 //Add player
class NewPlayerInfo extends Packet {
  write(players) {
    this.packetID = 0x30
    this.dataBuffer = Buffer.concat([
      BG.varInt(action), //Action
      BG.varInt(players.length), //Number of players
      Buffer.concat(players.map(player => {
        return Buffer.concat([
          BG.uuid(player.uuid),
          BG.string(player.username),
          BG.varInt(0), //Number of properties
          BG.varInt(0), //Gamemode
          BG.varInt(40), //Ping
          BG.unsignedByte(0) //has display name
        ])
      }))
    ])
  }
}

module.exports = NewPlayerInfo
