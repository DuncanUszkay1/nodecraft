function borderCrossing(connection) {
  var expectedChunkPos = {
    x: Math.floor(connection.player.position.x/16),
    z: Math.floor(connection.player.position.z/16)
  }
  if(connection.chunkPosition.x != expectedChunkPos.x ||
    connection.chunkPosition.z != expectedChunkPos.z) {
    connection.chunkPosition = expectedChunkPos
    return true
  }
  return false
}

function getServer(connection) {
  var exitingLocal = connection.chunkPosition.x == 0 && connection.chunkPosition.z == 0
  var crossing = borderCrossing(connection)
  return {
    exitingLocal: exitingLocal,
    server: connection.chunkMap.getServer(connection.chunkPosition.x, connection.chunkPosition.z),
    borderCrossing: crossing
  }
}

module.exports = getServer
