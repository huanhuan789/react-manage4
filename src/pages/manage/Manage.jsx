import React, { useState } from 'react';
import localUtils from '../../config/localUtils'
import { BrowserRouter as Router, Route, Link,Redirect } from "react-router-dom";
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
import  AdminList from '../adminlist/adminList'
import AdminSet from '../adminset/adminSet'
import FoodList from '../foodlist/foodLst'
import Home from '../home/home'
import OderList from '../oderlist/oderList' 
import ShopList from '../shoplist/shopList'
import UserList from '../userlist/userList'
import Ediet from '../ediet/ediet'
import VisitorPie from '../../components/visitorpie/visitorPie'

import LeftNav from '../../components/left-nav/leftNav'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// 后台管理的路由组件
function Manage(props){
    // 读取保存的user，如果不存在，直接跳转到登录页面
    const user=localUtils.user
    console.log(user)
    if(!user||!user.id){
        props.history.replace('/')
//   return  <Redirect to ='/'/>
    }
// console.log(!user)
// state = {
//     collapsed: false,
//   };
const [collapsed,setCollapsed]=useState(false)

const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapsed(collapsed => !collapsed);
    console.log(collapsed);
  };
    return(
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" ><Link to="/home"></Link>
              首页
            </Menu.Item>
            <SubMenu key="sub1"  title="数据管理">
              <Menu.Item key="3"><Link to="/UserList"></Link>用户列表</Menu.Item>
              <Menu.Item key="4"><Link to="/shoplist"></Link>商家列表</Menu.Item>
              <Menu.Item key="5"><Link to="/foodlist"></Link>食品列表</Menu.Item>
              <Menu.Item key="6"><Link to="/oderlist"></Link>订单列表</Menu.Item>
              <Menu.Item key="7"><Link to="/adminlist"></Link>管理员列表</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2"  title="添加数据">
              <Menu.Item key="8"><Link to="/addshop"></Link>添加商铺</Menu.Item>
              <Menu.Item key="9"><Link to="/addgoods"></Link>添加商品</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3"  title="图表">
              <Menu.Item key="10"><Link to="/visitorpie"></Link>用户分布</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4"  title="编辑">
              <Menu.Item key="11"><Link to="/ediet"></Link>文本编辑</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5"  title="设置">
              <Menu.Item key="12"><Link to="/adminset"></Link>管理员设置</Menu.Item>
            </SubMenu>
           
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <HeadTop />
          <Content style={{ margin: '0 16px' }}>
              {/* 子路由组件 */}
             
                  <Redirect  from='/Manage' exact to='/home' />
                    <Route  exact path='/home' exact component={Home}/>
                    <Route exact path='/addgoods' component={AddGoods}/>
                    <Route exact path='/addshop' component={AddShop}/>
                    <Route exact path='/adminlist' component={AdminList}/>
                    <Route exact path='/adminset' component={AdminSet}/>
                    <Route exact path='/foodlist' component={FoodList}/>
                    <Route exact path='/oderlist' component={OderList}/>
                    <Route exact path='/shoplist' component={ShopList}/>
                    <Route exact path='/ediet' component={Ediet}/>   
                    <Route exact path='/visitorpie' component={VisitorPie}/>   
                    <Route exact path='/userList' component={UserList}/>   
             
          </Content>
        </Layout>
      </Layout>
      </Router>
    )
}
export default Manage