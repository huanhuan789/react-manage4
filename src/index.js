import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {getStore} from './config/mUtils'
import localUtils from './config/localUtils'
import {Provider} from 'react-redux'
import store from './redux/store'
const urlParams = new URL(window.location.href);
console.log(urlParams.pathname)
// 读取local中保存user，保存到内存中 维持登录
// const user=JSON.parse(getStore('user'))

// console.log(user)
// if(user){
//   localUtils.user=user
// }

ReactDOM.render(( 
  //将store提供给所有的容器组件
   <Provider store={store}>
  <App />
  </Provider>)
,
  document.getElementById('root')
);

