import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import {getOrderList, getOrderCount, getResturantDetail, getUserInfo, getAddressById} from '../../api/getData';
function OderList(props){
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
      let [restaurant_id, setrestaurant_id] = useState(null)
      const [ expendRow,setexpendRow]=useState([])
      let [offset, setOffset] = useState(0);
      // 每页限制数据条数
      const [limit, setLimit] = useState(20);
    //   异步获取订单数量
      const initData=async()=>{
        const countData = await getOrderCount({restaurant_id: restaurant_id});
        console.log(countData)
        if (countData.status == 1) {
           count = countData.count;
           setcount(count);
           getOrders();
        }
}
 //异步获取用户列表
 const getOrders= async()=>{
    const Orders = await getOrderList( {offset: offset,
      limit: limit,restaurant_id: restaurant_id} );
    tableData = [] ;
    Orders.forEach((item, index) => {
      const tableDatavalue = {};
      tableDatavalue.id = item.id;
      tableDatavalue.total_amount = item.total_amount;
      tableDatavalue.status = item.status_bar.title;
      tableDatavalue.user_id = item.user_id;
      tableDatavalue.restaurant_id = item.restaurant_id;
      tableDatavalue.address_id = item.address_id;
      tableDatavalue.index = index;
      tableData.push(tableDatavalue);
      
  })
  settableData(tableData);
  console.log(tableData);
}
// 获取status
const expand= async(expanded,record)=>{
    if (expanded) {
  
        const restaurant = await getResturantDetail(record.restaurant_id);
        const userInfo = await getUserInfo(record.user_id);
        const addressInfo = await getAddressById(record.address_id);
        const tableDatavalue = [...tableData];
        tableDatavalue.splice(record.index, 1, {...record, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, address: addressInfo.address, user_name: userInfo.username}});
   
       expendRow.push(record.index);
       setexpendRow(expendRow)
      //  console.log(tableData)
       settableData(tableDatavalue);
    }else{
        const index = expendRow.indexOf(record.index);
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
 
}
// 分页
const handlePageChange = (val, pageSize) => {
  // 每页条数
  console.log(pageSize);

  offset = (val - 1) * limit;
  // setCurrentPage(currentPage)
  // setOffset(offset)
  getOrders();
};

useEffect(() => {
  restaurant_id = props.match.params.restaurant_id;
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
      onExpand={expand}
      size='small'
      // 分页每页20个
       // 分页每页20个
       pagination={{
        total: count,
        defaultCurrent: 1,
        pageSize: 20,
        showSizeChanger: false,
        onChange: handlePageChange,
      }}
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