import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { injectGlobal } from 'styled-components'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-color: #f1f1f1;
  }
  .Select-option.is-focused {
    background-color: #f1f1f1 !important;
  }
  .Select-option.is-selected {
    background-color: #bab8b841 !important;
  }
`

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
