const KeepAlive = require('../packets/clientbound/keepAlive.js')

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
    this.packet = new KeepAlive()
    this.timeout.push(setTimeout(() => this.connection.logout(), this.maxWaitForResponse))
    this.connection.write(this.packet);
  }
}

module.exports = KeepAliveHandler
