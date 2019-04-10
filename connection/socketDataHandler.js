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
const DeleteEntities = require('../packets/clientbound/deleteEntities.js')

const handleStatusHandshake = require('./handleStatusHandshake.js');
const handleLogin = require('./handleLogin.js').local;
const proxyLogin = require('./handleLogin.js').proxy;
const remoteDataHandshake = require('./remoteDataHandshake.js');
const getServer = require('./getServer.js');
const crossBorder = require('./crossBorder.js');
const handleRemotePlayPacket = require('./handleRemotePlayPacket.js');
const handleLocalPlayPacket = require('./handleLocalPlayPacket.js');
const inspectPacket = require('./inspectPacket.js');


class SocketDataHandler {
    constructor(socket, chunkMap, playerList, eventPipes) {
      this.state = 0
      this.socket = socket
      this.chunkMap = chunkMap
      this.eventPipes = eventPipes
      this.chunkPosition = {x:0, z:0}
      this.playerList = playerList
      this.keepAliveTimeout = []
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
      if(this.player) {
        this.playerList.deletePlayer(this.player)
        this.notify(new DeleteEntities([this.player.eid]))
      }
    }

    write(packet) {
      this.socket.write(packet.loadIntoBuffer())
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
