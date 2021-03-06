const PlayerPosition = require('../packets/serverbound/playerPosition.js');
const PlayerPositionAndLook = require('../packets/serverbound/playerPositionAndLook.js');
const PlayerLook = require('../packets/serverbound/playerLook.js');
const Packet = require('../packet.js')
const log = require('loglevel')

function updatePosition(connection, position) {
  if(position.y == 0) logtrace(position.y)
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

function handlePositionChange(connection, packet) {
  switch(packet.packetID) {
    case 0x10:
      updatePosition(connection, Packet.read(PlayerPosition,packet))
      break;
    case 0x11:
      readPacket = Packet.read(PlayerPositionAndLook,packet)
      updatePosition(connection, readPacket)
      updateLook(connection, readPacket)
      break;
    case 0x12:
      updateLook(connection, Packet.read(PlayerLook,packet))
      break;
  }
}

function inspectPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x0E:
      connection.keepAlivePacket(packet)
      break;
    case 0x10:
    case 0x11:
    case 0x12:
      connection.player.archivePosition()
      handlePositionChange(connection, packet)
      break;
    case 0xA0:
      break;
  }
}

module.exports = inspectPacket
