const KeepAlive = require('../packets/clientbound/keepAlive.js')
const Packet = require('../packet.js')
const log = require('loglevel')

class KeepAliveHandler {
  constructor(connection, sendInterval, maxWaitForResponse) {
    this.sendInterval = sendInterval
    this.maxWaitForResponse = maxWaitForResponse
    this.timeout = []
    this.packet = null
    this.connection = connection
  }

  bind() {
    this.keepAliveInterval = setInterval(
      this.keepAlive.bind(this),
      this.sendInterval
    )
  }

  check(packet) {
    if (this.packet && !packet.dataEquals(this.packet)) {
      this.connection.logout()
    }
    this.timeout.forEach(clearTimeout)
  }

  keepAlive() {
    log.debug('keeping alive..')
    this.packet = Packet.write(KeepAlive,[])
    this.timeout.push(setTimeout(() => this.connection.logout(), this.maxWaitForResponse))
    this.connection.write(this.packet);
  }

  destroy() {
    this.timeout.forEach(clearTimeout)
    clearInterval(this.keepAliveInterval)
  }
}

module.exports = KeepAliveHandler
