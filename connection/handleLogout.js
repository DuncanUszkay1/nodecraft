const log = require('loglevel')
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')

function handleLogout(connection) {
  if(connection.player) {
    connection.playerList.deletePlayer(connection.player)
    connection.notify(new DeleteEntities([connection.player.eid]))
  }
}

module.exports = handleLogout
