/* eslint-disable no-prototype-builtins */
const _ = require('lodash')

const nc = require('./NcCodes.js')

const addressRegex = /([A-Z][#-]*[0-9.]+)(?![^(]*\))/g
const blockSkipRegex = /(^\/[0-9]?)/g
const commentRegex = /\((.+)\)/g

function zeroPadAddress(str) {
  return _.isString(str) ? str[0] + `00${str.slice(1)}`.slice(-2) : ''
}

class Block {
  constructor(line) {
    this._rawLine = line
    this._addresses = this._rawLine.match(addressRegex) || []
    this._machineCmds = []
    this._programCmds = []
    this._comment = null
    this._blockSkip = null

    if (blockSkipRegex.test(this._rawLine)) {
      this._blockSkip = this._rawLine.match(blockSkipRegex)
    }

    if (commentRegex.test(this._rawLine)) {
      this._comment = this._rawLine.match(commentRegex)
    }

    const paddedAddr = this._addresses.map(zeroPadAddress)

    _(paddedAddr)
      .filter(addr => nc.G.hasOwnProperty(addr))
      .each((address) => {
        this._programCmds.push(nc.G[address])
      })

    _(paddedAddr)
      .filter(addr => nc.M.hasOwnProperty(addr))
      .each((address) => {
        this._machineCmds.push({
          CMD: nc.M[address],
          ARGS: _.intersection([address], this._addresses),
        })
      })
  }

  __toString() {
    return this._rawLine
  }

  getAddr(prefix, cast = true) {
    const code = _.find(this._addresses, address => address[0] === prefix)
    const value = code.slice(1)

    if (cast) {
      return code.indexOf('.') > -1 ? parseFloat(value) : parseInt(value)
    }

    return code
  }

  getComments() {
    return this._comments
  }

  getMachineCommands() {
    return this._machineCmds
  }

  getProgramCommands() {
    return this._programCmds
  }
}

module.exports = Block
