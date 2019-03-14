const SERVER_LOGGING = true;

const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = 8000;

const Packet = require('./packet.js');
const Handshake = require('./packets/serverbound/handshake.js');
const LoginStart = require('./packets/serverbound/loginStart.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const StatusResponse = require('./packets/clientbound/statusResponse.js');
const SpawnPosition = require('./packets/clientbound/spawnPosition.js');
const PlayerPosition = require('./packets/clientbound/playerPosition.js');
const ChunkData = require('./packets/clientbound/chunkData.js');
const JoinGame = require('./packets/clientbound/joinGame.js');

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

function log(str) {
  if(SERVER_LOGGING) { console.log(str) }
}


server.on('connection', socket => {
  var state = 0

  function socketData(data) {
    packet = new Packet();
    packet.loadFromBuffer(data)
    log(`received id: ${packet.packetID} in state: ${state}`)
    if(state == 0) { //PreHandshake
      switch(packet.packetID) {
        case 0:
          var handshake = new Handshake(packet)
          state = handshake.nextState
          log(`handshake with state ${state}`)
          if (handshake.leftoverData != null) {
            socketData(handshake.leftoverData)
          } 
          break;
        default:
          log(`state 3: unexpected packet id ${packet.packetID}`)
      }
    } else if(state == 1) { //PostStatusHandshake
      switch(packet.packetID) {
        case 0:
          var statusResponse = new StatusResponse(sampleStatus)
          log(`sending status..`)
          socket.write(statusResponse.loadIntoBuffer())
          break;
        case 1:
          socket.write(packet.loadIntoBuffer())
          break;
        default:
          log(`unexpected packet id ${packet.packetID}`)
          break;
      }
    } else if(state == 2) { //PostLoginHandshake
      switch(packet.packetID){
        case 0:
          var loginStart = new LoginStart(packet)
          log(`User ${loginStart.username} is logging in...`)
          var loginSuccess = new LoginSuccess(loginStart.username)
          socket.write(loginSuccess.loadIntoBuffer())
          var joinGame = new JoinGame(loginStart.username)
          socket.write(joinGame.loadIntoBuffer())
          var spawnPosition = new SpawnPosition(0,3,0)
          socket.write(spawnPosition.loadIntoBuffer())
          for(var x = -4; x <= 4; x++){
            for(var z = -4; z <= 4; z++){
              var loadChunk = new ChunkData(x,z)
              socket.write(loadChunk.loadIntoBuffer())
            }
          }
          var playerPosition = new PlayerPosition(0,30,0,0,0)
          socket.write(playerPosition.loadIntoBuffer())
          state = 4
          break;
        default:
          log(`state 2: unexpected packet id ${packet.packetID}`)
          break;
      }
    } else if(state == 3) {
      switch(packet.packetID) {
        case 0:
          log(`teleport confirm`)
          state = 4
          break;
        default:
          log(`state 3: unexpected packet id ${packet.packetID}`)
          break;
      }
    } else { //Play
      //log(`play packet with id ${packet.packetID}`)
    }
  }

  socket.on('close', err => {
    if(err){ log('socket closed due to error') } else { log('socket closed') }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.on('data', data => {
    socketData(data)
  });
});

server.on('close', socket => {
  log('server closed');
});

server.listen(port, hostname, () => {
  log('server on');
});
