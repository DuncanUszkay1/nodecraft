const Packet = require('../../packet.js');
const BufferHelpers= require('../../buffer.js');
const doubleBuffer = BufferHelpers.doubleBuffer;

class KeepAlive extends Packet {
    constructor() {
        super()
        this.packetID = 0x21
        this.dataBuffer = doubleBuffer(Math.random())
    }
}

module.exports = KeepAlive