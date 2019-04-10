const PlayerPosition = require('../packets/serverbound/playerPosition.js');
const PlayerPositionAndLook = require('../packets/serverbound/playerPositionAndLook.js');

function updatePosition(connection, position) {
  Object.assign(connection.player, {
    position: {
      x: position.x,
      y: position.y,
      z: position.z
    },
  })
}

function keepAlive(connection, packet) {
  if (connection.keepAlivePacket && !packet.dataEquals(connection.keepAlivePacket)) {
    connection.socket.destroy()
  }
  connection.keepAliveTimeout.forEach(clearTimeout)
}

function inspectPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x0E:
      keepAlive(connection, packet)
      break;
    case 0x10:
    case 0x11:
      connection.player.archivePosition()
    case 0x10:
      updatePosition(connection, new PlayerPosition(packet))
      break;
    case 0x11:
      updatePosition(connection, new PlayerPositionAndLook(packet))
      break;
    case 0xA0:
      break;
  }
}

module.exports = inspectPacket
