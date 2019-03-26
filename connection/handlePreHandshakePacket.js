const Utility = require('../utility.js');
const log = Utility.log
const Handshake = require('../packets/serverbound/handshake.js');

function handlePreHandshakePacket(connection, packet) {
  switch(packet.packetID) {
    case 0:
      var handshake = new Handshake(packet)
      connection.state = handshake.nextState
      log(`handshake with state ${connection.state}`)
      break;
    default:
      log(`state 0: unexpected packet id ${packet.packetID}`)
  }
}

module.exports = handlePreHandshakePacket
