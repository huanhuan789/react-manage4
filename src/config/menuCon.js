import { title } from "echarts/lib/theme/dark"

const menuList = [
    {
      title: '首页', // 菜单标题名称
      key: '/home', // 对应的path
      isPublic: true // 公开的
    },
    {
      title: '数据管理',
      key: 'sub1',
      children: [ // 子菜单列表
        {
          title: '用户列表',
          key: '/UserList'
        },
        {
          title: '商家列表',
          key: '/shoplist'
        },
        {
          title: '食品列表',
          key: '/foodlist'
        },
        {
          title: '订单列表',
          key: '/oderlist'
        },
        {
          title: '管理员列表',
          key: '/adminlist'
        }
      ]
    },
  
    {
      title: '添加数据',
      key: 'sub2',
      children:[
        {
            title: '添加商铺',
            key: '/addshop'
          },
          {
            title: '添加商品',
            key: '/addgoods'
          },
      ]
    },
    {
      title: '图表',
      key: '/sub3',
      children:[{
        title:'用户分布',
        key:'/visitor'
      }  
      ]
    },
    {
      title: '编辑',
      key: 'sub4',
      children:[{
        title:'文本编辑',
        key:'/ediet'
      }  
      ]
    },
    {
      title: '设置',
      key: 'sub5',
      children:[{
        title:'管理员设置',
        key:'/adminset'
      }  
      ]
    },
  ]
  
  export default menuList