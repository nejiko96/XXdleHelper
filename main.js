import $ from 'jquery'
import WordleHelper from './wordle-helper'

import './style.css'

const run = () => {
  const tried = $('#tried').val()
  const got = $('#got').val()
  const allowed = $('#allowed').val()
  const wordle = new WordleHelper(tried, got, allowed)
  const result = wordle.search()
  const sg = wordle.suggest()
  $('#result').val(result.join('\n'))
  $('#suggestion').val(sg.map(e => `${e[0]}(${e.slice(1, 4).join('-')})`).join('\n'))
}

$('#frm').on('submit', () => {
  run()
  return false
})

$('#tried,#got,#allowed').on('keydown', () => {
  $('#result').val('')
  $('#suggestion').val('')
})

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
