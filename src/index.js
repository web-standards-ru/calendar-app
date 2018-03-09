import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Storage from './utils/storage'
import registerServiceWorker from './registerServiceWorker'
import {injectGlobal} from 'styled-components'

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
  .Select--multi .Select-value {
    color: #e15345;
    border: 1px solid #f3bdb8;
    background-color: rgba(243, 185, 180, 0.1);
  }
  .Select--multi .Select-value-icon {
    border-right: 1px solid #f3bdb8;
  }
  .Select--multi .Select-value-icon:hover, .Select--multi .Select-value-icon:focus {
    background-color: rgb(251, 228, 227);
    color: #c73c2f;
  }
`

ReactDOM.render(<App storage={new Storage()} />, document.getElementById('root'))
registerServiceWorker()
