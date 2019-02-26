const _ = require('lodash')
const chalk = require('chalk')

const Block = require('./Block')
const { CODES } = require('./NcCodes')

const REQUIRED_ADDRESSES = ['Z', 'R', 'Q', 'F']

class CannedCycle {
  constructor (block) {
    this._block = block
    this._points = []

    this.peck = this._block.getAddress('Q')
    this.depth = this._block.getAddress('Z')
    this.retract = this._block.getAddress('R')
    this.feedrate = this._block.getAddress('F')

    // this.cycleCommand = CODES.G[this.getCannedCycleCode()]
    // this.retractCommand = CODES.G[this.getRetractCode()]
    this.cycleCommand = this.getCannedCycleCode()
    this.retractCommand = this.getRetractCode()

    this.G98 = this._block.addresses.indexOf('G98') > -1
    this.G99 = this._block.addresses.indexOf('G99') > -1

    REQUIRED_ADDRESSES.forEach((ltr) => {
      this[ltr] = this._block.getAddress(ltr, true)
    })
  }

  addPoint (point) {
    const position = point instanceof Block ? point.getPosition() : point

    this._points.push(position)
  }

  getPoints () {
    return this._points
  }

  getPointCount () {
    return this._points.length
  }

  getCannedCycleCode () {
    return _(this._block.addresses).intersection(CODES.CANNED_CYCLE_START).flatten()
  }

  getRetractCode () {
    return _(this._block.addresses).intersection(['G98', 'G99']).flatten()
  }
}

module.exports = CannedCycle
module.exports.REQUIRED_ADDRESSES = REQUIRED_ADDRESSES
