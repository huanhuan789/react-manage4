import { title } from "echarts/lib/theme/dark"

const menuList = [
    {
      title: ['首页'], // 菜单标题名称
      key: '/home', // 对应的path
      isPublic: true // 公开的
    },
        {
          title:['数据管理', '用户列表'],
          key: '/UserList'
        },
        {
          title: ['数据管理', '商家列表'],
          key: '/shoplist'
        },
        {
          title: ['数据管理', '食品列表'],
          key: '/foodlist'
        },
        {
          title: ['数据管理', '订单列表'],
          key: '/oderlist'
        },
        {
          title: ['数据管理', '管理员列表'],
          key: '/adminlist'
        },
 
        {
            title: ['添加数据', '添加商铺'],
            key: '/addshop'
          },
          {
            title: ['添加数据', '添加商品'],
            key: '/addgoods'
          },
  

      {
        title:['图表', '用户分布'],
        key:'/visitor'
      } ,
      {
        title: ['编辑', '文本编辑'],
        key:'/ediet'
      }  ,
  
    {
        title:['设置', '管理员设置'],
        key:'/adminset'
    
    },
  ]
  
  export default menuList