import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useEffect } from 'react';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function LeftNav(){

    return (
        <div>
                     <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" >
              首页
            </Menu.Item>
            <SubMenu key="sub1"  title="数据管理">
              <Menu.Item key="3">用户列表</Menu.Item>
              <Menu.Item key="4">商家列表</Menu.Item>
              <Menu.Item key="5">食品列表</Menu.Item>
              <Menu.Item key="6">订单列表</Menu.Item>
              <Menu.Item key="7">管理员列表</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2"  title="添加数据">
              <Menu.Item key="8">添加商铺</Menu.Item>
              <Menu.Item key="9">添加商品</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3"  title="图表">
              <Menu.Item key="10">用户分布</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4"  title="编辑">
              <Menu.Item key="11">文本编辑</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5"  title="设置">
              <Menu.Item key="12">管理员设置</Menu.Item>
            </SubMenu>
           
          </Menu>
        </div>
    )
}
export default LeftNav