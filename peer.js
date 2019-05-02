const Handshake = require('./packets/serverbound/handshake.js');
const localizePacket = require('./localize.js');
const Packet = require('./packet.js');
const log = require('loglevel')
const protocolVersion = 404

function handlePacket(packet, playerList, x, z, eidTable) {
  var localizedPacket = localizePacket.clientbound(packet, x, z, eidTable)
  if(localizedPacket) { playerList.notify(localizedPacket.loadIntoBuffer()) }
}

function peerSocket(socket, playerList, x, z, serverInfo) {
  if(!serverInfo.hasOwnProperty("eidTable")) { serverInfo.eidTable = {} }
  socket.write(Packet.write(Handshake,[protocolVersion, `${serverInfo.addr}:${serverInfo.port}`, 5]).loadIntoBuffer())

  socket.on('close', err => {
    if(err){ log.info('socket closed due to error') } else { log.info('socket closed') }
  })
  socket.on('error', err => {
    log.info(err)
  })
  socket.on('data', data => {
    Packet.loadFromBuffer(data).forEach(packet => handlePacket(packet, playerList, x, z, serverInfo.eidTable))
  })
}

module.exports = peerSocket
