const Packet = require('../packet.js')
const PlayerDigging = require('../packets/serverbound/playerDigging.js')
const BlockChange = require('../packets/clientbound/blockChange.js')
const RelativeEntityMove = require('../packets/clientbound/RelativeEntityMove.js')
const EntityHeadMove = require('../packets/clientbound/entityHeadMove.js')

function playerDigging(packet) { //shitlist
  var playerDigging = Packet.read(PlayerDigging,packet)
  var blockChange = Packet.write(BlockChange,[playerDigging]);
  return blockChange
}

function handleLocalPlayPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x10:
    case 0x11:
    case 0x12:
      connection.notify(Packet.write(RelativeEntityMove,[connection.player]))
      connection.notify(Packet.write(EntityHeadMove,[connection.player]))
      break;
    case 0x18:
      connection.notify(playerDigging(packet))
      break;
  }
}

module.exports = handleLocalPlayPacket
