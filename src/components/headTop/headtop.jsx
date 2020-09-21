import React from 'react';
import {withRouter,Link,Redirect} from 'react-router-dom'
import './headtop.less';
import { signout } from '../../api/getData';
// import {baseImgPath} from '../../config/env';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import localUtils from '../../config/localUtils'
import { Tooltip, Modal, Button, Space } from 'antd';
import menuList from '../../config/menuCon'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
function HeadTop(props) {
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
                    localUtils.user = {}
                    message.success('退出成功')
                    console.log(props)
                      // 跳转到登录界面
                    props.history.replace('/login')
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
        let title
        menuList.forEach(item => {
          if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
            title = item.title
          } else if (item.children) {
            // 在所有子item中查找匹配的
            const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
            // 如果有值才说明有匹配的
            if(cItem) {
              // 取出它的title
              title = cItem.title
            }
          }
        })
        return title
      }
      const titleitem = getTitle()
    const user = localUtils.user
    // console.log(baseImgPath + user.avatar)
    console.log(user)
    const text = <span>{user.user_name}</span>;
    return (
        <div className='header_container'>
            <div>{titleitem}</div>
            <div>
                <Tooltip placement="bottom" title={text}>
                    {/* <Avatar className="avator" size="large" src="baseImgPath + user.avatar" /> */}
                    <Avatar className="avator" size="large" />
                </Tooltip>
                        
                 <Button type="text" onClick={logout} danger>
                    退出
                 </Button>

            </div>



        </div>
    )
}
export default withRouter(HeadTop)