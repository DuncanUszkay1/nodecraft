const Packet = require('../../packet.js');
const BufferGenerators = require('../../bufferGenerators.js');
const doubleBuffer = BufferGenerators.doubleBuffer;

class KeepAlive extends Packet {
    constructor() {
        super()
        this.packetID = 0x21
        this.dataBuffer = doubleBuffer(Math.random())
    }
}

module.exports = KeepAlive
