import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'

import { hot } from 'react-hot-loader'
import { Provider } from 'mobx-react'

import App from './App'
import stateNote from './states/note'
import stateSession from './states/session'
import stateUi from './states/ui'

import './index.scss'


if (localStorage.getItem('token')) {
  axios.defaults.headers.common.authorization = `Bearer ${localStorage.getItem('token')}`
} else {
  axios.defaults.headers.common.authorization = null
}

class AppComponent extends React.Component {
  render() {
    return (
      <Provider note={stateNote} session={stateSession} ui={stateUi}>
        <App />
      </Provider>
    )
  }
}
const AppBody = hot(module)((AppComponent))

const MainApp = () => {
  ReactDOM.render(<AppBody />, document.getElementById('root'))
}

document.addEventListener('DOMContentLoaded', MainApp)
