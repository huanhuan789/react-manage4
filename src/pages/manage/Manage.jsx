import React, { useState, useEffect } from 'react';
import localUtils from '../../config/localUtils'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import './Manage.less'
import { Layout, Menu, Breadcrumb } from 'antd';
import HeadTop from '../../components/headTop/headtop'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
// 引入子路由
import AddGoods from '../addgoods/addGoods'
import AddShop from '../addshop/addShop'
import AdminList from '../adminlist/adminList'
import AdminSet from '../adminset/adminSet'
import FoodList from '../foodlist/foodLst'
import Home from '../home/home'
import Visitor from '../visitior/visitor'
import OderList from '../oderlist/oderList'
import ShopList from '../shoplist/shopList'
import UserList from '../userlist/userList'
import Ediet from '../ediet/ediet'
import {connect} from 'react-redux'
import VisitorPie from '../../components/visitorpie/visitorPie'

import LeftNav from '../../components/left-nav/leftNav'
import { getAdminData } from '../../redux/actions';
// import {createBrowserHistory} from 'history'

// const history = createBrowserHistory()
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// 后台管理的路由组件
function Manage(props) {

  // 读取保存的user，如果不存在，直接跳转到登录页面

  useEffect(() => {
    let user = props.user
    console.log(user.id)
    if (!user.id) {
      props.history.push('/')
    }
  }, [])

  //   return  <Redirect to ='/'/>

  // console.log(!user)
  // state = {
  //     collapsed: false,
  //   };
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapsed(collapsed => !collapsed);
    console.log(collapsed);
  };
  // let path = props.location.pathname
  // const history = createBrowserHistory()

  return (
    <Router >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <Menu theme="dark"
            defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" ><Link to="/home"></Link>
              首页
            </Menu.Item>
            <SubMenu key="sub1" title="数据管理">
              <Menu.Item key="3"><Link to="/UserList">用户列表</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/shoplist">商家列表</Link></Menu.Item>
              <Menu.Item key="5"><Link to="/foodlist">食品列表</Link></Menu.Item>
              <Menu.Item key="6"><Link to="/oderlist">订单列表</Link></Menu.Item>
              <Menu.Item key="7"><Link to="/adminlist">管理员列表</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="添加数据">
              <Menu.Item key="8"><Link to="/addshop">添加商铺</Link></Menu.Item>
              <Menu.Item key="9"><Link to="/addgoods">添加商品</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title="图表">
              <Menu.Item key="10"><Link to="/visitor">用户分布</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="编辑">
              <Menu.Item key="11"><Link to="/ediet">文本编辑</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" title="设置">
              <Menu.Item key="12"><Link to="/adminset">管理员设置</Link></Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>
        <Layout className="site-layout">
          <HeadTop />
          <Content style={{ margin: '0 16px' }} key={props.location.key}>
            {/* 子路由组件 */}

            <Redirect from='/manage' to='/home' />
            {/* <Route
                  path="/manage"
                  render={() => <Redirect to="/home" />}
                /> */}

            <Route path='/home' component={Home} />
            <Route path='/addgoods/:restaurant_id?' component={AddGoods} />
            <Route path='/addshop' component={AddShop} />
            <Route path='/adminlist' component={AdminList} />
            <Route path='/adminset' component={AdminSet} />
            <Route exact path='/foodlist' component={FoodList} />
            <Route exact path='/oderlist' component={OderList} />
            <Route exact path='/shoplist/' component={ShopList} />
            <Route exact path='/ediet' component={Ediet} />
            <Route exact path='/visitor' component={Visitor} />
            <Route exact path='/userList' component={UserList} />

          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default connect(state=>({
  user:state
}),{getAdminData})(Manage)