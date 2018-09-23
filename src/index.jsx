import React from 'react'
import ReactDOM from 'react-dom'
import 'babel-polyfill'

import axios from 'axios'
import { Provider } from 'mobx-react'
import App from './App'
import stateNote from './states/note'
import stateSession from './states/session'
import stateUi from './states/ui'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'


if (localStorage.getItem('token')) {
  axios.defaults.headers.common.authorization = `Bearer ${localStorage.getItem('token')}`
} else {
  axios.defaults.headers.common.authorization = null
}

ReactDOM.render((
  <Provider note={stateNote} session={stateSession} ui={stateUi}>
    <App />
  </Provider>), document.getElementById('root'))
