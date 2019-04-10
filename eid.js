var nextEid = 0

function getEid() {
  nextEid++
  return nextEid
}

module.exports = getEid
