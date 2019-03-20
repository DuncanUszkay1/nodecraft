const Packet = require('./packet.js');
const ChunkData = require('./packets/serverbound/chunkData.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');


//CTX:
//0: Clientbound Play Mode
function identify(packet, ctx) {
  switch(ctx){
    case 0:
      switch(packet.packetID){
        case 0x22:
          return ChunkData
          break;
        case 2:
          return LoginSuccess
        default:
          throw new Error(`Unrecognized packet ID ${packet.packetID}`)
      }
      break;
    default:
      throw new Error("Invalid Context")
  }
}

module.exports = identify
