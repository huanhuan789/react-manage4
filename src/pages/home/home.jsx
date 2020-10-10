import React, { useState,useEffect } from 'react';

import './home.less';
import TedEncy from '../../components/tendency/tedEncy' 
import dtime from 'time-formater'
import {userCount, orderCount, getUserCount, getOrderCount, adminDayCount, adminCount} from '../../api/getData'
// 首页路由组件
function Home(){
    const [userCount,setuserCount]=useState(null);
    const [orderCount,setorderCount]=useState(null);
    const [adminCount,setadminCount]=useState(null);
    const [ allUserCount,setallUserCount]=useState(null);
    const [allOrderCount,setallOrderCount]=useState(null);
    const [allAdminCount,setallAdminCount]=useState(null);
    const [sevenDay,setsevenDay]=useState([]);
    const [sevenDate,setsevenDate]=useState([[],[],[]]);
    // const [state,setState]=useState({})
    useEffect(() => {
        initData()
        for (let i = 6; i > -1; i--) {
            const date = dtime(new Date().getTime() - 86400000*i).format('YYYY-MM-DD')
           sevenDay.push(date)
        }
        getSevenData();
    
      }, [])
    const initData=async()=>{
        const today = dtime().format('YYYY-MM-DD')
        Promise.all([userCount(today), orderCount(today), adminDayCount(today), getUserCount(), getOrderCount(), adminCount()])
        .then(res => {
           userCount = res[0].count;
            orderCount = res[1].count;
            adminCount = res[2].count;
            allUserCount = res[3].count;
          allOrderCount = res[4].count;
          allAdminCount = res[5].count;
        }).catch(err => {
            console.log(err)
        })
    },
    getSevenData=async()=>{
        const apiArr = [[],[],[]];
        sevenDay.forEach(item => {
            apiArr[0].push(userCount(item))
            apiArr[1].push(orderCount(item))
            apiArr[2].push(adminDayCount(item))
        })
        const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
        Promise.all(promiseArr).then(res => {
            const resArr = [[],[],[]];
            res.forEach((item, index) => {
                if (item.status == 1) {
                    resArr[Math.floor(index/7)].push(item.count)
                }
            })
            this.sevenDate = resArr;
        }).catch(err => {
            console.log(err)
        })
    }
    return(
        <div className='home'>
            <TedEncy sevenDate={sevenDate}  sevenDay={sevenDay}/>
        </div>
    )
}
export default Home