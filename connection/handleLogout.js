const log = require('loglevel')
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')
const Packet = require('../packet.js');

function handleLogout(connection) {
  if(connection.player) {
    log.debug(`Removing ${connection.player.username} from guests or players`)
    connection.playerList.deletePlayer(connection.player)
    connection.guestList.deletePlayer(connection.player)
    connection.notify(Packet.write(DeleteEntities,[[connection.player.eid]]))
  }
}

module.exports = handleLogout
