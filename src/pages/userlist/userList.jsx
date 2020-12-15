import React, { useState, useEffect } from 'react';
import { getUserList, getUserCount } from '../../api/getData';
import './userList.less'
import { Table, Tag, Space } from 'antd';
function UserList() {
  let [tableData, settableData] = useState([])
  let [offset, setOffset] = useState(0)
  const [limit,setLimit]=useState(20)
  // 总用户数量
  let [count, setcount] = useState(0)
  let [currentPage,setCurrentPage]=useState(1)
  const columns = [
    {
      title: '#',
      width: 220,
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: '注册日期',
      width: 220,
      dataIndex: 'registe_time',
      key: 'registe_time',
    },
    {
      title: '用户姓名',
      width: 300,
      dataIndex: 'username',
      key: 'username',
      ellipsis:true
    },


    {
      title: '注册地址',
      dataIndex: 'city',
      key: 'city',
    },
  ];
  //   异步获取用户数量
  const initData=async()=>{
          const countData = await getUserCount();
          console.log(countData)
          if (countData.status == 1) {
             count = countData.count;
             setcount(count)
             getUsers();
          }
  }

const handlePageChange=(val,pageSize)=>{
  console.log(pageSize)
currentPage=val;
offset=(val-1)*limit;
setCurrentPage(currentPage)
setOffset(offset)
getUsers()

}
  //异步获取用户列表
  const getUsers = async () => {
    const Users = await getUserList({offset:offset,limit:limit});
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
    initData()
    // userDate()
    console.log(tableData)
  }, [])
  return (
    <div>
      <Table
        bordered
        rowKey='id'
        size='small'
        // 分页每页20个
        pagination={{total:count,defaultCurrent:1,pageSize:20,showSizeChanger:false, onChange:handlePageChange,current:currentPage}}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  )
}
export default UserList