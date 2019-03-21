const Utility = require('./utility.js');
const log = Utility.log
const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = process.argv.slice(2)[0];

const SocketDataHandler = require('./socketDataHandler.js');
const ChunkMap = require('./chunkMap.js')

var chunkMap = new ChunkMap()
chunkMap.allocateServer({ port: 8001, addr: '127.0.0.1' })

server.on('connection', socket => {
  var handler = new SocketDataHandler(socket, chunkMap)

  socket.on('close', err => {
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
