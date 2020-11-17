import React from 'react';
import { useState,useEffect } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import {baseUrl, baseImgPath} from '../../config/env'
import {getFoods, getFoodsCount, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '../../api/getData'
function FoodList(props) {
    const columns = [
        {
            title: '食品名称',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: '店铺介绍',
            dataIndex: 'description',
            key: 'description',
        },

        {
            title: '评分',
            dataIndex: 'rating',
            key: 'rating',
        },

        {
            title: '操作',
            width: 300,
            key: 'action',
            render: (tableData) => (
                <Space size="small" >
                    <Button onClick={() => handleEdit(tableData)}>编辑</Button>
                    {/* <Button onClick={()=>handleEdit()}>编辑</Button> */}
                    <Button onClick={() => handleDelete(tableData)} type="primary" danger>
                        删除
              </Button>
                </Space>
            ),
        },

    ];
    const [baseUrl,setBaseUrl]=useState()
    const [baseImgPath,setbaseImgPath]=useState()
    const [restaurant_id,setRestaurant]=useState(0)
    const [city,setCity]=useState({})
    let [count, setcount] = useState(0)
    let [tableData, settableData] = useState([])
    const [selectTable,setSelectable]=useState({})
    const [dialogFormVisible, setdialogFormVisible] = useState(false)
    const [menuOptions,setmenuOptions]=useState([])
    const[selectMenu,setselectMenu]=useState({})
    const [selectIndex,setselectIndex]=useState(null)
    const [spacsForm,setSpacsForm]=useState({
        specs: '',
        packing_fee: 0,
        price: 20,
    })
    const [specsFormrules,setspecsFormrules]=useState({
        specs: [
            { required: true, message: '请输入规格', trigger: 'blur' },
        ]
    })
    const [specsFormVisible,setspecsFormVisible]=useState(false)
    const [expendRow,setexpendRow]=useState([])
      // 修改框是否可见
  const [visible, setvisible] = useState(false)
//   const initData=async()=>{
//     try{
//         const countData = await getFoodsCount({restaurant_id: restaurant_id});
//         if (countData.status == 1) {
//             count = countData.count;
//             setcount(count)
//         }else{
//             throw new Error('获取数据失败');
//         }
//         getFoods();
//     }catch(err){
//         console.log('获取数据失败', err);
//     }
//   }
//   异步获取食品列表
// const getFoods=async()=>{
//     const Foods = await getFoods({restaurant_id});
//     const tableData = Foods;
// console.log(Foods)
// settableData(tableData)
// }
// 点击编辑
const handleEdit = (tableData) =>{
    getSelectItemData(tableData, 'edit')
    setvisible(true);
}
// 所点击的该行的店铺信息
const getSelectItemData= async (tableData,type)=>{
    const restaurant= await getResturantDetail(tableData.restaurant_id)
    const category = await getMenuById(tableData.category_id)
               selectTable = {...tableData, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, category_name: category.name}};
                selectMenu = {label: category.name, value: tableData.category_id}
               tableData.splice(tableData.index, 1, {...selectTable});
             
                   expendRow.push(tableData.index);
            
                if (type == 'edit' && restaurant_id != tableData.restaurant_id) {
                	getMenu();
                }
    console.log(restaurant)

}
// 编辑框点击确认 将编辑信息提交
const handleedietok = e => {
    console.log(e);
    setvisible(false);
  };
  //编辑框点击取消
  const handleCancel = e => {
    console.log(e);
    setvisible(false);
  }

  // 异步获取删除数据内容 
  const handleDelete = async (tableData) => {
    const res = await deleteFood(tableData.id);
    if (res.status == 1) {
      this.$message({
        type: 'success',
        message: '删除店铺成功'
      });
      tableData.splice(tableData.index, 1);
    }
  } 
  useEffect((props) => {
    // setRestaurant(props.restaurant_id)
    getFoods()
    console.log(props)
    // iniData();

}, [])
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
                    expandedRowRender: record =>
                        <div >
                            <p style={{ margin: 0 }}>店铺描述 {record.description}</p>
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
export default FoodList