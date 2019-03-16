const SERVER_LOGGING = true;
keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const Utility = require('./utility.js');
const log = Utility.log
const Packet = require('./packet.js');
const Handshake = require('./packets/serverbound/handshake.js');
const LoginStart = require('./packets/serverbound/loginStart.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const StatusResponse = require('./packets/clientbound/statusResponse.js');
const SpawnPosition = require('./packets/clientbound/spawnPosition.js');
const PlayerPosition = require('./packets/clientbound/playerPosition.js');
const ChunkData = require('./packets/clientbound/chunkData.js');
const JoinGame = require('./packets/clientbound/joinGame.js');
const KeepAlive = require('./packets/clientbound/keepAlive.js');

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
    }

    close() {
        clearInterval(this.keepAliveInterval)
    }

    keepAlive() {
      this.keepAlivePacket = new KeepAlive()
      this.keepAliveTimeout.push(setTimeout(() => this.socket.destroy(), keepAliveMaxWaitForResponse))
      this.socket.write(this.keepAlivePacket.loadIntoBuffer());
    }
  
    socketData(data) {
      Packet.loadFromBuffer(data).forEach(packet => {
        if(this.state == 0) { //PreHandshake
          switch(packet.packetID) {
            case 0:
              var handshake = new Handshake(packet)
              this.state = handshake.nextState
              log(`handshake with state ${this.state}`)
              break;
            default:
              log(`state 3: unexpected packet id ${packet.packetID}`)
          }
        } else if(this.state == 1) { //PostStatusHandshake
          switch(packet.packetID) {
            case 0:
              var statusResponse = new StatusResponse(sampleStatus)
              log(`sending status..`)
              this.socket.write(statusResponse.loadIntoBuffer())
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
              var loginStart = new LoginStart(packet)
              log(`User ${loginStart.username} is logging in...`)
              var loginSuccess = new LoginSuccess(loginStart.username)
              this.socket.write(loginSuccess.loadIntoBuffer())
              var joinGame = new JoinGame(loginStart.username)
              this.socket.write(joinGame.loadIntoBuffer())
              var spawnPosition = new SpawnPosition(0,3,0)
              this.socket.write(spawnPosition.loadIntoBuffer())
              for(var x = -4; x <= 4; x++){
                for(var z = -4; z <= 4; z++){
                  var loadChunk = new ChunkData(x,z)
                  this.socket.write(loadChunk.loadIntoBuffer())
                }
              }
              var playerPosition = new PlayerPosition(0,30,0,0,0)
              this.socket.write(playerPosition.loadIntoBuffer())
              this.state = 4
              this.keepAliveInterval = setInterval(this.keepAlive.bind(this), keepAliveSendInterval)
              break;
            default:
              log(`state 2: unexpected packet id ${packet.packetID}`)
              break;
          }
        } else if(this.state == 3) {
          switch(packet.packetID) {
            case 0:
              log(`teleport confirm`)
              this.state = 4
              break;
            default:
              log(`state 3: unexpected packet id ${packet.packetID}`)
              break;
          }
        } else { //Play
          switch(packet.packetID) {
            case 0x0E:
              if (!packet.dataEquals(this.keepAlivePacket)) {
                this.socket.destroy()
              }
              this.keepAliveTimeout.forEach(clearTimeout)
              break;
          }
        }
      });
    }
}

module.exports = SocketDataHandler
