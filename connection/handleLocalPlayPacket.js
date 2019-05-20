const Packet = require('../packet.js')
const PlayerDigging = require('../packets/serverbound/playerDigging.js')
const ClickWindow = require('../packets/serverbound/clickWindow.js')
const CreativeClickWindow = require('../packets/serverbound/creativeClickWindow.js')
const ChangeHeldItem = require('../packets/serverbound/changeHeldItem.js')
const ChatMessage = require('../packets/serverbound/chatMessage.js')
const BlockChange = require('../packets/clientbound/blockChange.js')
const applyChatCommand = require('./chatCommands.js')

const reactions = {
  0x02: (connection, packet) => {
    applyChatCommand(connection, Packet.read(ChatMessage, packet).msg)
  },
  0x10: (connection, packet) => { connection.updatePlayerMovement() },
  0x11: (connection, packet) => { connection.updatePlayerMovement() },
  0x12: (connection, packet) => { connection.updatePlayerMovement() },
  0x18: (connection, packet) => {
    var playerDigging = Packet.read(PlayerDigging,packet)
    var blockChange = Packet.write(BlockChange,[playerDigging]);
    connection.notify(blockChange)
  },
  0x21: (connection, packet) => {
    connection.player.handleHotbarChange(Packet.read(ChangeHeldItem,packet))
  },
  0x24: (connection, packet) => {
    connection.player.handleWindowClick(Packet.read(CreativeClickWindow,packet))
  }
}

function handleLocalPlayPacket(connection, packet) {
  if(reactions[packet.packetID.toString()]) {
    reactions[packet.packetID.toString()](connection, packet)
  }
}

module.exports = handleLocalPlayPacket
