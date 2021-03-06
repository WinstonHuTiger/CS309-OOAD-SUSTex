import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import Router from './Router';

axios.defaults.withCredentials = true
window.url = "http://127.0.0.1:8000";
window.ws = "ws://127.0.0.1:8000"
ReactDOM.render(
  <Router/>
  ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
