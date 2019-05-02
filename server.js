const SocketDataHandler = require('./connection/socketDataHandler.js');
const peerSocket = require('./peer.js')
const ChunkMap = require('./chunkMap.js')
const PlayerList = require('./playerList.js')
const log = require('loglevel')
const net = require('net');

const args = process.argv.slice(2)

const server = net.createServer();
const hostname = '127.0.0.1';
const port = args[0];

const verbosity = args[1] ? args[1] : 'info';
log.setLevel(verbosity)


//Hardcoded atm to connect to a paired server
var peers = [{ port: 8000 + 8001 - port, addr: '127.0.0.1' }]

function connectToPeers() {
  chunkMap.map( (p,x,z) => {
    if(p && !p.localhost && !p.connection) {
      p.connection = net.createConnection(p, () => {
        log.debug(`connected to peer ${p.addr}:${p.port}`)
        peerSocket(p.connection, playerList, anchorList, x, z, p)
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
var guestList = new PlayerList()
var anchorList = new PlayerList()

var eventPipes = []

function socketLog(socket, msg) {
  return `Socket ${socket.remoteAddress}: ${msg}`
}

server.on('connection', socket => {
  connectToPeers()
  var handler = new SocketDataHandler(socket, chunkMap, playerList, guestList, anchorList, eventPipes)
  log.debug(socketLog(socket, 'socket opened'))

  socket.on('close', err => {
    handler.logout()
    handler.close()
    if(err){
      log.error(socketLog(socket,'socket closed due to error'))
    } else {
      log.debug(socketLog(socket,'socket closed'))
    }
  })
  socket.on('error', err => {
    log.error(socketLog(socket,err))
  })
  socket.on('data', data => {
    handler.socketData(data)
  })
});

server.on('close', socket => {
  log.debug('server closed');
});

server.listen(port, hostname, () => {
  log.debug('server on');
});
