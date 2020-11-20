import React, { useState, useEffect } from 'react';
import {getUserList,getUserCount} from '../../api/getData';
import { Table, Tag, Space } from 'antd';
function UserList(){
    let [tableData, settableData] = useState([])
    const [offset, setOffset] = useState(0)
    let [count,setcount]=useState(0)
    const columns = [
        {
          title: '#',
          render:(text, record,index)=>`${index+1}`
        },
        {
            title: '注册日期',
            width: 220,
            dataIndex: 'registe_time',
            key: 'registe_time',
          },
        {
          title: '用户姓名',
          width: 220,
          dataIndex: 'username',
          key: 'username',
        },

      
        {
            title: '注册地址',
            dataIndex: 'city',
            key: 'city',
        },
      ];
    //   异步获取用户数量
    // const initData=async()=>{
    //         const countData = await getUserCount();
    //         console.log(countData)
    //         if (countData.status == 1) {
    //            count = countData.count;
    //            userDate();
    //         }
    // }
      //异步获取用户列表
      const userDate= async()=>{
         const Users= await getUserList();
           tableData = Users;
        //   tableData = [];
        //   Users.forEach(item => {
        //    let tableData = [];
        //     tableData.username = item.username;
        //     tableData.registe_time = item.registe_time;
        //     tableData.city = item.city;
        //    tableData.push(tableData);
        //    console.log(tableData)
        //    settableData(tableData);
        // })
        console.log(tableData)
        settableData(tableData);
      }
      useEffect(() => {
        // initData()
        userDate()
        console.log(tableData)
      }, [])
    return  (
        <div>
            <Table
      rowKey='id'
      size='small'
      // 分页每页20个
      pagination={{ defaultPageSize: 20 }}
      columns={columns}
      dataSource={tableData}
    />
        </div>
    )
}
export default UserList