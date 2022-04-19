import wordsRaw from './words.txt?raw'
import { deleteChars, selectChars, uniq, permutation } from './util'

const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

class WordleHelper {
  static #WORDS = wordsRaw.split('\n')

  constructor(hint) {
    const hs = hint.toUpperCase().match(/[A-Z](!|\?)?/g) || []
    this.tried = uniq(hs.map(h => h[0])).join('')
    this.got = uniq(hs.filter(h => h[1]).map(h => h[0])).join('')
    const arr = new Array(5).fill(null)
    hs.forEach((h, i) => {
      const [c, m] = [...h]
      const j = i % 5
      if (m == '!') {
        arr[j] = c
      } else if (m == '?') {
        (arr[j] ||= new Set()).add && arr[j].add(c)
      }
    })
    this.allowed = arr
    this.others = deleteChars(this.tried, this.got)
    this.remain = deleteChars(ALL_CHARS, this.tried)
  }

  get words() {
    return WordleHelper.#WORDS
  }

  get excludePat() {
    if (this._excludePat === undefined) {
      this._excludePat = new RegExp(`[_${this.others}]`)
    }
    return this._excludePat
  }

  get includePat() {
    if (this._includePat === undefined) {
      const containsRe = [...this.got].map(c => `(?=.*${c})`).join('')
      const allowedRe = this.allowed.map(e => (e && e.add && '[^' + [...e].join('') + ']') || e || '.').join('')
      this._includePat = new RegExp(`^${containsRe}${allowedRe}$`)
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
      if (this.search.length >= 1 || this.search.length <= 2) {
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
