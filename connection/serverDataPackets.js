const ChunkData = require('../packets/clientbound/chunkData.js');
const SpawnPlayer = require('../packets/clientbound/spawnPlayer.js');
const NewPlayerInfo = require('../packets/clientbound/newPlayerInfo.js');
const Packet = require('../packet.js')

function serverDataPackets(connection, exceptEid) {
  var packets = []
  packets.push(Packet.write(ChunkData,[0,0]))
  connection.forEachPlayer(player => {
    packets.push(Packet.write(NewPlayerInfo,[[player]]))
    packets.push(Packet.write(SpawnPlayer,[player]))
  }, exceptEid)
  return packets
}

module.exports = serverDataPackets
