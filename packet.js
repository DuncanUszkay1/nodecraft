const PacketBase = require('./packets/base.js')
const ByteStream = require('./byteStream.js')

function read(packetType, packet) {
  readPacket = new packetType()
  Object.assign(readPacket, packet)
  var bs = new ByteStream(Buffer.from(packet.dataBuffer))
  readPacket.read(bs)
  return readPacket
}

function write(packetType, args) {
  packet = new packetType()
  packet.write(...args)
  return packet
}

function loadFromBuffer(buffer) {
    var bs = new ByteStream(buffer);
    var packets = []
    var beginningOfNextPacket = 0
    while (!bs.empty()) {
      var packet = new PacketBase()
      packet.length = bs.readVarInt();
      beginningOfNextPacket = packet.length + bs.i
      packet.packetID = bs.readVarInt();
      packet.dataBuffer = bs.tail(beginningOfNextPacket);
      packets.push(packet)
    }
    return packets
  }

module.exports = {
  read: read,
  write: write,
  loadFromBuffer: loadFromBuffer
}
