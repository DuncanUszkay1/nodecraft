const uuid = require('uuid/v1');
const getEid = require('./eid.js');
const log = require('loglevel')
const Inventory = require('./player/inventory.js')
const Item = require('./player/item.js')

var spawnX = 8
var spawnY = 16
var spawnZ = 3
var spawnPitch = 64
var spawnYaw = 64

class Player {
  constructor(username, socket) {
    this.username = username
    this.socket = socket
    this.uuid = uuid()
    this.position = {
      x: spawnX,
      y: spawnY,
      z: spawnZ,
      pitch: spawnPitch,
      yaw: spawnYaw
    }
    this.oldPosition = {}
    this.eid = getEid()
    this.inventory = new Inventory(9,3)
    this.craftInventory = new Inventory(2,2)
    this.craftedItem = new Inventory(1,1)
    this.armorInventory = new Inventory(1,4)
    this.hotbar = new Inventory(9,1)
    this.heldItem = this.hotbar.getSlot(0)
    this.slotPlacement = [
      { endSlot: 1, inventory: this.craftedItem },
      { endSlot: 5, inventory: this.craftInventory },
      { endSlot: 9, inventory: this.armorInventory },
      { endSlot: 36, inventory: this.inventory },
      { endSlot: 45, inventory: this.hotbar }
    ]
    log.debug(`created player ${this.username} with eid ${this.eid}`)
  }

  chunkPosition() {
    return {
      x: Math.floor(this.position.x/16),
      z: Math.floor(this.position.z/16)
    }
  }

  notify(packet) {
    this.socket.write(packet)
  }

  withInventory(slot, f) {
    var startSlot = 0
    for(var i = 0; i < this.slotPlacement.length; i++) {
      if(slot < this.slotPlacement[i].endSlot) return f(this.slotPlacement[i].inventory, slot - startSlot)
      startSlot = this.slotPlacement[i].endSlot
    }
    throw Exception
  }

  handleWindowClick(windowClick) {
    this.withInventory(windowClick.slot, (inv, s) => { inv.place(s, windowClick.heldItem) })
    this.inventory.print()
  }

  handleHotbarChange(hotbarChange) {
    console.log(hotbarChange)
    this.heldItem = this.hotbar.getSlot(hotbarChange.slot)
    console.log(this.heldItem)
  }

  inventorySlots() {
    return this.slotPlacement
      .map(sp => sp.inventory.slotArray)
      .reduce((a,b) => a.concat(b))
  }

  archivePosition() {
    Object.assign(this.oldPosition, {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      pitch: this.position.pitch,
      yaw: this.position.yaw
    })
  }
}

module.exports = Player
