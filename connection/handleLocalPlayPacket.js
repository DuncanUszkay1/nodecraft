const Packet = require('../packet.js')
const PlayerDigging = require('../packets/serverbound/playerDigging.js')
const ClickWindow = require('../packets/serverbound/clickWindow.js')
const CreativeClickWindow = require('../packets/serverbound/creativeClickWindow.js')
const ChangeHeldItem = require('../packets/serverbound/changeHeldItem.js')
const BlockChange = require('../packets/clientbound/blockChange.js')
const RelativeEntityMove = require('../packets/clientbound/RelativeEntityMove.js')
const EntityHeadMove = require('../packets/clientbound/entityHeadMove.js')

function playerDigging(packet) { //shitlist
  var playerDigging = Packet.read(PlayerDigging,packet)
  var blockChange = Packet.write(BlockChange,[playerDigging]);
  return blockChange
}

function clickWindow(packet) {
  var clickWindow = Packet.read(ClickWindow,packet)
  console.log(clickWindow)
}

function handleLocalPlayPacket(connection, packet) {
  switch(packet.packetID) {
    case 0x08:
      clickWindow(packet)
      break;
    case 0x10:
    case 0x11:
    case 0x12:
      connection.notify(Packet.write(RelativeEntityMove,[connection.player]))
      connection.notify(Packet.write(EntityHeadMove,[connection.player]))
      break;
    case 0x18:
      connection.notify(playerDigging(packet))
      break;
    case 0x21:
      connection.player.handleHotbarChange(Packet.read(ChangeHeldItem,packet))
      break;
    case 0x24:
      connection.player.handleWindowClick(Packet.read(CreativeClickWindow,packet))
      break;
  }
}

module.exports = handleLocalPlayPacket
