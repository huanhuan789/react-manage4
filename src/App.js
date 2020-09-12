import React from 'react';
// import { Button } from 'antd';
import './App.less';
import Login from './pages/login/Login';
import Manage from './pages/manage/Manage';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Switch>{/* 只匹配其中一个路由 */}
        <Route path='/' component={Login} />
        <Route path='/Manage' component={Manage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
