import {getStore} from '../config/mUtils'
//仓库里的数据
const initUser=JSON.parse(getStore('user'))
console.log(initUser)
//管理状态数据 根据老的的state和action，产生新的state的纯函数
export default (state=initUser,action)=>{
  switch (action.type) {
    case 'adminInfo':
      return action.user
    case 'erro':
      return {errorMsg:action.errorMsg}
      case 'userAvatar':
        return action.userAvatar
    default:
      return state
  }
}