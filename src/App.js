import React from 'react';
// import { Button } from 'antd';
import './App.less';
import Login from './pages/login/Login';
import Manage from './pages/manage/Manage';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
//BrowserRouter HashRouter
// import { Router, Route, hashHistory } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Switch> 只匹配其中一个路由 
      {/* /* exact精确匹配 */}
      <Route path='/' exact component={Login} />
      <Route path='/manage'   exact component={Manage} />
        
       
      </Switch> 
   </BrowserRouter>
//   <Router history={hashHistory}>
//       <Switch> {/*只匹配其中一个路由  */}
//       {/* /* exact精确匹配 */}
//         <Route path='/' exact component={Login} />
//         <Route path='/Manage'    component={Manage} />
//       </Switch> 
// </Router>
  );
}

export default App;
