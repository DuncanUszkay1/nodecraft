const identify = require('./identify.js');
const Packet = require('./packet.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const log = require('loglevel')

function localizeClientboundPacket(packet, x, z, eidTable) {
  var packetType = identify.clientbound(packet)
  return localize(packet, packetType, x, z, eidTable)
}

function localizeServerboundPacket(packet, x, z, eidTable) {
  var packetType = identify.serverbound(packet)
  return localize(packet, packetType, x, z, eidTable)
}

function localize(packet, packetType, x, z, eidTable) {
  if(packetType == LoginSuccess) {
    log.debug('Successfully logged into peer')
    return null
  } else if(packetType == null) {
    return packet
  }
  var parsedPacket = new packetType(packet)
  parsedPacket.localize(x, z, eidTable)
  return parsedPacket
}

module.exports = {
  clientbound: localizeClientboundPacket,
  serverbound: localizeServerboundPacket
}
