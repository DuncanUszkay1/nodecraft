const log = require('loglevel')
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')
const Packet = require('../packet.js');

function handleLogout(connection) {
  if(connection.player) {
    connection.playerList.deletePlayer(connection.player)
    connection.notify(Packet.write(DeleteEntities,[[connection.player.eid]]))
  }
}

module.exports = handleLogout
