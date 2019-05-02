const ChunkData = require('../packets/clientbound/chunkData.js');
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('../packets/clientbound/newPlayerInfo.js');
const EndDataHandshake = require('../packets/clientbound/endDataHandshake.js');
const Packet = require('../packet.js')

function remoteDataHandshake(connection) {
  connection.write(Packet.write(ChunkData,[0,0]))
  connection.forEachPlayer(player => {
    connection.write(Packet.write(NewPlayerInfo,[[player]]))
    connection.write(Packet.write(SpawnPlayer,[player]))
  })
  connection.write(Packet.write(EndDataHandshake,[]))
}

module.exports = remoteDataHandshake
