import React, { useState, useEffect } from 'react';
import { Form, Input, Cascader, Table, Select, Tag, Space, Button, Modal, Popconfirm } from 'antd';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './shopList.less'
import { cityGuess, getResturants, getResturantsCount, foodCategory, updateResturant, searchplace, deleteResturant } from '../../api/getData'

const { Option } = Select;
// 上传图片
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
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
      align: 'center',

      render: (txt, record, index) => {
        return (
          <div>
            <Button size="small" onClick={() => handleEdit(tableData)} >编辑</Button>
            {/* <Button onClick={()=>handleEdit()}>编辑</Button> */}
            <Button style={{ margin: "0 1rem" }} size="small" onClick={() => addGoods(tableData)}>添加食品</Button>
            <Popconfirm title="确定删除此项？"
              onCancel={() => console.log('用户点击取消')}
              onConfirm={() => handleDelete(tableData)}>
              <Button type="danger" size="small">
                删除
            </Button>
            </Popconfirm>

          </div>

        );
      }
    },
  ];
  let [tableData, settableData] = useState([])//一级分类列表
  const [city, setCity] = useState({})
  let [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
  let [count, setcount] = useState(0)
  let [currentPage, setCurrentPage] = useState(1)
  let [selectTable, setselectTable] = useState({})
  const [dialogFormVisible, setdialogFormVisible] = useState(false)
  const [categoryOptions, setcategoryOptions] = useState([])
  const [selectedCategory, setselectedCategory] = useState([])
  let [address, setaddress] = useState({})
  // 修改框是否可见
  const [visible, setvisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [url, setImgUrl] = useState('')
  //异步获取 城市信息 店铺数量--------------
  const initData = async () => {
    try {
      // city = await cityGuess();
      const countData = await getResturantsCount();
      if (countData.status == 1) {
        setcount(count)
        count = countData.count;
        console.log('商铺列表数量', count)
        setcount(count)
       
      }else{
        throw new Error('获取数据失败');
    }
    getRes();
  }catch(err){
    console.log('获取数据失败', err);
    }
  },
  // 异步获取商家列表----------------[加try catch 加const报错 ]
  getRes = async () => {
    const { latitude, longitude } = city;
    const restaurants = await getResturants({ latitude, longitude, offset: offset, limit: limit });
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
    console.log(tableData)
  }


  // 异步获取食品分类
  const getCategory = async () => {
    const categories = await foodCategory();
    console.log(categories)
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
  const handleDelete = async (tableData) => {
    const res = await deleteResturant(tableData.id);
    if (res.status == 1) {
      this.$message({
        type: 'success',
        message: '删除店铺成功'
      });
      tableData.splice(tableData.index, 1);
    }

  }
  // 异步查询 城市信息
  const querySearchAsync = async (queryString, cb) => {
    if (queryString) {
      const cityList = await searchplace(city.id, queryString);
      if (cityList instanceof Array) {
        cityList.map(item => {
          item.value = item.address;
          return item;
        })
        cb(cityList)
      }
    }
  }

  // 分页
  const handlePageChange = (val, pageSize) => {
    // 每页条数
    console.log(pageSize)
    currentPage = val;
    offset = (val - 1) * limit;
    // setCurrentPage(currentPage)
    // setOffset(offset)
    getRes()
  }
  // 点击编辑
  const handleEdit = (index, record) => {
    // selectTable = record;
    // address.address = record.address;
    // dialogFormVisible = true;
    // selectedCategory = record.category.split('/');
    setvisible(true);
    if (!categoryOptions.length) {
      getCategory();
    }
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
  const handleedietok = (e) => {
    console.log(e);
    setvisible(false);
    // selectTable = row;
    //            address.address = row.address;
    //          dialogFormVisible = true;
    //       selectedCategory = row.category.split('/');
    //             if (!categoryOptions.length) {
    //               getCategory();
    //             }
  };
  //编辑框点击取消
  const handleCancel = e => {
    console.log(e);
    setvisible(false);
  };
  // 点击添加食品
  const addGoods = (index, record) => {
    // 进入添加食品路由页面
    props.history.replace({ pathname: '/addgoods' })
  }
  //  上传图片
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false);
        setImgUrl(imageUrl);
      }
      );
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const onFinish =(val)=>{
    console.log(val)
  }
  const onFinishFailed=(errorInfo)=>{
    console.log('Failed:', errorInfo);
  }
  // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取列表
  useEffect(() => {
    initData()
    // getResturants()
    // console.log(tableData)
  }, [])
  return (
    <div>
      <Table
        rowKey='id'

        size='small'
        pagination={{ total: count, defaultCurrent: 1, pageSize: 20, showSizeChanger: false, onChange: handlePageChange, current: currentPage }}
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
        footer={null}
        // onOk={handleedietok}
        // okText='确定'
        // cancelText='取消'
        // onCancel={handleCancel}
      >
        <div>
          <Form
          onFinish={onFinish}
          onFinishFailed ={onFinishFailed }
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
          >
            <Form.Item label="店铺名称"
              rules={[{ required: true, message: '请输入店铺名称'}]}>
              <Input />
            </Form.Item>
            <Form.Item label="详细地址" placeholder="请输入地址"
              rules={[{ required: true, message: '请输入详细地址' }]}>
              <Input />
              <span>当前城市：{city.name}</span>
            </Form.Item>
            <Form.Item label="店铺介绍"
              rules={[{ required: true, message: '请输入店铺介绍' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' },
              { type: 'number', message: '电话号码必须是数字' }
              ]}>
              <Input />
            </Form.Item>

            <Form.Item label="店铺分类">
              <Cascader
                options={categoryOptions}
              />
            </Form.Item>

            <Form.Item label="店铺头像"  >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {url ? <img src={url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item className="dialog-footer" >
          
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" onClick={handleedietok }>确定</Button>
          
           
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>

  )

}
export default ShopList