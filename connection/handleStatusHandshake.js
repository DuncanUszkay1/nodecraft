const log = require('loglevel')
const StatusResponse = require('../packets/clientbound/statusResponse.js');
const Packet = require('../packet.js')

const sampleStatus = `{
    "version": {
        "name": "1.13.2",
        "protocol": 404
    },
    "players": {
        "max": 100,
        "online": 0,
        "sample": []
    },
    "description": {
        "text": "Hello world"
    }
}`

function handleStatusHandshake(connection, packet) {
  switch(packet.packetID) {
    case 0:
      var statusResponse = Packet.write(StatusResponse,[sampleStatus])
      log.debug(`sending status..`)
      connection.write(statusResponse)
      break;
    case 1:
      connection.write(packet)
      break;
    default:
      log.error(`unexpected packet id ${packet.packetID}`)
      break;
  }
}

module.exports = handleStatusHandshake
