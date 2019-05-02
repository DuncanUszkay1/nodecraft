const Player = require('./player.js')
const log = require('loglevel')

class PlayerList {
  constructor() {
    this.players = {}
  }

  createPlayer(username, socket) {
    return new Player(username, socket)
  }

  addPlayer(player) {
    this.players[player.uuid] = player
  }

  deletePlayer(player) {
    delete this.players[player.uuid]
  }

  notify(packet, exceptEid) {
    this.forEach(player => player.notify(packet), exceptEid)
  }

  forEach(f, exceptEid) {
    for(var uuid in this.players) {
      if(!exceptEid || this.players[uuid].eid != exceptEid) {
        f(this.players[uuid])
      }
    }
  }

  print(f) {
    var str = ''
    for(var uuid in this.players) {
      str += this.players[uuid].username + ','
    }
    f(str)
  }
}

module.exports = PlayerList
