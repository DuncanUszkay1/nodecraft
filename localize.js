const identify = require('./identify.js');
const Packet = require('./packet.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const log = require('./utility.js').log

function localizePacket(packet, x, z, eidTable, ctx) { //shitlist: ctx arg?
  var packetType = identify(packet, ctx)
  if(packetType == LoginSuccess) {
    log('Successfully logged into peer')
    return null
  } else if(packetType == null) {
    return packet
  }
  var parsedPacket = new packetType(packet)
  parsedPacket.localize(x, z, eidTable)
  return parsedPacket
}

module.exports = localizePacket
