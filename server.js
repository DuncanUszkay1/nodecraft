const Utility = require('./utility.js');
const log = Utility.log
const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = process.argv.slice(2)[0];

const SocketDataHandler = require('./connection/socketDataHandler.js');
const peerSocket = require('./peer.js')
const ChunkMap = require('./chunkMap.js')
const PlayerList = require('./playerList.js')

//Hardcoded atm to connect to a paired server
var peers = [{ port: 8000 + 8001 - port, addr: '127.0.0.1' }]

function connectToPeers() {
  chunkMap.map( (p,x,z) => {
    if(p && !p.localhost && !p.connection) {
      log(p)
      p.connection = net.createConnection(p, () => {
        log('connected to peer')
        peerSocket(p.connection, playerList, x, z, p)
      })
    }
    return p
  })
}

var chunkMap = new ChunkMap()
peers.forEach(peer => {
  chunkMap.allocateServer(peer)
})

var playerList = new PlayerList()

var eventPipes = []

var nextEid = 1

server.on('connection', socket => {
  connectToPeers()
  var handler = new SocketDataHandler(socket, chunkMap, playerList, eventPipes, nextEid)

  socket.on('close', err => {
    handler.logout()
    handler.close()
    if(err){ log('socket closed due to error') } else { log('socket closed') }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.on('data', data => {
    handler.socketData(data)
  })
});

server.on('close', socket => {
  log('server closed');
});

server.listen(port, hostname, () => {
  log('server on');
});
