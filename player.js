const uuid = require('uuid/v1');

var eid = 1
var spawnX = 8
var spawnY = 16
var spawnZ = 8

class Player {
  constructor(username, socket) {
    this.username = username
    this.socket = socket
    this.uuid = uuid()
    this.x = spawnX
    this.y = spawnY
    this.z = spawnZ
    this.eid = eid
    eid++
  }

  notify(packet) {
    this.socket.write(packet)
  }
}

module.exports = Player
