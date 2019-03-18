const Utility = require('./utility.js');
const log = Utility.log
const net = require('net');
const server = net.createServer();
const hostname = '127.0.0.1';
const port = 8000;

const SocketDataHandler = require('./socketDataHandler.js');

server.on('connection', socket => {
  var handler = new SocketDataHandler(socket)

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
