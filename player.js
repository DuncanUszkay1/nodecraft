const uuid = require('uuid/v1');
const getEid = require('./eid.js');

var spawnX = 8
var spawnY = 16
var spawnZ = 3
var spawnPitch = 64
var spawnYaw = 64

class Player {
  constructor(username, socket) {
    this.username = username
    this.socket = socket
    this.uuid = uuid()
    this.position = {
      x: spawnX,
      y: spawnY,
      z: spawnZ,
      pitch: spawnPitch,
      yaw: spawnYaw
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
      z: this.position.z,
      pitch: this.position.pitch,
      yaw: this.position.yaw
    })
  }
}

module.exports = Player
