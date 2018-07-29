import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import axios from 'axios'
import {Provider} from 'mobx-react'
import stateNote from './states/note.js'
import stateSession from './states/session.js'

if (localStorage.getItem('token')){
  axios.defaults.headers.common['authorization'] = 'Bearer '+ localStorage.getItem('token')
} else {
  axios.defaults.headers.common['authorization'] = null
}

ReactDOM.render(<Provider note={stateNote} session={stateSession}><App /></Provider>, document.getElementById('root'));
