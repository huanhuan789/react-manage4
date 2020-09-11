import React from 'react';
// import { Button } from 'antd';
import './App.less';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import {HashRouter, Switch, Route} from 'react-router-dom'
function App() {
  return (
    <HashRouter>
      <Switch>{/* 只匹配其中一个路由 */}
        <Route path='/' component={Login} />
        <Route path='/admin' component={Admin} />
      </Switch>

    </HashRouter>
  );
}

export default App;
