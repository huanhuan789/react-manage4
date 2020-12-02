import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.less'
// import {reqLogin} from '../../api/index'
import { login, getAdminInfo } from '../../api/getData'
import { setStore } from '../../config/mUtils'
import localUtils from '../../config/localUtils'
import { Redirect,withRouter } from 'react-router-dom';
function Login(props) {
  // const [show, setShow] = useState(true);
  console.log(props)
  const onFinish = async (values) => {
   if(values){
    console.log('Received values of form: ', values);
    const username = values.username;
    const password = values.password
    console.log('用户名', username)
    console.log('密码', password)
    const result = await login({ user_name: username, password: password })
    const user = localUtils.user
    console.log(user)
    if (result.status == 1) {
      message.success('登陆成功');
      // 得到用户信息
      const adminInfo = await getAdminInfo()
      // 将user信息保存到local中
      setStore('user', adminInfo.data)
      //将user信息保存到内存中
      localUtils.user = adminInfo.data
      console.log(result)
      console.log(adminInfo)
      // 如果有用户信息，跳转到管理界面
      const user = localUtils.user
      console.log(user.id)
      if (user&&user.id) {
        // setShow(false)
        // return <Redirect  to='/' />
        // console.log(show)
       props.history.replace('/')
      }

      // if (show === false) {
      //   return <Redirect to='/Manage' />
      // }

    } else {
      message.error(result.message);
    }

  } 
  }
 
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    message.error( '请输入正确的用户名密码');
  };
  return (
    <div className="login_page fillcontain">
      <div name="form-fade" mode="in-out">
        <section className="form_contianer">
          <div className="manage_tip">
            <p>elm后台管理系统</p>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed ={onFinishFailed }
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登 录
        </Button>
            </Form.Item>
          </Form>
  {/* <p className="tip">{show ? 'true': 'false'}</p> */}
  <p className="tip">温馨提示：</p>
          <p className="tip">未登录过的新用户，自动注册</p>
          <p className="tip">注册过的用户可凭账号密码登录</p>
        </section>
      </div>
    </div>
  );
}

export default withRouter(Login);