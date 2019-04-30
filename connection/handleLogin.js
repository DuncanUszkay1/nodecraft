const Utility = require('../utility.js');
const net = require('net')
const log = Utility.log
const ClientboundHandshake = require('../packets/clientbound/handshake.js');
const ClientboundLoginStart = require('../packets/clientbound/loginStart.js');
const LoginStart = require('../packets/serverbound/loginStart.js');
const LoginSuccess = require('../packets/clientbound/loginSuccess.js');
const SpawnPosition = require('../packets/clientbound/spawnPosition.js');
const JoinGame = require('../packets/clientbound/joinGame.js');
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('../packets/clientbound/newPlayerInfo.js');
const ChunkData = require('../packets/clientbound/chunkData.js');
const PlayerPosition = require('../packets/clientbound/playerPosition.js');
const localizePacket = require('../localize.js');
const Packet = require('../packet.js')

function processLogin(connection, packet) {
  var loginStart = new LoginStart(packet)
  log(`User ${loginStart.username} is logging in...`)
  var loginSuccess = new LoginSuccess(loginStart.username)
  connection.socket.write(loginSuccess.loadIntoBuffer())
  connection.player = connection.playerList.createPlayer(loginStart.username, connection.socket)
}

function joinGame(connection) {
  var joinGame = new JoinGame(connection.player.eid)
  connection.socket.write(joinGame.loadIntoBuffer())
  var spawnPosition = new SpawnPosition(connection.player.position.x, connection.player.position.y, connection.player.position.z)
  connection.socket.write(spawnPosition.loadIntoBuffer())
}

function loginNotifyPlayers(connection) {
  connection.playerList.notify(new NewPlayerInfo([connection.player]).loadIntoBuffer())
  connection.playerList.notify(new SpawnPlayer(connection.player).loadIntoBuffer())
}

function subscribePlayer(connection) {
  connection.playerList.addPlayer(connection.player)
}

function loadArea(connection) {
  log('Loading server region for new player..')
  var loadChunk = new ChunkData(connection.playerMap)
  connection.socket.write(loadChunk.loadIntoBuffer())
}

function connectToPeers(connection) {
  log('Connecting to peers..')
  connection.chunkMap.map((serverInfo, x, z) => {
    if(serverInfo && !serverInfo.localhost) {
      serverInfo.connection = connectToPeer(connection, serverInfo, x, z)
      return serverInfo
    }
    return null
  })
}

function connectToPeer(connection, serverInfo, x, z) {
  var addr = serverInfo.addr
  var port = serverInfo.port
  var addrPort = `${addr}:${port}`
  //Note that the non localhost option below is probably wrong
  var connOptions = serverInfo.localhost ? { port: port } : { port: port, addr: addr }
  var peer = net.createConnection(connOptions, () => {
    peer.write(new ClientboundHandshake(404, addrPort, 3).loadIntoBuffer())
    peer.write(new ClientboundLoginStart(connection.player.username).loadIntoBuffer())
    subscribeToPeer(connection, peer, x, z)
  })
  return peer
}

function subscribeToPeer(connection, peer, x, z) {
  peer.on('data', data => {
    var packet = Packet.loadFromBuffer(data)[0]
    var localizedPacket = localizePacket(packet, x, z, 0)
    if(localizedPacket) {
      connection.socket.write(localizedPacket.loadIntoBuffer())
    }
  })
}

function placePlayer(connection) {
  var player = connection.player
  var playerPosition = new PlayerPosition(player.position.x, player.position.y, player.position.z, 0, 0)
  connection.socket.write(playerPosition.loadIntoBuffer())
}

function handleLogin(connection, packet, local=true) {
  switch(packet.packetID){
    case 0:
      processLogin(connection,packet)
      if(local) {
        joinGame(connection)
        loginNotifyPlayers(connection)
      }
      subscribePlayer(connection)
      loadArea(connection)
      if(local) {
        connectToPeers(connection)
        placePlayer(connection)
        connection.keepAliveInterval = setInterval(
          connection.keepAlive.bind(connection),
          keepAliveSendInterval
        )
      }
      connection.state = local ? 4 : 5
      break;
    default:
      log(`state 2: unexpected packet id ${packet.packetID}`)
      break;
  }
}

function handleLocalLogin(connection, packet) {
  return handleLogin(connection, packet)
}

function handleRemoteLogin(connection, packet) {
  return handleLogin(connection, packet, false)
}

module.exports = {
  handleRemoteLogin: handleRemoteLogin,
  handleLocalLogin: handleLocalLogin
}
