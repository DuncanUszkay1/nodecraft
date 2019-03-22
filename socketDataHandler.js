const SERVER_LOGGING = true;
keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const net = require('net')
const Utility = require('./utility.js');
const log = Utility.log
const Packet = require('./packet.js');
const Handshake = require('./packets/serverbound/handshake.js');
const LoginStart = require('./packets/serverbound/loginStart.js');
const PlayerDigging = require('./packets/serverbound/playerDigging.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const StatusResponse = require('./packets/clientbound/statusResponse.js');
const SpawnPosition = require('./packets/clientbound/spawnPosition.js');
const PlayerPosition = require('./packets/clientbound/playerPosition.js');
const ChunkData = require('./packets/clientbound/chunkData.js');
const JoinGame = require('./packets/clientbound/joinGame.js');
const KeepAlive = require('./packets/clientbound/keepAlive.js');
const ClientboundHandshake = require('./packets/clientbound/handshake.js');
const ClientboundLoginStart = require('./packets/clientbound/loginStart.js');
const BlockChange = require('./packets/clientbound/blockChange.js');
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
    constructor(socket) {
      this.state = 0
      this.socket = socket
      this.keepAliveTimeout = []
      this.remoteServer = null
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

    joinGame() {
      var joinGame = new JoinGame()
      this.socket.write(joinGame.loadIntoBuffer())
      var spawnPosition = new SpawnPosition(8,3,8)
      this.socket.write(spawnPosition.loadIntoBuffer())
    }

    loadArea() {
      log('Loading server region for new player..')
      var loadChunk = new ChunkData(0,0)
      this.socket.write(loadChunk.loadIntoBuffer())
    }

    connectToPeers(username) {
      log('Connecting to peers..')
      var addr = '127.0.0.1'
      var port = 8001
      var addrPort = `${addr}:${port}`
      this.remoteServer = net.createConnection({ port: port }, () => {
        log(`Connected to peer at ${addrPort}`)
        this.remoteServer.write(new ClientboundHandshake(404, addrPort, 3).loadIntoBuffer())
        this.remoteServer.write(new ClientboundLoginStart(username).loadIntoBuffer())
      })
      this.remoteServer.on('data', data => {
        var localizedData = localizePacket(data, 1, 0)
        if(localizedData) {
          this.socket.write(localizedData)
        }
      })
    }

    placePlayer() {
      var playerPosition = new PlayerPosition(8,30,8,0,0)
      this.socket.write(playerPosition.loadIntoBuffer())
    }

    playerDigging(packet) {
      var playerDigging = new PlayerDigging(packet)
      var blockChange = new BlockChange(playerDigging);
      this.socket.write(blockChange.loadIntoBuffer())
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
              this.joinGame()
              this.loadArea()
              this.connectToPeers(username)
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
          this.loadArea()
          this.state = 4
        } else { //Play
          switch(packet.packetID) {
            case 0x0E:
              if (!packet.dataEquals(this.keepAlivePacket)) {
                this.socket.destroy()
              }
              this.keepAliveTimeout.forEach(clearTimeout)
              break;
            case 0x18:
              this.playerDigging(packet)
              break;
          }
        }
      });
    }
}

module.exports = SocketDataHandler
