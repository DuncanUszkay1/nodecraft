class Item {
  constructor(present,id,count) {
    this.present = present
    this.count = this.present ? count : null
    this.id = this.present ? id : null
  }
}

module.exports = Item
