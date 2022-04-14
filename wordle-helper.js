import wordsRaw from './words.txt?raw'
import { deleteChars, uniq, permutation } from './util'

class WordleHelper {
  static __words = wordsRaw.split('\n')

  static get ALL_CHARS() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }

  constructor(tried, got, allowed) {
    this._tried = deleteChars(tried.toUpperCase(), '^A-Z')
    this._got = deleteChars(got.toUpperCase(), '^A-Z')
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
      const otherChars = uniq(deleteChars(this.tried, this.got))
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
      this._remain = deleteChars(WordleHelper.ALL_CHARS, this.tried)
    }
    return this._remain
  }

  get charHist() {
    if (this._charHist === undefined) {
      const h = [...WordleHelper.ALL_CHARS].reduce((o, c) => {
        o[c] = 0
        for (let i = 0; i < 5; i++) o[c + i] = 0
        return o
      },{})
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
          const r3 = deleteChars(w, `^${this.got}`).length
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
