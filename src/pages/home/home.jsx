/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import "./home.less";
import TedEncy from "../../components/tendency/tedEncy";
import dtime from "time-formater";
import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount,
} from "../../api/getData";
import { useMemo } from "react";

function useCallbackState(od) {
  const [data, setData] = useState(od);
  const [init, setInit] = useState(false);
  const [cb, setCb] = useState(null);
  useEffect(() => {
    if (init) {
      if (cb) {
        if (typeof cb === "function") {
          cb();
        } else {
          console.warn("Callback is not function");
        }
      }
    }
  }, [data, init, cb]);

  return [
    data,
    function (d, callback) {
      setData(d);
      setCb(callback);
      if (!init) {
        setInit(true);
      }
    },
  ];
}
// 首页路由组件
const Home = () => {
  const [_userCount, setUserCount] = useState(Number);
  const [_orderCount, setOrderCount] = useState(Number);
  const [_adminCount, setAdminCount] = useState(Number);
  const [_allUserCount, setAllUserCount] = useState(Number);
  const [_allOrderCount, setAllOrderCount] = useState(Number);
  const [_allAdminCount, setAllAdminCount] = useState(Number);
  const [sevenDay, setSevenDay] = useCallbackState([]);
  const [sevenDate, setSevenDate] = useState([[], [], []]);
  const initData = async () => {
      const today = dtime().format("YYYY-MM-DD");
      Promise.all([
        userCount(today),
        orderCount(today),
        adminDayCount(today),
        getUserCount(),
        getOrderCount(),
        adminCount(),
      ])
        .then((res) => {
          console.log(res);
          setUserCount(res[0].count);
          setOrderCount(res[1].count);
          setAdminCount(res[2].count);
          setAllUserCount(res[3].count);
          setAllOrderCount(res[4].count);
          setAllAdminCount(res[5].count);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSevenData = async () => {
        console.log(sevenDay)
        const apiArr = [[], [], []];
        sevenDay.forEach((item) => {
          apiArr[0].push(userCount(item));
          apiArr[1].push(orderCount(item));
          apiArr[2].push(adminDayCount(item));
        });
        const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]];
        Promise.all(promiseArr)
          .then((res) => {
            const resArr = [[], [], []];
            res.forEach((item, index) => {
              if (item.status === 1) {
                resArr[Math.floor(index / 7)].push(item.count);
              }
            });
            setSevenDate(resArr);
          })
          .catch((err) => {
            console.log(err);
          });
    };

  useEffect(() => {
    initData();
    const newArr = [];
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      newArr.push(date);
    }
    setSevenDay(newArr);
  },[]);
  useMemo(()=>{
    getSevenData();
  },[sevenDay])

  return (
    <div className="home">
      <TedEncy sevenDate={sevenDate} sevenDay={sevenDay} />
    </div>
  );
};
export default Home;
