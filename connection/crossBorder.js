const Handshake = require('../packets/clientbound/handshake.js');
const ProxyLoginStart = require('../packets/clientbound/proxyLoginStart.js');
const remittanceLogin = require('../connection/handleLogin.js').remittance;
const net = require('net')
const protocolVersion = 404

function proxyLogin(connection, server) {
  var localizedPosition = {
    x: connection.player.position.x % 16,
    z: connection.player.position.z % 16
  }
  var proxy = net.createConnection(server, () => {
    proxy.write(new Handshake(protocolVersion, `${server.addr}:${server.port}`, 3).loadIntoBuffer())
    proxy.write(new ProxyLoginStart(connection.player.username, localizedPosition).loadIntoBuffer())
    proxy.on('data', () => {
      connection.setProxyServer(proxy)
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
    console.log('remittance')
    remittanceLogin(connection)
  } else {
    console.log('non-remittance')
    if(exitingLocal) {
      connection.logout()
    }
    proxyLogin(connection, server)
  }
}

module.exports = crossBorder
