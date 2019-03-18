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

//Eventually the edge server will pass this through
var username = 'gogo_the_monkey'

class SocketDataHandler {
    constructor(socket) {
      this.socket = socket
      this.keepAliveTimeout = []
      var loginSuccess = new LoginSuccess(username)
      this.socket.write(loginSuccess.loadIntoBuffer())
      var joinGame = new JoinGame(username)
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
    }

    close() {
        clearInterval(this.keepAliveInterval)
        if(this.chunkSocket) { this.chunkSocket.end() }
    }

    keepAlive() {
      this.keepAlivePacket = new KeepAlive()
      this.keepAliveTimeout.push(setTimeout(() => this.socket.destroy(), keepAliveMaxWaitForResponse))
      this.socket.write(this.keepAlivePacket.loadIntoBuffer());
    }

    socketData(data) {
      Packet.loadFromBuffer(data).forEach(packet => {
        switch(packet.packetID) {
          case 0x0E:
            if (!packet.dataEquals(this.keepAlivePacket)) {
              this.socket.destroy()
            }
            this.keepAliveTimeout.forEach(clearTimeout)
            break;
        }
      });
    }
}

module.exports = SocketDataHandler
