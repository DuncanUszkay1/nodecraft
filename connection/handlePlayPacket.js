const ServerboundPlayerPosition = require('../packets/serverbound/playerPosition.js')
const RelativeEntityMove = require('../packets/clientbound/RelativeEntityMove.js')
const PlayerDigging = require('../packets/serverbound/playerDigging.js')
const BlockChange = require('../packets/clientbound/blockChange.js')
const localizePacket = require('../localize.js');

function getServer(connection) {
  return connection.chunkMap.getServer(
    Math.floor(connection.player.position.x/16),
    Math.floor(connection.player.position.z/16)
  )
}

function playPacketIntake(connection, packet) {
  switch(packet.packetID) { //Packets that must be read regardless of player pos
    case 0x0E:
      if (connection.keepAlivePacket && !packet.dataEquals(connection.keepAlivePacket)) {
        connection.socket.destroy()
      }
      connection.keepAliveTimeout.forEach(clearTimeout)
      return;
    case 0x10:
      var playerPosition = new ServerboundPlayerPosition(packet)
      connection.player.archivePosition()
      Object.assign(connection.player, {
        position: {
          x: playerPosition.x,
          y: playerPosition.y,
          z: playerPosition.z
        },
      })
      break;
  }
}

function processLocal(connection, packet) {
  var notificationPacket = null
  switch(packet.packetID) {
    case 0x10:
      notificationPacket = new RelativeEntityMove(connection.player)
      break;
    case 0x18:
      notificationPacket = playerDigging(connection, packet)
      break;
  }
  if(notificationPacket) {
    connection.playerList.notify(notificationPacket.loadIntoBuffer(), connection.player.eid)
  }
}

function sendRemote(connection, server, packet) {
  var localizedPacket = localizePacket(packet, 0, 1, 0)
  if(localizedPacket) {
    server.connection.write(localizedPacket.loadIntoBuffer())
  }
}

function playerDigging(connection, packet) {
  var playerDigging = new PlayerDigging(packet)
  var blockChange = new BlockChange(playerDigging);
  return blockChange
}

function handlePlayPacket(connection, packet) {
  playPacketIntake(connection, packet)
  if(connection.state == 4) { //Play
    var server = getServer(connection)
    if(server && !server.localhost) {
      sendRemote(connection, server, packet)
    } else { //If the player is in our region
      processLocal(connection, packet)
    }
  }
}

module.exports = handlePlayPacket
