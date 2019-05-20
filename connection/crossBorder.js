const Handshake = require('../packets/serverbound/handshake.js');
const Packet = require('../packet.js');
const ProxyLoginStart = require('../packets/serverbound/proxyLoginStart.js');
const remittanceLogin = require('../connection/handleLogin.js').remittance;
const localizePacket = require('../localize.js');
const net = require('net')
const log = require('loglevel')
const protocolVersion = 404
const math = require('../utility/math.js')

function proxyLogin(connection, server) {
  var localizedPosition = {
    x: math.mod(connection.player.position.x, 16),
    y: connection.player.position.y,
    z: math.mod(connection.player.position.z, 16)
  }
  console.log(connection.player.position.z)
  console.log('localizedPosition:')
  console.log(localizedPosition)
  var proxy = net.createConnection(server, () => {
    proxy.write(Packet.write(Handshake,[protocolVersion, `${server.addr}:${server.port}`, 3]).loadIntoBuffer())
    proxy.write(Packet.write(ProxyLoginStart,[connection.player.username, localizedPosition]).loadIntoBuffer())
    var proxySet = false
    proxy.on('data', data => {
      if(proxySet) {
        Packet.loadFromBuffer(data).forEach(packet => {
          var localizedPacket = localizePacket.clientbound(
            packet,
            connection.chunkPosition.x,
            connection.chunkPosition.z,
            server.eidTable
          )
          if(localizedPacket) { connection.write(localizedPacket) }
        })
      } else {
        connection.setProxyServer(proxy)
        proxySet = true
      }
    })
  })
}

function proxyLogout(connection) {
  if(connection.proxy) {
    connection.proxy.destroy();
    connection.proxy = null
  }
}

function crossBorder(connection, server, exitingLocal) {
  proxyLogout(connection)
  if(server.localhost) {
    log.info(`${connection.player.username} has returned to the server`)
    remittanceLogin(connection)
  } else {
    log.info(`${connection.player.username} has crossed the server border`)
    if(exitingLocal) {
      connection.anchor()
    }
    proxyLogin(connection, server)
  }
}

module.exports = crossBorder
