const Player = require('./player.js')

class PlayerList {
  constructor() {
    this.players = []
  }

  createPlayer(username, socket) {
    return new Player(username, socket)
  }

  addPlayer(player) {
    console.log(`adding player`)
    this.players.push(player)
  }

  notify(packet, exceptEid) {
    this.players.filter(player => !exceptEid || player.eid != exceptEid).map(p => p.notify(packet))
  }
}

module.exports = PlayerList
