import React , { useState, useEffect } from 'react';
import {adminList, adminCount} from '../../api/getData';
import { Table, Tag, Space } from 'antd';
function AdminList(){
    let [tableData, settableData] = useState([])
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(20);
    let [count,setcount]=useState(0)
    const columns = [
        {
            title: '姓名',
            width: 180,
            dataIndex: 'user_name',
            key: 'user_name',
          },
        {
          title: '注册日期',
          width: 220,
          dataIndex: 'create_time',
          key: 'create_time',
        },

      
        {
            title: '地址',
            width: 180,
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '权限',
            width: 180,
            dataIndex: 'admin',
            key: 'admin',
        },
      ];
    //   异步获取用户数量
    const initData=async()=>{
            const countData = await adminCount();
            console.log(countData)
            if (countData.status == 1) {
               count = countData.count;
               getAdmin();
               setcount(count);
            }
    }
      //异步获取用户列表
      const getAdmin= async()=>{
        const res = await adminList();
          const tableData = res.data;
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
     // 分页
  const handlePageChange = (val, pageSize) => {
    // 每页条数
    console.log(pageSize);

    offset = (val - 1) * limit;
    // setCurrentPage(currentPage)
    // setOffset(offset)
    getAdmin();
  };
      useEffect(() => {
        initData()
        // userDate()
        // console.log(tableData)
      }, [])
    return  (
        <div>
            <Table
      rowKey='index'
      size='small'
      // 分页每页20个
      pagination={{
        total: count,
        defaultCurrent: 1,
        pageSize: 20,
        showSizeChanger: false,
        onChange: handlePageChange,
      }}
      columns={columns}
      dataSource={tableData}
    />
        </div>
    )
}
export default AdminList