import $ from 'jquery'
import WordleHelper from './wordle-helper'

import './style.css'

const wdlRun = () => {
  try {
    const tried = $('#txtWdlTried').val()
    const got = $('#txtWdlGot').val()
    const allowed = $('#txtWdlAllowed').val()
    const wordle = new WordleHelper(tried, got, allowed)
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
    $('#lblWdlResult').val(resultsDisp.join('\n'))
    const sgs = wordle.suggest.slice(0, 5)
    $('#lblWdlSuggestion').val(sgs.map(sg => `${sg.w}(${[sg.r1, sg.r2, sg.r3].join('-')})`).join('\n'))
  } catch (error) {
    $('#lblWdlResult').val(error)
  }
}

const ndlSuggest = () => {
  $('#lblNdlSuggestion').val('56/7+1=9 3x8-4=20')
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
  $('#txtWdlTried,#txtWdlGot,#txtWdlAllowed,#lblWdlResult,#lblWdlSuggestion').val('')
})

$('#txtWdlTried,#txtWdlGot,#txtWdlAllowed').on('keydown', () => {
  $('#lblWdlResult,#lblWdlSuggestion').val('')
})

$('#frmNdl').on('submit', () => {
  $('#lblNdlResult').val(' (total 0 results)')
  return false
})

$('#btnNdlClear').on('click', () => {
  $('#txtNdlGot,#txtNdlAllowed,#lblNdlResult').val('')
})

$('#txtNdlGot,#txtNdlAllowed').on('keydown', () => {
  $('#lblNdlResult').val('')
})
