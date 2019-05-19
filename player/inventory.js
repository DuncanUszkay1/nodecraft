const log = require('loglevel')
const Item = require('./item.js')

class Inventory {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.slotArray = []
    this.empty()
  }

  combine(inventory) {
    this.slotArray
  }

  place(slot, item) {
    var selectedItem = this.slotArray[slot]
    this.slotArray[slot] = item
    return slot
  }

  getSlot(slot) {
    return this.slotArray[slot]
  }

  empty() {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        this.slotArray.push(new Item(0))
      }
    }
  }

  print() {
    console.log(this.slotArray)
  }
}

module.exports = Inventory
