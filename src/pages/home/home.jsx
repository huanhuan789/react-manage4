import React, { useState, useEffect, useMemo } from 'react';
import "./home.less";
import TedEncy from "../../components/tendency/tedEncy";
import dtime from "time-formater";
import { Row, Col, Divider } from 'antd';
import {
    userCount,
    orderCount,
    getUserCount,
    getOrderCount,
    adminDayCount,
    adminCount
} from "../../api/getData"
function Home () {
    const [_userCount, setUserCount] = useState(null);
    const [_orderCount, setOrderCount] = useState(null);
    const [_adminCount, setAdminCount] = useState(null);
    const [_allUserCount, setAllUserCount] = useState(null);
    const [_allOrderCount, setAllOrderCount] = useState(null);
    const [_allAdminCount, setAllAdminCount] = useState(null);
    const [sevenDay, setSevenDay] = useState([]);
    const [sevenDate, setSevenDate] = useState([[], [], []]);
    const iniData = async () => {
        const today = dtime().format("YYYY-MM-DD");
        Promise.all([
            userCount(today),
            orderCount(today),
            adminDayCount(today),
            getUserCount(),
            getOrderCount(),
            adminCount()
        ]).then(res => {
            // console.log(res)
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
        getSevenDate = async () => {
            // console.log(sevenDay)
            // console.log(userCount)
            // console.log(userCount)
            const apiArr = [[], [], []];
            sevenDay.forEach(item => {
                apiArr[0].push(userCount(item))
                apiArr[1].push(orderCount(item))
                apiArr[2].push(adminDayCount(item))
            })
            const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
            // console.log(...apiArr[0])
            // console.log(apiArr)
            Promise.all(promiseArr).then(res => {
                const resArr = [[], [], []];
                res.forEach((item, index) => {
                    if (item.status == 1) {
                        resArr[Math.floor(index / 7)].push(item.count)
                    }
                })
                setSevenDate(resArr);
            }).catch(err => {
                console.log(err)
            })
        };
    useEffect(() => {
        iniData();
        console.log(_userCount)
        for (let i = 6; i > -1; i--) {
            const date = dtime(new Date().getTime() - 86400000 * i).format('YYYY-MM-DD')
            sevenDay.push(date)
        }
        setSevenDay(sevenDay);
        getSevenDate();
        // console.log(_userCount);
        console.log(sevenDate)
        console.log(sevenDay)
    },[])
    return (
        <div className="home">
            <section className="data_section">
                <header className="section_title">数据统计</header>
                <Row gutter={20} style={{ marginBottom: '10px' }} >
                    <Col span={4}>
                        <div className="data_list today_head"><span className="data_num head">当日数据：</span></div>
                    </Col>
                    <Col  span={4}>
                        <div className="data_list"><span className="data_num">{[_userCount]}</span> 新增用户</div>
                    </Col>
                    <Col  span={4}>
                        <div className="data_list"><span className="data_num">{[_orderCount]}</span> 新增订单</div>
                    </Col>
                    <Col span={4}>
                        <div className="data_list"><span className="data_num">{[_adminCount]}</span> 新增管理员</div>
                    </Col>
                </Row>
                <Row gutter={20} >
                    <Col  span={4}>
                        <div className="data_list all_head"><span className="data_num head">总数据：</span></div>
                    </Col>
                    <Col  span={4}>
                        <div className="data_list"><span className="data_num">{[_allUserCount]}</span>注册用户</div>
                    </Col>
                    <Col span={4}>
                        <div className="data_list"><span className="data_num">{[_allOrderCount]}</span> 订单</div>
                    </Col>
                    <Col span={4}>
                        <div className="data_list"><span className="data_num">{[_allAdminCount]}</span> 管理员</div>
                    </Col>
                </Row>
            </section>
            <TedEncy sevenDate={sevenDate} sevenDay={sevenDay} />
        </div>
    );

};
export default Home