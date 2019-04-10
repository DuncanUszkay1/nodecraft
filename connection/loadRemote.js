const net = require('net')
const Handshake = require('../packets/clientbound/handshake.js');
const Packet = require('../packet.js');
const localizePacket = require('../localize.js');

const protocolVersion = 404

function loadRemote(connection, serverInfo, x, z) {
  var addr = serverInfo.addr
  var port = serverInfo.port
  var addrPort = `${addr}:${port}`
  var connOptions = serverInfo.localhost ? { port: port } : { port: port, addr: addr }
  var socket = net.createConnection(connOptions, () => {
    remoteStateHandshake(connection, socket, x, z, addrPort, serverInfo)
  })
}

function remoteStateHandshake(connection, socket, x, z, addrPort, serverInfo) {
  socket.on('data', data => {
    console.log(Packet.loadFromBuffer(data))
    Packet.loadFromBuffer(data).forEach(packet => {
      receivePacket(connection, packet, x, z, serverInfo, socket)
    })
  })
  socket.write(new Handshake(protocolVersion, addrPort, 6).loadIntoBuffer())
}

function receivePacket(connection, packet, x, z, serverInfo, socket) {
  console.log(packet.packetID)
  if(!serverInfo.hasOwnProperty("eidTable")) { serverInfo.eidTable = {} }
  if(packet.packetID == 0xA1) {
    socket.destroy()
  } else {
    connection.write(localizePacket(packet, x, z, serverInfo.eidTable, 0))
  }
}

module.exports = loadRemote
