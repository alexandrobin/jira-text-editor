import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import axios from 'axios'

if (localStorage.getItem('token')){
  axios.defaults.headers.common['authorization'] = 'Bearer '+ localStorage.getItem('token')
} else {
  axios.defaults.headers.common['authorization'] = null
}

ReactDOM.render(<App />, document.getElementById('root'));
