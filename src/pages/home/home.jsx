import React, { useState, useEffect, useMemo } from 'react';
import "./home.less";
import TedEncy from "../../components/tendency/tedEncy";
import dtime from "time-formater";
import {
    userCount,
    orderCount,
    getUserCount,
    getOrderCount,
    adminDayCount,
    adminCount
} from "../../api/getData"
const Home = () => {
    const [_userCount, setUserCount] = useState(null);
    const [_orderCount, setOrderCount] = useState(null);
    const [_adminCount, setAdminCount] = useState(null);
    const [allUserCount, setAllUserCount] = useState(null);
    const [_allOrderCount, setAllOrderCount] = useState(Number);
    const [allAdminCount, setAllAdminCount] = useState(null);
    const [sevenDay, setSevenDay] = useState([]);
    const [sevenDate, setSevenDate] = useState([[], [], []]);
    const iniData = async () => {
        const today = dtime().format("YYYY-MM-DD");
        Promise.all([
            userCount(today),
            orderCount(today),
            adminDayCount(today),
            getUserCount(),
            getOrderCount,
            adminCount()
        ]).then(res => {
            console.log(res)
            setUserCount(res[0].count);
            setOrderCount(res[1].count);
            setAdminCount(res[2].count);
            setAllUserCount(res[3].count);
            setAllOrderCount(res[4].count);
            setAllAdminCount(res[5].count);
        }).catch((err) => {
            console.log(err);
        });
    },
    getSevenDate = async ()=> {
        console.log(sevenDay)
        const apiArr = [[], [], []];
        sevenDay.forEach(item => {
            apiArr[0].push(userCount(item))
            apiArr[1].push(orderCount(item))
            apiArr[2].push(adminDayCount(item))
        })
        const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
        console.log(...apiArr[0])
        console.log(apiArr)
    			Promise.all(promiseArr).then(res => {
    				const resArr = [[],[],[]];
					res.forEach((item, index) => {
						if (item.status == 1) {
							resArr[Math.floor(index/7)].push(item.count)
						}
					})
					setSevenDate(resArr);
    			}).catch(err => {
    				console.log(err)
    			})
    };
    useEffect(() => {
        iniData();
        for (let i = 6; i > -1; i--) {
            const date = dtime(new Date().getTime() - 86400000*i).format('YYYY-MM-DD')
            sevenDay.push(date)
        }
        setSevenDay(sevenDay);
        getSevenDate();
    },[])
    return (
        <div className="home">
            <TedEncy sevenDate={sevenDate} sevenDay={sevenDay} />
        </div>
    );

};
export default Home