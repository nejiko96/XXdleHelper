import samplesRaw from './nerdle-samples.txt?raw'
import { deleteChars, selectChars } from './util'

const ALL_DIGITS = '0123456789'
const ALL_OPS = '+*/-'
const ALL_CHARS = ALL_DIGITS + '=' + ALL_OPS

const escapeOps = (str) => {
  return str.replace(/[*+\/=]/g, '\\$&')
}
Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
      if (this.has(elem)) {
          intersection.add(elem);
      }
  }
  return intersection;
}

Set.prototype.difference = function(setB) {
  var difference = new Set(this);
  for (var elem of setB) {
      difference.delete(elem);
  }
  return difference;
}
class NerdleHelper {
  static __samples = samplesRaw.split('\n')

  static get suggest() {
    return NerdleHelper.__samples[Math.floor(Math.random() * NerdleHelper.__samples.length)]
  }

  constructor(got, allowed) {
    this._got = selectChars(got, ALL_CHARS)
    this._allowed = (allowed.length ? allowed : '........').replace(/\[\^?/g, '[^')
  }

  get got() {
    return this._got
  }

  get allowed() {
    return this._allowed
  }

  get digits() {
    if (this._digits === undefined) {
      this._digits = selectChars(this.got, ALL_DIGITS)
    }
    return this._digits
  }

  get nums() {
    if (this._nums === undefined) {
      const ds = new Set([...this.digits])
      const d0 = new Set(['0'])
      const zero = ds.intersection(d0)
      const top = ds.difference(d0)
      // TODO JS版はめんどい
      this._nums = selectChars(this.got, ALL_DIGITS)
    }
    return this._nums
  }

  get ops() {
    if (this._ops === undefined) {
      this._ops = [...selectChars(this.got, ALL_OPS)]
    }
    return this._ops
  }

  get excludePat() {
    if (this._excludePat === undefined) {
      const otherChars = deleteChars(ALL_DIGITS, this.got)
      this._excludePat = new RegExp(`[_${otherChars}]`)
    }
    return this._excludePat
  }

  get includePat() {
    if (this._includePat === undefined) {
      const gs = [...this.got]
      const containsRe = gs.map(c => `(?=.*${escapeOps(c)})`).join('')
      const allowedRe = escapeOps(this.allowed)
      this._includePat = new RegExp(`^${containsRe}${allowedRe}$`)
    }
    return this._includePat
  }

  get search() {
    console.log(this)
    return [
      this.got,
      this.allowed,
      this.digits,
      this.ops,
      this.excludePat,
      this.includePat
    ]
  }
}

export default NerdleHelper
