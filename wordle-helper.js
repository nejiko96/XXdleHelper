import wordsContent from './words.txt?raw'

class WordleHelper {
  static __words = wordsContent.split('\n')

  constructor(tried, got, allowed) {
    this._tried = tried.toUpperCase().replace(/[^A-Z]/g, '')
    this._got = got.toUpperCase().replace(/[^A-Z]/g, '')
    this._allowed = allowed.toUpperCase().replace(/\[\^?/g, '[^')
  }

  get words() {
    return WordleHelper.__words
  }

  get excludePat() {
    if (this._excludePat === undefined) {
      const gotRe = new RegExp(`[_${this._got}]`, 'g')
      const othersArrRaw = [...this._tried.replace(gotRe, '')]
      const othersArrUniq = [...new Set(othersArrRaw)]
      const othersStr = othersArrUniq.join('')
      this._excludePat = new RegExp(`[_${othersStr}]`)
    }
    return this._excludePat
  }

  get includePat() {
    if (this._includePat === undefined) {
      const contains = [...this._got].map(c => `(?=.*${c})`).join('')
      this._includePat = new RegExp(`^${contains}${this._allowed}$`)
    }
    return this._includePat
  }

  search() {
    // const dbg = [
    //   this._tried,
    //   this._got,
    //   this._allowed,
    //   this.exclude_pat,
    //   this.include_pat
    // ]
    const ret = this.words.filter(w => !w.match(this.excludePat) && w.match(this.includePat))
    return ret
  }

  suggest() {
    return [
      ['AEROS', 27867, 8205, 5],
      ['SOARE', 27867, 8205, 5],
      ['AROSE', 82767, 4699, 5]
    ]
  }
}

export default WordleHelper
