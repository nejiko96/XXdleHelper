import $ from 'jquery'
import WordleHelper from './wordle-helper'

import './style.css'

const run = () => {
  try {
    const tried = $('#tried').val()
    const got = $('#got').val()
    const allowed = $('#allowed').val()
    const wordle = new WordleHelper(tried, got, allowed.length ? allowed : '.....')
    let resultsDisp = ''
    const results = wordle.search
    if (results.length) {
      const results10 = results.slice(0, 10)
      if (results.length > 10) results10.push('...')
      resultsDisp = [
        results10.join(' '),
        ` (total ${results.length} words)`
      ]
    } else {
      resultsDisp = [
        wordle.generate,
        `* : ${wordle.remain}`
      ]
    }
    $('#result').val(resultsDisp.join('\n'))
    const sgs = wordle.suggest.slice(0, 5)
    $('#suggestion').val(sgs.map(sg => `${sg.w}(${[sg.r1, sg.r2, sg.r3].join('-')})`).join('\n'))
  } catch (error) {
    $('#result').val(error)
  }
}

$(() => {
  run()
})

$('#frm').on('submit', () => {
  run()
  return false
})

$('#clear').on('click', () => {
  $('#tried').val('')
  $('#got').val('')
  $('#allowed').val('')
  $('#result').val('')
  $('#suggestion').val('')
})

$('#tried,#got,#allowed').on('keydown', () => {
  $('#result').val('')
  $('#suggestion').val('')
})
