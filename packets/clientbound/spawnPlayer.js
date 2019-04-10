const Packet = require('../../packet.js');
const BufferGenerators= require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;
const floatBuffer = BufferGenerators.floatBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const uuidBuffer = BufferGenerators.uuidBuffer;

class SpawnPlayer extends Packet {
  constructor(player){
    super()
    var ya = 0
    var p = 0
    this.packetID = 0x05
    console.log(`spawning player with uuid ${player.uuid}`)
    this.dataBuffer = Buffer.concat([
      varIntBuffer(player.eid),
      uuidBuffer(player.uuid),
      doubleBuffer(player.position.x),
      doubleBuffer(player.position.y),
      doubleBuffer(player.position.z),
      floatBuffer(ya),
      floatBuffer(p),
      unsignedByteBuffer(0xff) //Entity Metadata Terminator
    ])
  }
}

module.exports = SpawnPlayer
