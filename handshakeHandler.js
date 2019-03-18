const SERVER_LOGGING = true;
keepAliveSendInterval = 15000
keepAliveMaxWaitForResponse = 30000

const Utility = require('./utility.js');
const log = Utility.log
const net = require('net');
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

class HandshakeHandler {
    constructor(socket) {
      this.state = 0
      this.socket = socket
    }

    socketData(data) {
      var packets = Packet.loadFromBuffer(data)
      for(var i = 0; i < packets.length; i++){
        var packet = packets[i]
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
              return loginStart.username
            default:
              log(`state 2: unexpected packet id ${packet.packetID}`)
              break;
          }
        }
      }
      return null;
    }
}

module.exports = HandshakeHandler
