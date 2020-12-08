import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.less'
// import {reqLogin} from '../../api/index'
import { login, getAdminInfo } from '../../api/getData'
import { setStore } from '../../config/mUtils'
import localUtils from '../../config/localUtils'
import { Redirect, withRouter } from 'react-router-dom';
import { useEffect } from 'react';
import {connect} from 'react-redux'
import {getAdminData} from '../../redux/actions'
import store from '../../redux/store'
function Login(props) {
  // const [show, setShow] = useState(true);
  // console.log(user)
  // console.log(store.getState())
  console.log(props)
  // console.log(props.store.getState())
  // let user = store.getState()
  props.getAdminData()
  // console.log(localUtils)
  const user=props.user
  console.log(user)
  //将管理员信息加入到全局中，【在redux中获取】
  // const getAdminData = async () => {
  //   const adminInfo = await getAdminInfo()
  //   console.log('获取getAdminInfo()=--------------', adminInfo)
  //   if (adminInfo.status == 1) {
  //     // 将用户信息添加到全局中
  //     // user = adminInfo.data
  //     // 将用户信息分发给store
  //      store.dispatch({type:'ADMININFO'},adminInfo)
  //     // 将用户信息添加到local中 维持登录状态
  //     setStore('user', adminInfo.data)
  //   }
  // }

  console.log(props)
  // const adminInfo=(newValue)=>{
  //   if(newValue.id){
  //     message.success('检测到您已经登陆过，将自动登录')
  //   }
  // }
  // const adminInfo=(newValue)=>{
  //   if (newValue.id) {
  //     message( '检测到您之前登录过，将自动登录');
  //     props.history.push('manage')
  //   }
  // }
  // // const saveAdminInfo=(state, adminInfo)=>{
  // // 	state.adminInfo = adminInfo;
  // // }
  // const getAdminData=()=>{
  //   try{
  // 		const res = await getAdminInfo()
  // 		if (res.status == 1) {
  // 		res.data.adminInfo=adminInfo
  // 		}else{
  // 			throw new Error(res.type)
  // 		}
  // 	}catch(err){
  // 		// console.log(err.message)
  //   }

  // }
  const onFinish = async (values) => {
    if (values) {
      console.log('Received values of form: ', values);
      const username = values.username;
      const password = values.password
      console.log('用户名', username)
      console.log('密码', password)
      console.log(user)
      //如果全局中有用户信息了，对用户的密码进行验证
      // if (user) {
      const result = await login({ user_name: username, password: password })
      console.log('获取login信息------------', result)
      if (result.status == 1) {
        message.success('登陆成功');
        console.log(result)
        props.history.push('/manage')

      } else {
        message.error(result.message);
        // console.log(result)
        // }
      }
    }


    // console.log(user)

    // 得到用户信息
    // const adminInfo = await getAdminInfo()
    // 将user信息保存到local中(维持登录)

    //将user信息保存到内存中
    // localUtils.user = adminInfo.data
    // console.log(adminInfo)
    // 如果有用户信息，跳转到管理界面
    // const user = localUtils.user
    // console.log(user.id)


    // if (show === false) {
    //   return <Redirect to='/Manage' />
    // }

  }


  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    message.error('请输入正确的用户名密码');
  };
  //判断全局中是否有该用户名，如果没有用户名，加入用户名到全局中，如果有自动登录
  useEffect(() => {
    console.log(user)
    // 判断内存中是否有user
    console.log(user.id)
    console.log(user.user_name)
    if (!user||!user.id) {
      props.getAdminData()
      console.log('------------------zhixingl')
      // console.log(user)
    } else {
      message.success('检测到您已经登陆过，将自动登录')
      console.log('检测到您已经登陆过，将自动登录')
      // setShow(false)
      // return <Redirect  to='/' />
      // console.log(show)
      props.history.push('/manage')
    }
  }, [])
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
            onFinishFailed={onFinishFailed}
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

export default connect(
  state =>({
    user:state
  }),
  {getAdminData}
)(Login);