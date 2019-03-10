const SERVER_LOGGING = true;

const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = 8000;

const Packet = require('./packet.js');
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
  //var state = initConnState()
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
    if(packet.length == 254){
      log('legacy ping')
    } else if(state == 0){
      state = 1
    } else if(state == 1){
      packet.packetID = 0
      packet.loadStringIntoByteArray(sample_status)
      packet.adjustLength()
      socket.write(packet.loadIntoBuffer())
      state = 2
    } else if (state == 2){
      socket.write(packet.loadIntoBuffer())
      state = 0
    }
  });
});

server.on('close', socket => {
  log('server closed');
});

server.listen(port, hostname, () => {
  log('server on');
});
