import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {getStore} from './config/mUtils'
import localUtils from './config/localUtils'
// 读取local中保存user，保存到内存中
const user=getStore('user')
console.log(user)
localUtils.user=user
ReactDOM.render(
    <App />,
  document.getElementById('root')
);

