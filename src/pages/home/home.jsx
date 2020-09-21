import React, { useState } from 'react';
import './home.less';
import {userCount, orderCount, getUserCount, getOrderCount, adminDayCount, adminCount} from '../../api/getData'
// 首页路由组件
function Home(){
    // const [userCount,setuserCount]=useState(null);
    // const [orderCount,setorderCount]=useState(null);
    // const [adminCount,setadminCount]=useState(null);
    // const [ allUserCount,setallUserCount]=useState(null);
    // const [allOrderCount,setallOrderCount]=useState(null);
    // const [allAdminCount,setallAdminCount]=useState(null);
    // const [sevenDay,setsevenDay]=useState([]);
    // const [sevenDate,setsevenDate]=useState([[],[],[]]);
    // const [state,setState]=useState({})
    return(
        <div className='home'>
            home首页
        </div>
    )
}
export default Home