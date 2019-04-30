const SERVER_LOGGING = true;
keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const net = require('net')
const Utility = require('../utility.js');
const log = Utility.log
const Packet = require('../packet.js');
const KeepAlive = require('../packets/clientbound/keepAlive.js')
const localizePacket = require('../localize.js');
const handlePreHandshakePacket = require('./handlePreHandshakePacket.js');
const handleStatusHandshake = require('./handleStatusHandshake.js');
const handleLocalLogin = require('./handleLogin.js').handleLocalLogin;
const handleRemoteLogin = require('./handleLogin.js').handleRemoteLogin;
const handlePlayPacket = require('./handlePlayPacket.js');


class SocketDataHandler {
    constructor(socket, chunkMap, playerMap, playerList) {
      this.state = 0
      this.socket = socket
      this.chunkMap = chunkMap
      this.playerMap = playerMap
      this.playerList = playerList
      this.keepAliveTimeout = []
      this.remoteServer = null
      this.player = null
    }

    close() {
        clearInterval(this.keepAliveInterval)
    }

    keepAlive() {
      this.keepAlivePacket = new KeepAlive()
      this.keepAliveTimeout.push(setTimeout(() => this.socket.destroy(), keepAliveMaxWaitForResponse))
      this.socket.write(this.keepAlivePacket.loadIntoBuffer());
    }

    router(packet) {
      var actions = []
      switch (this.state) {
        case 0:
          actions.push(handlePreHandshakePacket)
          break;
        case 1:
          actions.push(handleStatusHandshake)
          break;
        case 2:
          actions.push(handleLocalLogin)
          break;
        case 3:
          actions.push(handleRemoteLogin)
          break;
        case 4:
        case 5:
          actions.push(handlePlayPacket)
          break;
      }
      return actions
    }

    socketData(data) {
      Packet.loadFromBuffer(data).forEach(packet => {
        this.router(packet).forEach(action => action(this, packet))
      });
    }
}

module.exports = SocketDataHandler
