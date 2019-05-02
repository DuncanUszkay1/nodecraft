const net = require('net')
const log = require('loglevel')

const Packet = require('../packet.js')
const LoginStart = require('../packets/serverbound/loginStart.js');
const ProxyLoginStart = require('../packets/serverbound/proxyLoginStart.js');
const LoginSuccess = require('../packets/clientbound/loginSuccess.js');
const SpawnPosition = require('../packets/clientbound/spawnPosition.js');
const JoinGame = require('../packets/clientbound/joinGame.js');
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('../packets/clientbound/newPlayerInfo.js');
const ChunkData = require('../packets/clientbound/chunkData.js');
const PlayerPosition = require('../packets/clientbound/playerPosition.js');
const loadRemote = require('./loadRemote.js');

function processLogin(connection, packet) {
  var loginStart = Packet.read(LoginStart,packet)
  createPlayer(connection, loginStart.username)
}

function processProxyLogin(connection, packet) {
  var proxyLoginStart = Packet.read(ProxyLoginStart,packet)
  createPlayer(connection, proxyLoginStart.username)
  Object.assign(connection.player.position, proxyLoginStart.position)
}

function createPlayer(connection, username) {
  log.info(`User ${username} is logging in...`)
  connection.write(Packet.write(LoginSuccess,[username]))
  connection.player = connection.playerList.createPlayer(username, connection.socket)
}

function joinGame(connection) {
  connection.write(Packet.write(JoinGame,[connection.player.eid]))
  connection.write(Packet.write(SpawnPosition,[connection.player.position.x, connection.player.position.y, connection.player.position.z]))
}

function loginNotifyPlayers(connection) {
  connection.notify(Packet.write(NewPlayerInfo,[[connection.player]]))
  connection.notify(Packet.write(SpawnPlayer,[connection.player]))
}

function subscribePlayer(connection) {
  connection.playerList.addPlayer(connection.player)
}

function loadArea(connection) {
  connection.write(Packet.write(ChunkData,[0,0]))
}

function connectToPeers(connection) {
  connection.chunkMap.forEach((serverInfo, x, z) => {
    if(serverInfo && !serverInfo.localhost) {
      loadRemote(connection, serverInfo, x, z)
    }
  })
}

function placePlayer(connection) {
  var player = connection.player
  connection.write(Packet.write(PlayerPosition,[player.position.x, player.position.y, player.position.z, 0, 0]))
}

function handleLogin(connection, packet) {
  switch(packet.packetID){
    case 0:
      processLogin(connection,packet)
      joinGame(connection)
      loginNotifyPlayers(connection)
      subscribePlayer(connection)
      loadArea(connection)
      connectToPeers(connection)
      placePlayer(connection)
      connection.keepAlive()
      connection.state = 4
      break;
    default:
      log.warn(`in local login: unexpected packet id ${packet.packetID}`)
      break;
  }
}

function proxyLogin(connection, packet) {
  switch(packet.packetID){
    case 0:
      processProxyLogin(connection,packet)
      loginNotifyPlayers(connection)
      subscribePlayer(connection)
      connection.state = 7
      break;
    default:
      log.warn(`in proxy login: unexpected packet id ${packet.packetID}`)
      break;
  }
}

function remittanceLogin(connection) {
  loginNotifyPlayers(connection)
  subscribePlayer(connection)
  connection.state = 4
}

module.exports = {
  local: handleLogin,
  proxy: proxyLogin,
  remittance: remittanceLogin
}
