keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const log = require('loglevel')
const Packet = require('../packet.js');
const handlePreHandshakePacket = require('./handlePreHandshakePacket.js');
const handleStatusHandshake = require('./handleStatusHandshake.js');
const localLogout = require('./handleLogout.js').local
const fullLogout = require('./handleLogout.js').full
const handleLogin = require('./handleLogin.js').local;
const proxyLogin = require('./handleLogin.js').proxy;
const serverDataPackets = require('./serverDataPackets.js');
const getServer = require('./getServer.js');
const crossBorder = require('./crossBorder.js');
const handleRemotePlayPacket = require('./handleRemotePlayPacket.js');
const handleLocalPlayPacket = require('./handleLocalPlayPacket.js');
const inspectPacket = require('./inspectPacket.js');
const KeepAliveHandler = require('./keepAlive.js');
const EndDataHandshake = require('../packets/serverbound/endDataHandshake.js')


class SocketDataHandler {
    constructor(socket, chunkMap, playerList, guestList, anchorList, eventPipes) {
      this.state = 0
      this.socket = socket
      this.chunkMap = chunkMap
      this.eventPipes = eventPipes
      this.chunkPosition = {x:0, z:0}
      this.playerList = playerList
      this.anchorList = anchorList
      this.guestList = guestList
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

    forEachPlayer(f, exceptEid) {
      this.playerList.forEach(f, exceptEid)
      this.guestList.forEach(f, exceptEid)
    }

    notify(packet) {
      var packetBuffer = packet.loadIntoBuffer()
      this.playerList.notify(packetBuffer, this.player.eid)
      this.guestList.notify(packetBuffer, this.player.eid)
      this.anchorList.notify(packetBuffer, this.player.eid)
      this.eventPipes.forEach(ep => {
        ep.socket.write(packetBuffer)
      })
    }

    createLocalPlayer(username) {
      this.player = this.playerList.createPlayer(username, this.socket)
    }

    createProxyPlayer(username) {
      this.player = this.guestList.createPlayer(username, this.socket)
    }

    removeAnchor() {
      this.anchorList.deletePlayer(this.player)
      this.playerList.addPlayer(this.player)
    }

    anchor() {
      this.anchorList.addPlayer(this.player)
      localLogout(this)
    }

    sendServerData() {
      var exceptEid = this.state == 6 ? null : this.player.eid
      serverDataPackets(this, exceptEid).forEach(packet => this.write(packet))
    }

    logout() {
      fullLogout(this)
      this.keepAliveHandler.destroy()
      if(this.proxy) { this.proxy.destroy() }
    }

    write(packet) {
      this.socket.write(packet.loadIntoBuffer())
    }

    router(packet) {
      switch (this.state) {
        case 0:
          handlePreHandshakePacket(this, packet)
          if(this.state == 5) {
            this.setToEventPipe()
          }
          if(this.state == 6) {
            this.sendServerData()
            this.write(Packet.write(EndDataHandshake,[]))
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
