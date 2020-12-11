import {getStore} from '../config/mUtils'
//仓库里的数据
// let initUser
// if(getStore('user')){
//   initUser=JSON.parse(getStore('user'))
// }else{
//   initUser={
//     user:{
//       avatar:'default.jpg'
//     }
//   }
// }
const initUser=JSON.parse(getStore('user'))
console.log(initUser)
//管理状态数据 根据老的的state和action，产生新的state的纯函数
export default (state=initUser,action)=>{
  switch (action.type) {
    case 'adminInfo':
      return action.user
    case 'erro':
      return {errorMsg:action.errorMsg}
      //更改用户信息
      case 'userAvatar':
        return action.userAvatar
        //退出
        case 'logout':
        return {}
    default:
      return state
  }
}