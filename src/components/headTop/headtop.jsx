import React from 'react';
import {withRouter,Link,Redirect} from 'react-router-dom'
import './headtop.less';
import { signout } from '../../api/getData';
// import {baseImgPath} from '../../config/env';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import localUtils from '../../config/localUtils'
import {removeStore} from '../../config/mUtils'
import { Tooltip, Modal, Button, Space , Breadcrumb} from 'antd';
import menuList from '../../config/menuCon'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useEffect } from 'react';
import {baseImgPath} from '../../config/env'
import {connect} from 'react-redux'

const { confirm } = Modal;
function HeadTop(props) {
  let [titles,setTitles]=useState([])
  const user = props.user
  // const [adminInfo,setAdminInfo]=useState(user)
  // console.log(adminInfo.avatar)
    console.log(props)
   
    const logout = () => {
        confirm({
            title: '确认退出吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                console.log('确认');
                const res = await signout()
                if (res.status == 1) {
                  removeStore('user')
                  props.logoutAction()
                    // localUtils.user = {}
                    message.success('退出成功')
                    console.log(props)
                      // 跳转到登录界面
                    props.history.push('/login')
                } else {
                    message.error(res.message)
                }
              
            },
            onCancel() {
                console.log('取消');
            },
        });
    }
   const getTitle = () => {
        // 得到当前请求路径
        const path = props.location.pathname
        console.log(path)
        menuList.forEach(item => {
          if (item.key==path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
            console.log(item.key)
            console.log(path)
            titles = item.title
            setTitles(titles)
          // } else if (item.children) {
          //   // 在所有子item中查找匹配的
          //   const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          //   // 如果有值才说明有匹配的
          //   if(cItem) {
          //     // 取出它的title
          //     title = cItem.title
          //   }
          }else{
            console.log(item.key)
            console.log(path)
            console.log(titles)
          }
      })
    }
    useEffect(()=>{
      getTitle()
    },[props.location.pathname])
   

    // console.log(baseImgPath + user.avatar)
    console.log(user)
    const text = <span>{user.user_name}</span>;
    return (
        <div className='header_container'>
           <Breadcrumb>
           {titles.map(item=>(
                <Breadcrumb.Item>
                {item}
                 </Breadcrumb.Item>
           ))}
  </Breadcrumb>
            <div>
                <Tooltip placement="bottom" title={text}>
                    {/* <Avatar className="avator" size="large" src="baseImgPath + user.avatar" /> */}
                    <Avatar src={baseImgPath + user.avatar}  className="avator" size="large" />
                </Tooltip>
                        
                 <Button type="text" onClick={logout} danger>
                    退出
                 </Button>

            </div>



        </div>
    )
}
const mapDispatchToProps =(dispatch)=>{
  return{
    logoutAction:()=>{
            let action={
              type:'logout',
            }
            dispatch(action)
    }
  }
}
export default connect(
  state =>({
user:state
  }),mapDispatchToProps
)(withRouter(HeadTop))