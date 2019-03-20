const identify = require('./identify.js');
const Packet = require('./packet.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const log = require('./utility.js').log

function localizePacket(packetData, x, z) {
  var packet = Packet.loadFromBuffer(packetData)[0]
  var packetType = identify(packet, 0)
  if(packetType == LoginSuccess) {
    log('Successfully logged into peer')
    return null
  }
  var parsedPacket = new packetType(packet)
  parsedPacket.localize(x, z)
  return parsedPacket.loadIntoBuffer()
}

module.exports = localizePacket
