const ServerboundPlayerPosition = require('../packets/serverbound/playerPosition.js')
const ServerboundPlayerPositionAndLook = require('../packets/serverbound/playerPositionAndLook.js')
const ServerboundBorderCrossing = require('../packets/serverbound/borderCrossing.js')
const RelativeEntityMove = require('../packets/clientbound/RelativeEntityMove.js')
const EntityTeleport = require('../packets/clientbound/entityTeleport.js')
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')
const BorderCrossing = require('../packets/clientbound/borderCrossing.js')
const PlayerDigging = require('../packets/serverbound/playerDigging.js')
const BlockChange = require('../packets/clientbound/blockChange.js')
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const localizePacket = require('../localize.js');

function playerDigging(connection, packet) { //shitlist
  var playerDigging = new PlayerDigging(packet)
  var blockChange = new BlockChange(playerDigging);
  return blockChange
}

function handleLocalPlayPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x10:
    case 0x11:
      connection.notify(new RelativeEntityMove(connection.player))
      break;
    case 0x18:
      connection.notify(playerDigging(packet))
      break;
  }
}

module.exports = handleLocalPlayPacket
