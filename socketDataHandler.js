const SERVER_LOGGING = true;
keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const net = require('net')
const Utility = require('./utility.js');
const log = Utility.log
const Packet = require('./packet.js');
const Handshake = require('./packets/serverbound/handshake.js');
const LoginStart = require('./packets/serverbound/loginStart.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const StatusResponse = require('./packets/clientbound/statusResponse.js');
const SpawnPosition = require('./packets/clientbound/spawnPosition.js');
const PlayerPosition = require('./packets/clientbound/playerPosition.js');
const SpawnPlayer = require('./packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('./packets/clientbound/newPlayerInfo.js');
const RelativeEntityMove = require('./packets/clientbound/relativeEntityMove.js');
const ServerboundPlayerPosition = require('./packets/serverbound/playerPosition.js');
const ChunkData = require('./packets/clientbound/chunkData.js');
const JoinGame = require('./packets/clientbound/joinGame.js');
const KeepAlive = require('./packets/clientbound/keepAlive.js');
const ClientboundHandshake = require('./packets/clientbound/handshake.js');
const ClientboundLoginStart = require('./packets/clientbound/loginStart.js');
const localizePacket = require('./localize.js');

const sampleStatus = `{
    "version": {
        "name": "1.13.2",
        "protocol": 404
    },
    "players": {
        "max": 100,
        "online": 0,
        "sample": []
    },
    "description": {
        "text": "Hello world"
    }
}`

class SocketDataHandler {
    constructor(socket, chunkMap, playerList) {
      this.state = 0
      this.socket = socket
      this.chunkMap = chunkMap
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

    handshake(packet) {
      var handshake = new Handshake(packet)
      this.state = handshake.nextState
      log(`handshake with state ${this.state}`)
    }

    statusResponse() {
      var statusResponse = new StatusResponse(sampleStatus)
      log(`sending status..`)
      this.socket.write(statusResponse.loadIntoBuffer())
    }

    processLogin(packet) {
      var loginStart = new LoginStart(packet)
      log(`User ${loginStart.username} is logging in...`)
      return loginStart.username
    }

    confirmLogin(username) {
      var loginSuccess = new LoginSuccess(username)
      this.socket.write(loginSuccess.loadIntoBuffer())
    }

    createPlayer(username) {
      this.player = this.playerList.createPlayer(username, this.socket)
    }

    loginNotifyPlayers() {
      log('Notifying players..')
      console.log(this.playerList)
      this.playerList.notify(new NewPlayerInfo([this.player]).loadIntoBuffer())
      log('Spawning Player entity..')
      this.playerList.notify(new SpawnPlayer(this.player).loadIntoBuffer())
    }

    subscribePlayer() {
      this.playerList.addPlayer(this.player)
    }

    joinGame() {
      var joinGame = new JoinGame(this.player.eid)
      this.socket.write(joinGame.loadIntoBuffer())
      var spawnPosition = new SpawnPosition(this.player.x, this.player.y, this.player.z)
      this.socket.write(spawnPosition.loadIntoBuffer())
    }

    loadArea() {
      log('Loading server region for new player..')
      var loadChunk = new ChunkData(0,0)
      this.socket.write(loadChunk.loadIntoBuffer())
    }

    connectToPeers() {
      log('Connecting to peers..')
      this.chunkMap.map((serverInfo, x, z) => {
        if(serverInfo && !serverInfo.localhost) {
          serverInfo.connection = this.connectToPeer(serverInfo, x, z)
          return serverInfo
        }
        return null
      })
    }

    connectToPeer(serverInfo, x, z) {
      log(`Connecting to ${serverInfo}`)
      var addr = serverInfo.addr
      var port = serverInfo.port
      var addrPort = `${addr}:${port}`
      //Note that the non localhost option below is probably wrong
      var connOptions = serverInfo.localhost ? { port: port } : { port: port, addr: addr }
      var peer = net.createConnection(connOptions, () => {
        log(`Connected to peer at ${addrPort}`)
        peer.write(new ClientboundHandshake(404, addrPort, 3).loadIntoBuffer())
        peer.write(new ClientboundLoginStart(this.player.username).loadIntoBuffer())
        this.subscribeToPeer(peer, x, z)
      })
      return peer
    }

    subscribeToPeer(peer, x, z) {
      peer.on('data', data => {
        var packet = Packet.loadFromBuffer(data)[0]
        var localizedPacket = localizePacket(packet, x, z, 0)
        if(localizedPacket) {
          console.log(`peer packet id ${localizedPacket.packetID}`)
          this.socket.write(localizedPacket.loadIntoBuffer())
        }
      })
    }

    placePlayer() {
      var playerPosition = new PlayerPosition(this.player.x,this.player.y,this.player.z,0,0)
      this.socket.write(playerPosition.loadIntoBuffer())
    }

    socketData(data) {
      Packet.loadFromBuffer(data).forEach(packet => {
        if(this.state == 0) { //PreHandshake
          switch(packet.packetID) {
            case 0:
              this.handshake(packet);
              break;
            default:
              log(`state 3: unexpected packet id ${packet.packetID}`)
          }
        } else if(this.state == 1) { //PostStatusHandshake
          switch(packet.packetID) {
            case 0:
              this.statusResponse()
              break;
            case 1:
              this.socket.write(packet.loadIntoBuffer())
              break;
            default:
              log(`unexpected packet id ${packet.packetID}`)
              break;
          }
        } else if(this.state == 2) { //PostLoginHandshake
          switch(packet.packetID){
            case 0:
              var username = this.processLogin(packet)
              this.confirmLogin(username)
              this.createPlayer(username)
              this.joinGame()
              this.loginNotifyPlayers()
              this.subscribePlayer()
              this.loadArea()
              this.connectToPeers()
              this.placePlayer()
              this.keepAliveInterval = setInterval(this.keepAlive.bind(this), keepAliveSendInterval)
              this.state = 4
              break;
            default:
              log(`state 2: unexpected packet id ${packet.packetID}`)
              break;
          }
        } else if(this.state == 3) { //PostP2PLoginHandshake
          var username = this.processLogin(packet)
          this.confirmLogin(username)
          this.createPlayer(username)
          this.subscribePlayer()
          this.loadArea()
          this.state = 4
        } else if(this.state == 4) { //Play
          switch(packet.packetID) { //Packets that must be read regardless of player pos
            case 0x0E:
              if (!packet.dataEquals(this.keepAlivePacket)) {
                this.socket.destroy()
              }
              this.keepAliveTimeout.forEach(clearTimeout)
              return;
            case 0x10:
              var playerPosition = new ServerboundPlayerPosition(packet)
              var oldPosition = {
                x: this.player.x,
                y: this.player.y,
                z: this.player.z
              }
              Object.assign(this.player, {
                  x: playerPosition.x,
                  y: playerPosition.y,
                  z: playerPosition.z
              })
          }

          var server = this.chunkMap.getServer(Math.floor(this.player.x/16),Math.floor(this.player.z/16))
          var localizedPacket = null
          if(server && !server.localhost) {
            localizedPacket = localizePacket(packet, server.x, server.z, 0)
            if(localizedPacket) {
              log(`recevied packet`)
              server.connection.write(localizedPacket.loadIntoBuffer())
            }
          } else { //If the player is in our region
            var notificationPacket = null
            switch(packet.packetID) {
              case 0x10:
                notificationPacket = new RelativeEntityMove(this.player, oldPosition, playerPosition)
                //log(`player position: x: ${playerPosition.x}, y: ${playerPosition.y}, z: ${playerPosition.z}`)
            }
            if(notificationPacket) {
              this.playerList.notify(notificationPacket.loadIntoBuffer(), this.player.eid)
            }
          }
        }
      });
    }
}

module.exports = SocketDataHandler
