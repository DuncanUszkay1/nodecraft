const uuid = require('uuid/v1');
const getEid = require('./eid.js');

var spawnX = 8
var spawnY = 16
var spawnZ = 3

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
    this.eid = getEid()
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
