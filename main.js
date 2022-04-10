import $ from 'jquery'
import WordleHelper from './wordle-helper'

import './style.css'

const run = () => {
  try {
    const tried = $('#tried').val()
    const got = $('#got').val()
    const allowed = $('#allowed').val()
    const wordle = new WordleHelper(tried, got, allowed)
    const results = wordle.search()
    const resultsDisp = [results.slice(0, 10).join(' ')]
    if (results.length > 10) resultsDisp.push('...')
    resultsDisp.push(` (total ${results.length} words)`)
    $('#result').val(resultsDisp.join('\n'))
    const sgst = wordle.suggest()
    $('#suggestion').val(sgst.map(e => `${e[0]}(${e.slice(1, 4).join('-')})`).join('\n'))
  } catch (error) {
    $('#result').val(error)
  }
}

$('#frm').on('submit', () => {
  run()
  return false
})

$('#tried,#got,#allowed').on('keydown', () => {
  $('#result').val('')
  $('#suggestion').val('')
})
