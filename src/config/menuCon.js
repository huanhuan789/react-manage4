import { title } from "echarts/lib/theme/dark"

const menuList = [
    {
      title: ['首页'], // 菜单标题名称
      key: '/manage/home', // 对应的path
      isPublic: true // 公开的
    },
        {
          title:['数据管理', '用户列表'],
          key: '/manage/UserList'
        },
        {
          title: ['数据管理', '商家列表'],
          key: '/manage/shoplist'
        },
        {
          title: ['数据管理', '食品列表'],
          key: '/manage/foodlist'
        },
        {
          title: ['数据管理', '订单列表'],
          key: '/manage/oderlist'
        },
        {
          title: ['数据管理', '管理员列表'],
          key: '/manage/adminlist'
        },
 
        {
            title: ['添加数据', '添加商铺'],
            key: '/manage/addshop'
          },
          {
            title: ['添加数据', '添加商品'],
            key: '/manage/addgoods'
          },
  

      {
        title:['图表', '用户分布'],
        key:'/manage/visitor'
      } ,
      {
        title: ['编辑', '文本编辑'],
        key:'/manage/ediet'
      }  ,
  
    {
        title:['设置', '管理员设置'],
        key:'/manage/adminset'
    
    },
  ]
  
  export default menuList