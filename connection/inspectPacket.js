const PlayerPosition = require('../packets/serverbound/playerPosition.js');
const PlayerPositionAndLook = require('../packets/serverbound/playerPositionAndLook.js');
const PlayerLook = require('../packets/serverbound/playerLook.js');
const log = require('loglevel')

function updatePosition(connection, position) {
  Object.assign(connection.player.position, {
    x: position.x,
    y: position.y,
    z: position.z,
  })
}

function updateLook(connection, position) {
  Object.assign(connection.player.position, {
    pitch: position.pitch,
    yaw: position.yaw
  })
}

function inspectPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x0E:
      connection.keepAlivePacket(packet)
      break;
    case 0x10:
    case 0x11:
      connection.player.archivePosition()
    case 0x10:
      updatePosition(connection, new PlayerPosition(packet))
      break;
    case 0x11:
      readPacket = new PlayerPositionAndLook(packet)
      updatePosition(connection, readPacket)
      updateLook(connection, readPacket)
      break;
    case 0x12:
      updateLook(connection, new PlayerLook(packet))
      break;
    case 0xA0:
      break;
  }
}

module.exports = inspectPacket
