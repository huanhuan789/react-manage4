//包含n个用于action的工厂函数
import {getAdminInfo } from '../api/getData'
import { setStore } from '../config/mUtils'
//同步action
export const receiveUser=(user)=>({type:'adminInfo',user})
export const showError=(erroMsg)=>({type:'erro',erroMsg})
// 
// export const userAvatar=(avatarState)=>({type:'avatar',avatarState})

//异步获取用户信息
export const getAdminData=()=>{
  return async dispatch =>{
    // 发异步请求
    const  res = await getAdminInfo()
    console.log(res.data)
    //发成功同步action
    if (res.status == 1) {
      const user =res.data
      console.log(user)
      setStore('user', user)
      dispatch(receiveUser(user))
  }else{
    //发失败同步action
    const erroMsg=res.type
    dispatch(showError(erroMsg))
  }
}
}

