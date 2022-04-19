import $ from 'jquery'
import WordleHelper from './wordle-helper'
import NerdleHelper from './nerdle-helper'

import './style.css'

const wdlRun = () => {
  try {
    const hint = $('#txtWdlHint').val()
    const wordle = new WordleHelper(hint)
    console.log(wordle)
    let resultsDisp = []
    const results = wordle.search
    if (results.length) {
      const resultsTop = results.slice(0, 10)
      if (results.length > 10) resultsTop.push('...')
      resultsDisp = [
        resultsTop.join(' '),
        ` (total ${results.length} words)`
      ]
    } else {
      resultsDisp = [
        wordle.generate.join(','),
        `* : ${wordle.remain}`
      ]
    }
    $('#lblWdlResult').val(resultsDisp.join('\n'))
    const sgs = wordle.suggest.slice(0, 5)
    $('#lblWdlSuggestion').val(sgs.map(sg => `${sg.w}(${[sg.r1, sg.r2, sg.r3].join('-')})`).join('\n'))
  } catch (error) {
    console.log(error)
    $('#lblWdlResult').val(error)
  }
}

const ndlSuggest = () => {
  const sg = NerdleHelper.suggest
  $('#lblNdlSuggestion').val(sg)
}

const ndlRun = () => {
  try {
    const hint = $('#txtNdlHint').val()
    const nerdle = new NerdleHelper(hint)
    console.log(nerdle)
    const results = nerdle.search
    const resultsDisp = results.slice(0, 10)
    if (results.length > 10) resultsDisp.push('...')
    resultsDisp.push(` (total ${results.length} results)`)
    $('#lblNdlResult').val(resultsDisp.join('\n'))
  } catch (error) {
    console.log(error)
    $('#lblNdlResult').val(error)
  }
}

$(() => {
  wdlRun()
  ndlSuggest()
})

$('#frmWdl').on('submit', () => {
  wdlRun()
  return false
})

$('#btnWdlClear').on('click', () => {
  $('#txtWdlHint,#lblWdlResult,#lblWdlSuggestion').val('')
})

$('#txtWdlHint').on('keydown', () => {
  $('#lblWdlResult,#lblWdlSuggestion').val('')
})

$('#txtWdlHint').on('blur', (e) => {
  $(e.target).val($(e.target).val().toUpperCase())
})

$('#frmNdl').on('submit', () => {
  ndlRun()
  return false
})

$('#btnNdlClear').on('click', () => {
  $('#txtNdlHint,#lblNdlResult').val('')
})

$('#txtNdlHint').on('keydown', () => {
  $('#lblNdlResult').val('')
})
