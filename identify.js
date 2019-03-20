const Packet = require('./packet.js');
const ChunkData = require('./packets/serverbound/chunkData.js');
const PlayerPosition = require('./packets/serverbound/playerPosition.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const log = require('./utility.js').log


//CTX:
//0: Clientbound Play Mode
//1: Serverbound Play Mode
function identify(packet, ctx) {
  switch(ctx){
    case 0:
      switch(packet.packetID){
        case 0x22:
          return ChunkData
        case 2:
          return LoginSuccess
        default:
          log(`Unrecognized packet ID ${packet.packetID}`)
      }
      //break;
    case 1:
      switch(packet.packetID){
        case 0x10:
          return PlayerPosition
        default:
          log(`Unrecognized packet ID ${packet.packetID}`)
      }
      break;
    default:
      log(`Invalid Context: ${ctx}`)
  }
  return null
}

module.exports = identify
