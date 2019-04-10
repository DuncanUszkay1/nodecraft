const Handshake = require('./packets/clientbound/handshake.js');
const localizePacket = require('./localize.js');
const Packet = require('./packet.js');
const protocolVersion = 404

function handlePacket(packet, playerList, x, z, eidTable) {
  var localizedPacket = localizePacket(packet, x, z, eidTable, 0)
  playerList.notify(localizedPacket.loadIntoBuffer())
}

function peerSocket(socket, playerList, x, z, serverInfo) {
  socket.write(new Handshake(protocolVersion, `${serverInfo.addr}:${serverInfo.port}`, 5).loadIntoBuffer())

  socket.on('close', err => {
    if(err){ console.log('socket closed due to error') } else { console.log('socket closed') }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.on('data', data => {
    Packet.loadFromBuffer(data).forEach(packet => handlePacket(packet, playerList, x, z, serverInfo.eidTable))
  })
}

module.exports = peerSocket
