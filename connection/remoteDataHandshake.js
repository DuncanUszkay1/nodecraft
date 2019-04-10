const ChunkData = require('../packets/clientbound/chunkData.js');
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('../packets/clientbound/newPlayerInfo.js');
const EndDataHandshake = require('../packets/clientbound/endDataHandshake.js');

function remoteDataHandshake(connection) {
  connection.write(new ChunkData(0,0))
  connection.forEachPlayer(player => {
    connection.write(new NewPlayerInfo([player]))
    connection.write(new SpawnPlayer(player))
  })
  connection.write(new EndDataHandshake())
}

module.exports = remoteDataHandshake
