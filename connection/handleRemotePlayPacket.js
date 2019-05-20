const localizePacket = require('../localize.js');

function handleRemotePlayPacket(connection, server, x, z, packet) {
  var localizedPacket = localizePacket.serverbound(packet, x, z, {})
  if(localizedPacket && connection.proxy) {
    connection.proxy.write(localizedPacket.loadIntoBuffer())
  }
}

module.exports = handleRemotePlayPacket
