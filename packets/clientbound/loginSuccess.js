const uuid = require('uuid/v1');
const Packet = require('../base.js');
const BG = require('../../bufferGenerators.js');

class LoginSuccess extends Packet {
  write(username){
    this.packetID = 2
    this.uuid = uuid();
    this.username = username
    this.dataBuffer = Buffer.concat([
      BG.string(this.uuid),
      BG.string(this.username)
    ])
  }
}

module.exports = LoginSuccess
