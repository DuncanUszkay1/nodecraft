const Utility = require('../utility.js');
const log = Utility.log
const StatusResponse = require('../packets/clientbound/statusResponse.js');

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
      var statusResponse = new StatusResponse(sampleStatus)
      log(`sending status..`)
      connection.socket.write(statusResponse.loadIntoBuffer())
      break;
    case 1:
      connection.socket.write(packet.loadIntoBuffer())
      break;
    default:
      log(`unexpected packet id ${packet.packetID}`)
      break;
  }
}

module.exports = handleStatusHandshake
