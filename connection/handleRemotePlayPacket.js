const localizePacket = require('../localize.js');

function handleRemotePlayPacket(connection, server, packet) {
  var localizedPacket = localizePacket.serverbound(packet, 0, 1, {})
  if(localizedPacket && connection.proxy) {
    connection.proxy.write(localizedPacket.loadIntoBuffer())
  }
}

module.exports = handleRemotePlayPacket
