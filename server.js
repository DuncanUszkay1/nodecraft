const Utility = require('./utility.js');
const log = Utility.log
const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = 8000;
const HandshakeHandler = require('./handshakeHandler.js')
const PlayerRouter = require('./playerRouter.js')


server.on('connection', socket => {
  var state = 0
  var handler = new HandshakeHandler(socket)
  var chunkSocket = null

  socket.on('close', err => {
    if(chunkSocket) { chunkSocket.end() }
    if(err){ log('socket closed due to error') } else { log('socket closed') }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.on('data', data => {
    if(state == 0) {
      username = handler.socketData(data)
      if(username) {
        var connectionOptions = PlayerRouter.getHost(username)
        chunkSocket = net.createConnection(connectionOptions, () => {
          log('connected to chunk')
        })
        chunkSocket.on('data', data => { socket.write(data) })
        state = 1
      }
    } else {
      chunkSocket.write(data)
    }
  })
});

server.on('close', socket => {
  log('server closed');
});

server.listen(port, hostname, () => {
  log('server on');
});
