import samplesRaw from './nerdle-samples.txt?raw'
import { deleteChars, selectChars, repeatedPermutation } from './util'

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

class ParseError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'ParseError'
  }
}

class Parser {
  constructor(tokens) {
    this._tokens = tokens
    this._pos = 0
  }

  peek() {
    return this._tokens[this._pos]
  }

  consume() {
    this._pos++
  }

  number() {
    const x = this.peek()
    if (x.match(/\D+/)) throw new ParseError(`found ${x} where number is expected.`)

    this.consume()
    return parseInt(x, 10)
  }

  term() {
    let x = this.number()
    while (true) {
      switch (this.peek()) {
        case '*':
          this.consume()
          x *= this.number()
          continue
        case '/':
          this.consume()
          const y = this.number()
          if (y === 0) throw new ParseError('divide by zero')
          if (x % y) throw new ParseError(`${x} can't be divided by ${y}`)
          x /= y
          continue
      }
      break
    }
    return x
  }

  expr() {
    let x = this.term()
    while (true) {
      switch (this.peek()) {
        case '+':
          this.consume()
          x += this.term()
          continue
        case '-':
          this.consume()
          x -= this.term()
          continue
      }
      break
    }
    return x
  }
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
      const zero = [...ds.intersection(d0)]
      const top = [...ds.difference(d0)]
      const succ = [1, 2, 3, 4].flatMap(k => repeatedPermutation(this.digits, k - 1))
      const nonzero = top.flatMap(t => succ.map(s => t + s))
      this._nums = zero.concat(nonzero)
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
      const otherDigits = deleteChars(ALL_DIGITS, this.digits)
      this._excludePat = new RegExp(`[_${otherDigits}]`)
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

  #chk(tokens) {
    try {
      const ans = new Parser(tokens).expr().toString()
      if (ans.match(this.excludePat)) return

      const eq = `${tokens.join('')}=${ans}`
      if (!eq.match(this.includePat)) return

      this._search.push(eq)
    } catch (error) {
    }
  }

  #dfs(tokens) {
    if (tokens.join('').length > 6) return

    if (tokens.length % 2) {
      this.#chk(tokens)
      this.ops.forEach(op => this.#dfs(tokens.concat(op)))
    } else {
      this.nums.forEach(num => this.#dfs(tokens.concat(num)))
    }
  }

  get search() {
    if (this._search === undefined) {
      this._search = []
      this.#dfs([])
    }
    return this._search
  }

  get debug() {
    return [
      this.got,
      this.allowed,
      this.digits,
      this.nums,
      this.ops,
      this.excludePat,
      this.includePat
    ]
  }
}

export default NerdleHelper
