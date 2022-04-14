import samplesRaw from './nerdle-samples.txt?raw'
import { deleteChars } from './util'

class NerdleHelper {
  static __samples = samplesRaw.split('\n')

  static get suggest() {
    return NerdleHelper.__samples[Math.floor(Math.random() * NerdleHelper.__samples.length)]
  }

  constructor(got, allowed) {
    this._got = deleteChars(got, '^0-9=+*/-')
    this._allowed = (allowed.length ? allowed : '.......').replace(/\[\^?/g, '[^')
  }

  get got() {
    return this._got
  }

  get allowed() {
    return this._allowed
  }

  get search() {
    return [
      '11+27=38',
      '17+21=38',
      '21+17=38',
      '27+11=38',
      '71+12=83',
      '72+11=83'
    ]
  }
}

export default NerdleHelper
