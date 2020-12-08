import React from 'react';
import './addShop.less'
import { useState } from 'react';
import { cityGuess, addShop, searchplace, foodCategory } from '../../api/getData'
import { baseUrl, baseImgPath } from '../../config/env'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Table,
  Popconfirm
} from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
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
function AddShop() {
  const columns = [
    {
      title: '活动标题',
      dataIndex: 'ico_name',
      key: 'ico_name',
      align: 'center',

    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '活动详情',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },

    {
      title: '操作',
      width: 120,
      key: 'action',
      align: 'center',

      render: (txt, record, index) => {
        return (
          <div>

            <Popconfirm title="确定删除此项？"
              onCancel={() => console.log('用户点击取消')}
              onConfirm={() =>{
                console.log('删除')
              }}>
              <Button type="danger" size="small" >
                删除
            </Button>
            </Popconfirm>

          </div>

        );
      }
    },
  ];
  let [city, setCity] = useState({ name: '南京' })
  const [loading, setLoading] = useState(false)
  const [url, setImgUrl] = useState('')
  const [options, setOptions] = useState([{
    value: '满减优惠',
    label: '满减优惠'
  }, {
    value: '优惠大酬宾',
    label: '优惠大酬宾'
  }, {
    value: '新用户立减',
    label: '新用户立减'
  }, {
    value: '进店领券',
    label: '进店领券'
  }])
  const [formData, setFormData] = useState(
    {
      name: '', //店铺名称
      address: '', //地址
      latitude: '',
      longitude: '',
      description: '', //介绍
      phone: '',
      promotion_info: '',
      float_delivery_fee: 5, //运费
      float_minimum_order_amount: 20, //起价
      is_premium: true,
      delivery_mode: true,
      new: true,
      bao: true,
      zhun: true,
      piao: true,
      startTime: '',
      endTime: '',
      image_path: '',
      business_license_image: '',
      catering_service_license_image: '',

    }
  )
  const [activityValue, setActivityValue] = useState('满减优惠')
  const [activities, setActivities] = useState([{
    icon_name: '减',
    name: '满减优惠',
    description: '满30减5，满60减8',
  }])
  // const [baseUrl, setBaseUrl] = useState('')
  // const [baseImgPath, setBaseImgPath] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(['快餐便当', '简餐'])
  const [form] = Form.useForm();
  const onChange = () => {

  }
  //食品分类
  const initData = async () => {
    // const  citymessa = await cityGuess();
    // console.log(citymessa)

    const categories = await foodCategory();
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
        setCategoryOptions(categoryOptions)
        console.log(categoryOptions)
      }
    })


  }
  //  上传图片
  const handleShopAvatarScucess =(info)=> {
    console.log(info)
    if (info.file.status === 'uploading') {
        console.log(info)
        return;
    }
    if (info.file.status === 'done') {
            console.log(info)
            formData.image_path =info.file.response.image_path ;
     
    }else{
      message.error('上传图片失败！')
    }
  }
  const handleBusinessAvatarScucess =(info)=> {
    console.log(info)
    if (info.file.status === 'uploading') {
        console.log(info)
     
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
    
            
           
            console.log(info)
            formData.business_license_image = info.file.response.image_path ;

      
   
    }else{
      message.error('上传图片失败！')
    }
  }
  const handleServiceAvatarScucess =(info)=> {
    console.log(info)
    if (info.file.status === 'uploading') {
        console.log(info)
     
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
    
       
            console.log(info)
            formData.catering_service_license_image = info.file.response.image_path ;

    
    }else{
      message.error('上传图片失败！')
    }
  }
  const uploadButton = (
    <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传</div>
    </div>
);
 
  const format = 'HH:mm';
  // 优惠活动 弹出函数
  const selectActivity = async () => {

  };
  // 删除按钮
  const handleDelete = async () => {

  };
  // // 提交表单函数
  // const submitForm = () => {

  // }
  const onFinish = async (values) => {
    if (values) {
      console.log('Received values of form: ', values);
      Object.assign(formData, { activities }, {
        category: selectedCategory.join('/')
      })
      let result = await addShop(formData);
      console.log(result)
      if (result.status == 1) {
        message.success('添加成功');
        formData = {
          name: '', //店铺名称
          address: '', //地址
          latitude: '',
          longitude: '',
          description: '', //介绍
          phone: '',
          promotion_info: '',
          float_delivery_fee: 5, //运费
          float_minimum_order_amount: 20, //起价
          is_premium: true,
          delivery_mode: true,
          new: true,
          bao: true,
          zhun: true,
          piao: true,
          startTime: '',
          endTime: '',
          image_path: '',
          business_license_image: '',
          catering_service_license_image: '',
        };
        selectedCategory = ['快餐便当', '简餐'];
        activities = [{
          icon_name: '减',
          name: '满减优惠',
          description: '满30减5，满60减8',
        }];
      } else {
        message.error(result.message);
        console.log(result.message)
      }
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    message.error('请检查输入是否正确');
  };
  useEffect(() => {
    // setSelectedCategory(selectedCategory)
    initData();
    console.log(categoryOptions)
  }, [])

  return (
    <div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}

        form={form}
        name="control-hooks"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="店铺名称" name="name"
          rules={[{ required: true, message: '请输入店铺名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="详细地址" name="address" placeholder="请输入地址"
          rules={[{ required: true, message: '请输入详细地址' }]}>
          <Input />
        </Form.Item>
        <div style={{ marginLeft: '250px' }}>当前城市：{city.name}</div>
        {/* transform将字段值转换成目标值后进行校验 */}
        <Form.Item label="联系电话" name="phone"
          rules={[{ required: true, message: '请输入联系电话' },
          {
            type: 'number', message: '电话号码必须是数字',
            transform(value) {
              if (value) {
                return Number(value);//将输入框当中的字符串转换成数字类型

              }
            }
          },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="店铺简介" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="店铺标语" name="promotion_info" >
          <Input />
        </Form.Item>
        <Form.Item label="店铺分类" name="category" >
          <Cascader
            defaultValue={selectedCategory}
            options={categoryOptions}
          />
        </Form.Item>
        <Form.Item label="店铺特点" >
          <span>品牌保证</span>
          <Switch />
          <span>蜂鸟专送</span>
          <Switch />
          <span>新开店铺</span>
          <Switch />

        </Form.Item>
        <Form.Item style={{ marginLeft: '300px' }}>
          <span>外卖保</span>
          <Switch />
          <span>准时达</span>
          <Switch />
          <span>开发票</span>
          <Switch />
        </Form.Item>
        <Form.Item label="配送费" name="float_delivery_fee">
          <InputNumber min={0} max={20} defaultValue={5} onChange={onChange} />
        </Form.Item>
        <Form.Item label="起送价" name="float_minimum_order_amount">
          <InputNumber min={0} max={100} defaultValue={20} onChange={onChange} />
        </Form.Item>
        <Form.Item label="营业时间" name="Time">
          <TimePicker placeholder="起始时间"
            format={format} />
          <TimePicker placeholder="结束时间"
            format={format} />
        </Form.Item>
        <Form.Item label="上传店铺头像"  >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + '/v1/addimg/shop'}
            beforeUpload={beforeUpload}
            onChange={info=>handleShopAvatarScucess(info)}
          >
            {formData.image_path ? <img src={baseImgPath + formData.image_path} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="上传营业执照"  >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + '/v1/addimg/shop'}
            beforeUpload={beforeUpload}
            onChange={info=>handleBusinessAvatarScucess(info)}
          >
            {formData.business_license_image ? <img src={baseImgPath + formData.business_license_image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="上传餐饮服务许可证"  >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + '/v1/addimg/shop'}
            beforeUpload={beforeUpload}
            onChange={info=>handleServiceAvatarScucess(info)}
          >
            {formData.catering_service_license_image ? <img src={baseImgPath + formData.catering_service_license_image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="优惠活动"  >
          <Select defaultValue={activityValue} style={{ width: 120 }} onChange={selectActivity} placeholder='activityValue'>
            {options.map(item => (
              <Option key={item.value}>{item.value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Table
          bordered
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
          dataSource={activities}
          pagination={false}
        />
        <Form.Item className="button_submit" >
          <Button type="primary" htmlType="submit" >立即创建</Button>
        </Form.Item>
      </Form>

    </div>
  )
}
export default AddShop