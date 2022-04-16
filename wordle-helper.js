import wordsRaw from './words.txt?raw'
import { deleteChars, selectChars, uniq, permutation } from './util'

const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

class WordleHelper {
  static __words = wordsRaw.split('\n')

  constructor(tried, got, allowed) {
    this._tried = selectChars(tried.toUpperCase(), ALL_CHARS)
    this._got = selectChars(got.toUpperCase(), ALL_CHARS)
    this._allowed = (allowed.length ? allowed : '.....').toUpperCase().replace(/\[\^?/g, '[^')
  }

  get tried() {
    return this._tried
  }

  get got() {
    return this._got
  }

  get allowed() {
    return this._allowed
  }

  get words() {
    return WordleHelper.__words
  }

  get excludePat() {
    if (this._excludePat === undefined) {
      const otherChars = deleteChars(uniq(this.tried), this.got)
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
}

export default WordleHelper
