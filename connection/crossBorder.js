const Handshake = require('../packets/serverbound/handshake.js');
const Packet = require('../packet.js');
const ProxyLoginStart = require('../packets/serverbound/proxyLoginStart.js');
const remittanceLogin = require('../connection/handleLogin.js').remittance;
const localizePacket = require('../localize.js');
const net = require('net')
const log = require('loglevel')
const protocolVersion = 404

function proxyLogin(connection, server) {
  var localizedPosition = {
    x: connection.player.position.x % 16,
    z: connection.player.position.z % 16
  }
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
      connection.logout()
    }
    proxyLogin(connection, server)
  }
}

module.exports = crossBorder
