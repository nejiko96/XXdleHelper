import wordsRaw from './words.txt?raw'
import { deleteChars, selectChars, uniq, permutation } from './util'

const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

class WordleHelper {
  static __words = wordsRaw.split('\n')

  constructor(hint) {
    this._hint = hint.toUpperCase()
  }

  get tried() {
    if (this._tried === undefined) {
      this._tried = uniq(selectChars(this._hint, ALL_CHARS))
    }
    return this._tried
  }

  get got() {
    if (this._got === undefined) {
      const gotRaw = (this._hint.match(/[A-Z](!|\?)/g) || []).join('')
      this._got = uniq(selectChars(gotRaw, ALL_CHARS))
    }
    return this._got
  }

  get allowed() {
    if (this._allowed === undefined) {
      const arr = [...'.....']
      const ts = this._hint.match(/[A-Z](!|\?)?/g) || []
      ts.forEach((t, i) => {
        const [c, q] = [...t]
        const j = i % 5
        if (q == '!') {
          arr[j] = c
        } else if (q == '?') {
          if (arr[j] == '.') {
            arr[j] = new Set()
          }
          if (arr[j] instanceof Set) {
            arr[j].add(c)
          }
        }
      })
      this._allowed = ''
      arr.forEach((o, j) => {
        if (o instanceof Set) {
          this._allowed += '[^' + [...o].join('') + ']'
        } else {
          this._allowed += o
        }
      })
    }
    return this._allowed
  }

  get words() {
    return WordleHelper.__words
  }

  get excludePat() {
    if (this._excludePat === undefined) {
      const otherChars = deleteChars(this.tried, this.got)
      this._excludePat = new RegExp(`[_${otherChars}]`)
    }
    return this._excludePat
  }

  get includePat() {
    if (this._includePat === undefined) {
      const contains = [...this.got].map(c => `(?=.*${c})`).join('')
      this._includePat = new RegExp(`^${contains}${this.allowed}$`)
    }
    return this._includePat
  }

  get search() {
    if (this._search === undefined) {
      this._search = this.words.filter(w => !w.match(this.excludePat) && w.match(this.includePat))
    }
    return this._search
  }

  get generate() {
    if (this._generate === undefined) {
      const base = (this.got + '*'.repeat(5)).substring(0, 5)
      const perms = uniq(permutation(base))
      this._generate = perms.filter(w => w.match(this.includePat))
    }
    return this._generate
  }

  get remain() {
    if (this._remain === undefined) {
      this._remain = deleteChars(ALL_CHARS, this.tried)
    }
    return this._remain
  }

  get charHist() {
    if (this._charHist === undefined) {
      const h = new Proxy({}, {
        get: (object, property) => {
          return property in object ? object[property] : 0
        }
      })
      if (this.search.length) {
        this.search.forEach(w => {
          [...w].forEach((c, i) => {
            h[c] += 1
            h[c + i] += 1
          })
        })
      } else {
        [...this.remain].forEach(c => h[c] += 1)
      }
      this._charHist = h
    }
    return this._charHist
  }

  get suggest() {
    if (this._suggest === undefined) {
      if (this.search.length === 1 || this.search.length === 2) {
        this._suggest = []
      } else {
        const ch = this.charHist
        const sgs = this.words.map(w => {
          const r1 = [...uniq(deleteChars(w, this.tried))].reduce((r, c) => r + ch[c], 0)
          const r2 = [...w].reduce((r, c, i) => r + (this.tried.includes(c) ? 0 : ch[c + i]), 0)
          const r3 = selectChars(w, this.got).length
          return { w, r1, r2, r3 }
        })
        sgs.sort((a, b) => {
          if (a.r1 != b.r1) return b.r1 - a.r1
          if (a.r2 != b.r2) return b.r2 - a.r2
          if (a.r3 != b.r3) return b.r3 - a.r3
          return a.w.localeCompare(b.w)
        })
        this._suggest = sgs
      }
    }
    return this._suggest
  }

  get debug() {
    return [
      this._hint,
      this.tried,
      this.got,
      this.allowed,
      this.excludePat,
      this.includePat
    ]
  }
}

export default WordleHelper
