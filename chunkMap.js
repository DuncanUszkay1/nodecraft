class ChunkMap {
  constructor() {
    this.grid = new ExpandingGrid({localhost: true})
    this.emptyPositions = []
    this.nextPositions = [new Position(1, 0), new Position(-1,0), new Position(0, -1), new Position(0, 1)]
  }

  map(f) {
    this.grid.map(f)
  }

  forEach(f) {
    this.grid.forEach(f)
  }

  getServer(position) {
    return this.grid.get(position)
  }

  disconnect(serverInfo) {
    this.grid.map((s,x,z) => {
      if(s == null || s.addr != serverInfo.addr || s.port != serverInfo.port) return s
      if(s.connection) s.connection.destroy()
      this.emptyPositions.push(new Position(x,z))
      return null
    })
  }

  allocateServer(serverInfo) {
    var emptyPosition = this.emptyPositions.pop()
    if(emptyPosition) {
      this.grid.set(emptyPosition, serverInfo)
      return emptyPosition
    } else {
      var nextPosition = this.nextPositions.pop()
      if(this.nextPositions.length == 0) {
        var x = Math.abs(nextPosition.x)
        var z = Math.abs(nextPosition.z)
        if(x == z) {
          x++
          z = 0
        } else {
          z++
        }
        this.nextPositions.push(new Position(x,z))
        if(x != 0) {
          this.nextPositions.push(new Position(-x,z))
        }
        if(z != 0) {
          this.nextPositions.push(new Position(x,-z))
        }
        if(x != 0 && z != 0) {
          this.nextPositions.push(new Position(-x,-z))
        }
        if(x != z) {
          var len = this.nextPositions.length
          for(var i = 0; i < len; i++) {
            this.nextPositions.push(new Position(this.nextPositions[i].z, this.nextPositions[i].x))
          }
        }
      }
      this.grid.set(nextPosition, serverInfo)
      return nextPosition
    }
  }
}

class ExpandingGrid {
  constructor(center) {
    this.array = [[center]]
    this.size = 0
  }

  map(f) {
    this.array = this.array.map((arr, x) => arr.map((a, z) => f(a,x - this.size,z - this.size)))
  }

  forEach(f) {
    this.array.forEach((arr, x) => arr.forEach((a, z) => f(a,x - this.size,z - this.size)))
  }

  get(pos) {
    return this.array[this.size + pos.x][this.size + pos.z]
  }

  set(pos, val) {
    this.increaseToSize(Math.max(pos.absX,pos.absZ))
    this.array[this.size + pos.x][this.size + pos.z] = val
  }

  increaseToSize(size) {
    if(size > this.size) {
      var emptyArr = []
      for(var i = 0; i < size * 2 + 1; i++) {
        emptyArr.push(null)
      }
      this.array.unshift(emptyArr)
      this.array.push([...emptyArr])
      for(var i = 1; i < size * 2; i++) {
        this.array[i].unshift(null)
        this.array[i].push(null)
      }
      this.size = size
    }
  }

  print() {
    console.log(this.array)
  }
}

class Position {
  constructor(x,z) {
    this.x = x
    this.z = z
    this.absX = Math.abs(x)
    this.absZ = Math.abs(z)
  }
}

module.exports = ChunkMap
