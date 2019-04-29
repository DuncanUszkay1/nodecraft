const Packet = require('./packet.js');
const ChunkData = require('./packets/serverbound/chunkData.js');
const PlayerPosition = require('./packets/serverbound/playerPosition.js');
const PlayerPositionAndLook = require('./packets/serverbound/playerPositionAndLook.js');
const EntityTeleport = require('./packets/serverbound/entityTeleport.js');
const RelativeEntityMove = require('./packets/serverbound/relativeEntityMove.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const SpawnPlayer = require('./packets/serverbound/spawnPlayer.js');
const BorderCrossing = require('./packets/serverbound/borderCrossing.js');
const PlayerDigging = require('./packets/serverbound/playerDigging.js');
const NewPlayerInfo = require('./packets/serverbound/newPlayerInfo.js');
const DeleteEntities = require('./packets/serverbound/deleteEntities.js');
const BlockChange = require('./packets/serverbound/blockChange.js');
const log = require('loglevel')

function identifyClientbound(packet) {
  switch(packet.packetID){
    case 0x22:
      return ChunkData
    case 0x05:
      return SpawnPlayer
    case 0x30:
      return NewPlayerInfo
    case 0x29:
      return RelativeEntityMove
    case 0x35:
      return DeleteEntities
    case 0x50:
      return EntityTeleport
    case 0xA0:
      return BorderCrossing
    case 0x02:
      return LoginSuccess
    case 0x0B:
      return BlockChange
    default:
      log.debug(`Unrecognized packet ID ${packet.packetID}`)
      break;
  }
  return null
}

function identifyServerbound(packet) {
  switch(packet.packetID){
    case 0x10:
      return PlayerPosition
    case 0x11:
      return PlayerPositionAndLook
    case 0x18:
      return PlayerDigging
    default:
      log.debug(`Unrecognized packet ID ${packet.packetID}`)
      break;
  }
  return null
}

module.exports = {
  clientbound: identifyClientbound,
  serverbound: identifyServerbound
}
