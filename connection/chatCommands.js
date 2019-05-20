const log = require('loglevel')
const net = require('net')
const loadRemote = require('./loadRemote.js');
const peerSocket = require('../peer.js')
const Packet = require('../packet.js')
const UnloadChunk = require('../packets/clientbound/unloadChunk.js');
const DeleteEntities = require('../packets/clientbound/deleteEntities.js');


const commands = {
  '!connect': connect,
  '!disconnect': disconnect
}

function connect(connection, tokens) {
  peer = { addr: tokens[1], port: tokens[2] }
  position = connection.chunkMap.allocateServer(peer)
  serverInfo = connection.chunkMap.getServer(position)
  loadRemote(connection, serverInfo, position.x, position.z)
  serverInfo.connection = net.createConnection(serverInfo, () => {
    log.debug(`connected to peer ${serverInfo.addr}:${serverInfo.port}`)
    peerSocket(
      serverInfo.connection,
      connection.playerList,
      connection.anchorList,
      position.x,
      position.z,
      serverInfo
    )
  })
}

function disconnect(connection, tokens) {
  peer = { addr: tokens[1], port: tokens[2] }
  connection.chunkMap.forEach((s,x,z) => {
    if(s == null) return
    if(peer.addr == s.addr && peer.port == s.port) {
      connection.localNotify(Packet.write(UnloadChunk,[{x:x,z:z}]))
      if(s.eidTable) {
        values = Object.keys(s.eidTable).map(k => s.eidTable[k])
        connection.localNotify(Packet.write(DeleteEntities,[values]))
      }
    }
  })
  connection.chunkMap.disconnect(peer)
}

function applyChatCommand(connection, message) {
  if(!message.startsWith('!')) { return }
  tokens = message.split(' ')
  log.debug(tokens)
  commands[tokens[0]](connection, tokens)
}

module.exports = applyChatCommand
