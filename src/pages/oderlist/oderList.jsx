import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import {getOrderList, getOrderCount, getResturantDetail, getUserInfo, getAddressById} from '../../api/getData';
function OderList(){
    const columns = [
        {
          title: '订单 ID',
          dataIndex: 'id',
          key: 'id',
          render: text => <a>{text}</a>,
        },
        {
          title: '总价格',
          width: 300,
          dataIndex: 'total_amount',
          key: 'total_amount',
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          key: 'status',
        },
      
      ];
      let [tableData, settableData] = useState([])
      let [count,setcount]=useState(0)
      const [restaurant_id, setrestaurant_id] = useState(null)
      const [ expendRow,setexpendRow]=useState([])
    //   异步获取订单数量
      const initData=async()=>{
        const countData = await getOrderCount();
        console.log(countData)
        if (countData.status == 1) {
           count = countData.count;
           getOrders();
        }
}
 //异步获取用户列表
 const getOrders= async()=>{
    const Orders = await getOrderList();
    const tableData = Orders ;
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
// 获取status
const expand= async(tableData, status)=>{
    if (status) {
        const restaurant = await getResturantDetail(tableData.restaurant_id);
        const userInfo = await getUserInfo(tableData.user_id);
        const addressInfo = await getAddressById(tableData.address_id);

      tableData.splice(tableData.index, 1, {...tableData, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, address: addressInfo.address, user_name: userInfo.username}});
   
       expendRow.push(tableData.index);
       setexpendRow(expendRow)
    }else{
        const index = expendRow.indexOf(tableData.index);
       expendRow.splice(index, 1)
    }
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
  initData()
  console.log(tableData)
}, [])
    return(
        <div>
        <Table
      rowKey='id'
      // onRow={(record,index)=>{
      // return{
      //   onClick:event=>{
      
      //   }
      // }
      // }}
      size='small'
      // 分页每页20个
      // pagination={{ defaultPageSize: 20 }}
      columns={columns}
      // key={index}
      expandable={{
        expandedRowRender: record => <div> <p style={{ margin: 0 }}>用户名 {record.user_name}</p>
          <p style={{ margin: 0 }}>店铺名称 {record.restaurant_name}</p>
          <p style={{ margin: 0 }}>收货地址 {record.address}</p>
          <p style={{ margin: 0 }}>店铺 ID {record.restaurant_id}</p>
          <p style={{ margin: 0 }}>店铺地址 {record.restaurant_address}</p>
        </div>,
        //是否允许展开 名字不为Not Expandable可展开
        rowExpandable: record => record.name !== 'Not Expandable',
      }}
      dataSource={tableData}
    />
        </div>
    )
}
export default OderList