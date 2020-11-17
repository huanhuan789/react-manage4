import React, { useState, useEffect } from 'react'
import VisitorPie from '../../components/visitorpie/visitorPie';
import { getUserCity } from '../../api/getData'
import "./visitor.less"
function  Visitor() {
    let [pieData, setPieData] = useState({})
    const iniData = async () => {
        try {
           let res = await getUserCity();
            console.log(res.user_city)
            console.log(res.status)
            if (res.status == 1) {
                pieData = res.user_city
                console.log(pieData)
                setPieData(pieData); 
                
            } else {
                throw new Error(res)
            }
        } catch (err) {
            console.log('获取用户信息失败', err)
        }
    }
    useEffect(() => {
        iniData();
        // setPieData(pieData);  
console.log(pieData)
    },[])
    return (
        <div>
            <VisitorPie pieData={pieData}></VisitorPie>
        </div>
    )
}
export default Visitor