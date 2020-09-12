import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.less'
// import {reqLogin} from '../../api/index'
import { login, getAdminInfo } from '../../api/getData'
function Login(props) {
  console.log(props)
  const onFinish =async (values) => {
    console.log('Received values of form: ', values);
    const username = values.username;
    const password = values.password
    console.log('用户名', username)
    console.log('密码', password)
    const result=await login({user_name: username, password:password})
    if (result.status == 1) {
      message.success('登陆成功');
     props.history.replace('/Manage')
    }else{
      message.error(result.message);
    }

  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
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
          <p className="tip">温馨提示：</p>
          <p className="tip">未登录过的新用户，自动注册</p>
          <p className="tip">注册过的用户可凭账号密码登录</p>
        </section>
      </div>
    </div>
  );
}

export default Login;