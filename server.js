const SERVER_LOGGING = true;

const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = 8000;

const Packet = require('./packet.js');
const Handshake = require('./packets/serverbound/handshake.js');
const LoginStart = require('./packets/serverbound/loginStart.js');
const LoginSuccess = require('./packets/clientbound/loginSuccess.js');
const JoinGame = require('./packets/clientbound/joinGame.js');
//const initConnState = require('./connection.js');

const sample_status = `{
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
  socket.on('close', err => {
    if(err){ log('socket closed due to error') } else { log('socket closed') }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.on('data', data => {
    packet = new Packet();
    packet.loadFromBuffer(data);
    if(state == 0) { //PreHandshake
      switch(packet.packetID) {
        case 0:
          var handshake = new Handshake(packet)
          state = handshake.nextState
          console.log(`handshake with state ${state}`)
          break;
        default:
          log(`unexpected packet id ${packet.packetID}`)
      }
    } else if(state == 1) { //PostStatusHandshake
      switch(packet.packetID) {
        case 0:
          var statusResponse = new StatusResponse(sample_status)
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
          state = 3
          break;
        default:
          log(`unexpected packet id ${packet.packetID}`)
          break;
      }
    } else { //Play
      log('play packet')
    }
  });
});

server.on('close', socket => {
  log('server closed');
});

server.listen(port, hostname, () => {
  log('server on');
});
