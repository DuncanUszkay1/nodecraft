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
    this.position = {
      x: spawnX,
      y: spawnY,
      z: spawnZ
    }
    this.oldPosition = {}
    this.eid = eid
    eid++
  }

  notify(packet) {
    this.socket.write(packet)
  }

  archivePosition() {
    Object.assign(this.oldPosition, {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z
    })
  }
}

module.exports = Player
