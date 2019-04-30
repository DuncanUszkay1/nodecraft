const fs = require('fs')
const BufferGenerators = require('./bufferGenerators.js');
const ByteStream = require('./byteStream.js');
const Utility = require('./utility.js');

const log = Utility.log

const intBuffer = BufferGenerators.intBuffer;
const unsignedByteBuffer = BufferGenerators.unsignedByteBuffer;
const varIntBuffer = BufferGenerators.varIntBuffer;
const arrayBuffer = BufferGenerators.arrayBuffer;

class PlayerMap {
  constructor() {
    fs.readFile("mapData.bin", (err, data) => {
      var mapData = new ByteStream(data)
      this.xpos = mapData.readInt()
      this.ypos = mapData.readInt()
      this.fullChunk = mapData.readByte()
      this.primaryBitMask = mapData.readVarInt()
      this.sectionDataSize = mapData.readVarInt() // section Data Size
      this.bitsPerBlock = mapData.readByte()
      var paletteSize = mapData.readVarInt()
      this.palette = []
      for (var i = 0; i < paletteSize; i++) {
        this.palette.push(mapData.readVarInt())
      }
      this.numberOfLongs = mapData.readVarInt()
      this.data = []
      for(var y = 0; y < 16; y++){
        var sub1 = []
        for(var z = 0; z < 16; z++){
          var sub2 = []
          for(var x = 0; x < 16; x++){
            sub2.push(mapData.readByte())
          }
          sub1.push(sub2)
        }
        this.data.push(sub1)
      }
      this.lightData = []
      for (var i = 0; i < this.numberOfLongs * 8; i++) {
        this.lightData.push(mapData.readByte())
      }
      this.biomes = []
      for (var i = 0; i < 256; i++) {
        this.biomes.push(mapData.readInt())
      }
      this.numBlockEntities = mapData.readVarInt()
    })
  }

  getDataBuffer() {
    var firstPart = Buffer.concat([
      intBuffer(this.xpos),
      intBuffer(this.ypos),
      unsignedByteBuffer(this.fullChunk),
      varIntBuffer(this.primaryBitMask)
    ])

    // for(var p = 8; p < 16; p++) {
    //   this.palette.push(p)
    // }
    var bufArray = []
    for(var y = 0; y < 16; y++){
      for(var z = 0; z < 16; z++){
        // for(var x = 0; x < 16; x++){
        //   bufArray.push(unsignedByteBuffer(x % 16))
        // }
        bufArray.push(arrayBuffer(this.data[y][z], unsignedByteBuffer))
      }
    }
    var blockData = Buffer.concat(bufArray)

    var data = Buffer.concat([
      unsignedByteBuffer(this.bitsPerBlock),
      varIntBuffer(this.palette.length),
      arrayBuffer(this.palette, varIntBuffer),
      varIntBuffer(this.numberOfLongs),
      blockData,
      arrayBuffer(this.lightData, unsignedByteBuffer),
      arrayBuffer(this.biomes, intBuffer)
    ])

    return Buffer.concat([
      firstPart, 
      varIntBuffer(data.length),
      data,
      varIntBuffer(this.numBlockEntities)
    ])
  }

  save() {
    fs.writeFile("mapData.bin", this.getDataBuffer(), err => {})
  }

  handleDigging(position) {
    log(`digging block: ${this.data[position.y][position.z][position.x]} at {${position.x}, ${position.y}, ${position.z}}`)
    this.data[position.y][position.z][position.x] = 0
  }
}

module.exports = PlayerMap
