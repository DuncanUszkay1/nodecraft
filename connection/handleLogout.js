const log = require('loglevel')
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')
const Packet = require('../packet.js');

function removePlayer(connection) {
  connection.notify(Packet.write(DeleteEntities,[[connection.player.eid]]))
}

function localLogout(connection) {
  if(connection.player) {
    connection.playerList.deletePlayer(connection.player)
    removePlayer(connection)
  }
}

function fullLogout(connection) {
  if(connection.player) {
    log.debug(`User ${connection.player.username} has exited server`)
    connection.playerList.deletePlayer(connection.player)
    connection.guestList.deletePlayer(connection.player)
    connection.anchorList.deletePlayer(connection.player)
    log.debug(connection.guestList[connection.player.uuid])
    removePlayer(connection)
  }
}

module.exports = {
  local: localLogout,
  full: fullLogout
}
