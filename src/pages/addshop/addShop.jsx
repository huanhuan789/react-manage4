import React from 'react';
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
              onConfirm={() => handleDelete(record.index)}>
              <Button type="danger" size="small" >
                删除
            </Button>
            </Popconfirm>

          </div>

        );
      }
    },
  ];
  const [city, setCity] = useState({ name: '南京' })
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
  const [formDate, setFormData] = useState(
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
  const [baseUrl, setBaseUrl] = useState('')
  const [baseImaPath, setBaseImaPath] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(['快餐便当', '简餐'])
  const onChange = () => {

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
  const format = 'HH:mm';
  // 优惠活动 函数
  const selectActivity = async() =>{

  }
  // 删除按钮
  const handleDelete = async () => {

  }

  return (
    <div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
      >
        <Form.Item label="店铺名称"
          rules={[{ required: true, message: '请输入店铺名称', validatetrigger: 'onblur' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="详细地址" placeholder="请输入地址"
          rules={[{ required: true, message: '请输入详细地址', validatetrigger: 'onblur' }]}>
          <Input />
          <span>当前城市：{city.name}</span>
        </Form.Item>
        <Form.Item label="联系电话"
          rules={[{ required: true, message: '请输入联系电话', validatetrigger: 'onblur' },
          { type: 'number', message: '电话号码必须是数字' }
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="店铺简介">
          <Input />
        </Form.Item>
        <Form.Item label="店铺标语">
          <Input />
        </Form.Item>
        <Form.Item label="店铺分类">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
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
        <Form.Item style={{ marginLeft: '140px' }}>
          <span>外卖保</span>
          <Switch />
          <span>准时达</span>
          <Switch />
          <span>开发票</span>
          <Switch />
        </Form.Item>
        <Form.Item label="配送费"  >
          <InputNumber min={0} max={20} defaultValue={5} onChange={onChange} />
        </Form.Item>
        <Form.Item label="起送价"  >
          <InputNumber min={0} max={100} defaultValue={20} onChange={onChange} />
        </Form.Item>
        <Form.Item label="营业时间"  >
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
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {url ? <img src={url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="优惠活动"  >
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={selectActivity}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>
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
          dataSource={activities}
        />
      </Form>

    </div>
  )
}
export default AddShop