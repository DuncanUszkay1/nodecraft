keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const log = require('loglevel')
const Packet = require('../packet.js');
const handlePreHandshakePacket = require('./handlePreHandshakePacket.js');
const handleStatusHandshake = require('./handleStatusHandshake.js');
const handleLogout = require('./handleLogout.js')
const handleLogin = require('./handleLogin.js').local;
const proxyLogin = require('./handleLogin.js').proxy;
const remoteDataHandshake = require('./remoteDataHandshake.js');
const getServer = require('./getServer.js');
const crossBorder = require('./crossBorder.js');
const handleRemotePlayPacket = require('./handleRemotePlayPacket.js');
const handleLocalPlayPacket = require('./handleLocalPlayPacket.js');
const inspectPacket = require('./inspectPacket.js');
const KeepAliveHandler = require('./keepAlive.js');


class SocketDataHandler {
    constructor(socket, chunkMap, playerList, eventPipes) {
      this.state = 0
      this.socket = socket
      this.chunkMap = chunkMap
      this.eventPipes = eventPipes
      this.chunkPosition = {x:0, z:0}
      this.playerList = playerList
      this.keepAliveHandler = new KeepAliveHandler(
        this,
        keepAliveSendInterval,
        keepAliveMaxWaitForResponse
      )
      this.remoteServer = null
      this.player = null
      this.proxy = null
    }

    setToEventPipe() {
      this.eventPipes.push(this)
    }

    setProxyServer(proxy) {
      this.proxy = proxy
    }

    keepAlive() {
      this.keepAliveHandler.bind()
    }

    keepAlivePacket(packet) {
      this.keepAliveHandler.check(packet)
    }

    forEachPlayer(f) {
      this.playerList.forEach(f)
    }

    notify(packet) {
      var packetBuffer = packet.loadIntoBuffer()
      this.playerList.notify(packetBuffer, this.player.eid)
      this.eventPipes.forEach(ep => {
        ep.socket.write(packetBuffer)
      })
    }

    logout() {
      handleLogout(this)
    }

    write(packet) {
      this.socket.write(packet.loadIntoBuffer())
    }

    close() {
      clearInterval(this.keepAliveInterval)
    }

    router(packet) {
      switch (this.state) {
        case 0:
          handlePreHandshakePacket(this, packet)
          if(this.state == 5) {
            this.setToEventPipe()
          }
          if(this.state == 6) {
            remoteDataHandshake(this, packet)
          }
          break;
        case 1:
          handleStatusHandshake(this, packet)
          break;
        case 2:
          handleLogin(this, packet)
          break;
        case 3:
          proxyLogin(this, packet)
          break;
        case 4:
          inspectPacket(this, packet)
          var serverRetrival = getServer(this)
          if(serverRetrival.borderCrossing) {
            crossBorder(this, serverRetrival.server, serverRetrival.exitingLocal)
          }
          if(serverRetrival.server.localhost) {
            handleLocalPlayPacket(this, packet)
          } else {
            handleRemotePlayPacket(this, serverRetrival.server, packet)
          }
          break;
        case 6:
          break;
        case 7:
          inspectPacket(this, packet)
          handleLocalPlayPacket(this, packet)
          break;
      }
    }

    socketData(data) {
      Packet.loadFromBuffer(data).forEach(packet => {
        this.router(packet)
      });
    }
}

module.exports = SocketDataHandler
