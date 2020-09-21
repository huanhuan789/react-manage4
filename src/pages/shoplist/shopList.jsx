import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import './shopList.less'
import { cityGuess, getResturants, getResturantsCount, foodCategory, updateResturant, searchplace, deleteResturant } from '../../api/getData'



function ShopList(props) {
  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '店铺地址',
      width: 300,
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '店铺介绍',
      dataIndex: 'description',
      key: 'description',
    },
  
    {
      title: '操作',
      width: 300,
      key: 'action',
      render: (tableData) => (
        <Space size="small" >
          <Button onClick={()=>handleEdit(tableData)}>编辑</Button>
          {/* <Button onClick={()=>handleEdit()}>编辑</Button> */}
          <Button onClick={()=>addGoods(tableData)}>添加食品</Button>
          <Button onClick={()=>handleDelete(tableData)} type="primary" danger>
            删除
      </Button>
        </Space>
      ),
    },
  ];
  let [tableData, settableData] = useState([])//一级分类列表
  const [city, setCity] = useState({})
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
  const [count,setcount]=useState(0)
  let [selectTable,setselectTable]=useState({})
  const [ dialogFormVisible,setdialogFormVisible]=useState(false)
  const [categoryOptions,setcategoryOptions]=useState([])
  const [selectedCategory,setselectedCategory]=useState([])
  let [address,setaddress]=useState({})
  // 修改框是否可见
  const [visible, setvisible] = useState(false)
  // 异步获取商家列表
  const gettableData = async () => {
    const { latitude, longitude } = city;
    const restaurants = await getResturants({ latitude, longitude, offset: offset ,limit: limit});
    console.log(restaurants)
    const tableData = restaurants;
    // 加key
    // tableData=[]
    // restaurants.forEach((item,key) => {
    //   let tableDate = {};
    //   tableData.name = item.name;
    //   tableData.address = item.address;
    //   tableData.description = item.description;
    //   tableData.id = item.id;
    //   tableData.phone = item.phone;
    //   tableData.rating = item.rating;
    //   tableData.recent_order_num = item.recent_order_num;
    //   tableData.category = item.category;
    //   tableData.image_path = item.image_path;
    //   tableData.push(tableDate)
    // })
    settableData(tableData);
    // console.log(tableData)
  }
  //异步获取 城市信息 店铺数量
  const initData= async ()=>{
      // city = await cityGuess();
      const countData = await getResturantsCount();
      if (countData.status == 1) {
         count = countData.count;
      }
      getResturants();

}
  
  // 异步获取食品分类
  const getCategory = async () => {
    const categories = await foodCategory();
    console.log(categories )
    categories.forEach(item => {
      if (item.sub_categories.length) {
          const addnew = {
              value: item.name,
              label: item.name,
              children: []
          }
          item.sub_categories.forEach((subitem, index) => {
              if (index == 0) {
                  return
              }
              addnew.children.push({
                  value: subitem.name,
                  label: subitem.name,
              })
          })
         categoryOptions.push(addnew)
      }
  })
    setcategoryOptions(categoryOptions);
    // console.log(tableData)
  }
  // 异步获取删除数据内容 
  const handleDelete= async (tableData)=>{
      const res = await deleteResturant(tableData.id);
      if (res.status == 1) {
          this.$message({
              type: 'success',
              message: '删除店铺成功'
          });
          this.tableData.splicetableData(tableData.index, 1);
      }
     
  }
  // 异步查询 城市信息
  const querySearchAsync=async (queryString, cb)=>{
    if (queryString) {
          const cityList = await searchplace(this.city.id, queryString);
          if (cityList instanceof Array) {
              cityList.map(item => {
                  item.value = item.address;
                  return item;
              })
              cb(cityList)
          }
      }
  }
  // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取列表
  useEffect(() => {
    // initData()
    gettableData()
    console.log(tableData)
  }, [])
  // 点击编辑
   const handleEdit=(tableData)=> {

      setvisible(true);
      // console.log(rowkey, record)
      // selectTable =tableData;
    //  address.address= tableData.address;
    //   dialogFormVisible = true;
    // selectedCategory = tableData.category.split('/');
      // if (!categoryOptions.length) {
      //     getCategory();
      // }
  console.log(tableData)
  };
  // 编辑框点击确认 将编辑信息提交
  const handleedietok = e => {
    console.log(e);
    setvisible(false);
  };
  //编辑框点击取消
  const handleCancel = e => {
    console.log(e);
    setvisible(false);
  };
  // 点击添加食品
  const addGoods=(index,record)=>{
// 进入添加食品路由页面
props.history.replace({patnname:'/addgoods',query:{ restaurant_id: tableData.id }})
  }
  
  return (
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
        expandedRowRender: record => <div class="demo-table-expand"> <p style={{ margin: 0 }}>店铺描述 {record.description}</p>
          <p style={{ margin: 0 }}>店铺名称 {record.name}</p>
          <p style={{ margin: 0 }}>店铺地址 {record.address}</p>
          <p style={{ margin: 0 }}>ID {record.id}</p>
          <p style={{ margin: 0 }}>联系电话 {record.phone}</p>
          <p style={{ margin: 0 }}>评分 {record.rating}</p>
          <p style={{ margin: 0 }}>分类 {record.category}</p>
        </div>,
        //是否允许展开 名字不为Not Expandable可展开
        rowExpandable: record => record.name !== 'Not Expandable',
      }}
      dataSource={tableData}
    />
    <Modal
      title="修改店铺信息"
      visible={visible}
      onOk={handleedietok}
      okText='确定'
      cancelText='取消'
      onCancel={handleCancel}
    >
<div>

</div>
    </Modal>
    </div>
   
  )

}
export default ShopList