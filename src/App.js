import React, { useEffect } from "react";
// import { Button } from 'antd';
import "./App.less";
import { message } from "antd";
import Login from "./pages/login/Login";
import Manage from "./pages/manage/Manage";
import { connect } from "react-redux";
import { getAdminData } from "./redux/actions";
// import {useHistory} from "react-router-dom"
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
//BrowserRouter HashRouter
// import { Router, Route, hashHistory } from 'react-router-dom';
function App(props) {
  //
  return (
    <BrowserRouter>
      <Switch>
        {/* 只匹配其中一个路由   */}
        {/* /* exact精确匹配 */}
        <Route path="/login" component={Login} />
        <Route path="/manage" exact component={Manage} />
        <Route path="/" render={() => <Redirect to="/login" />} />
        {/* <Redirect exact from="/" to="/manage" /> */}
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
