import React from "react";
import "./addShop.less";
import { useState, useEffect, useRef } from "react";
import {
  cityGuess,
  addShop,
  searchplace,
  foodCategory,
} from "../../api/getData";
import { SmileOutlined, UserOutlined } from "@ant-design/icons";
import { baseUrl, baseImgPath } from "../../config/env";
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
  Modal,
  Popconfirm,
  Avatar,
  Typography,
} from "antd";
import { TimePicker } from "antd";
import moment from "moment";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const { RangePicker } = TimePicker;
// 上传图片
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
function AddShop() {
  const columns = [
    {
      title: "活动标题",
      dataIndex: "icon_name",
      key: "icon_name",
      align: "center",
    },
    {
      title: "活动名称",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "活动详情",
      dataIndex: "description",
      key: "description",
      align: "center",
    },

    {
      title: "操作",
      width: 120,
      key: "action",
      align: "center",

      render: (txt, record, index) => {
        return (
          <div>
            {/* <Popconfirm
              title="确定删除此项？"
              onCancel={() => console.log("用户点击取消")}
              onConfirm={() => {
                console.log("删除");
              }}
            > */}
            <Button
              type="danger"
              size="small"
              onClick={() => {
                let activitiesvalue = JSON.parse(JSON.stringify(activities));
                activitiesvalue.splice(index, 1);
                console.log(activitiesvalue);
                setActivities(activitiesvalue);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  let [city, setCity] = useState({ name: "南京" });
  const [loading, setLoading] = useState(false);
  const [url, setImgUrl] = useState("");
  const [options, setOptions] = useState([
    {
      value: "满减优惠",
      label: "满减优惠",
    },
    {
      value: "优惠大酬宾",
      label: "优惠大酬宾",
    },
    {
      value: "新用户立减",
      label: "新用户立减",
    },
    {
      value: "进店领券",
      label: "进店领券",
    },
  ]);
  const [formData, setFormData] = useState({
    name: "", //店铺名称
    address: "", //地址
    latitude: "",
    longitude: "",
    description: "", //介绍
    phone: "",
    promotion_info: "",
    float_delivery_fee: 5, //运费
    float_minimum_order_amount: 20, //起价
    is_premium: true,
    delivery_mode: true,
    new: true,
    bao: true,
    zhun: true,
    piao: true,
    startTime: "",
    endTime: "",
    image_path: "",
    business_license_image: "",
    catering_service_license_image: "",
  });
  const [activityValue, setActivityValue] = useState("满减优惠");
  let [activities, setActivities] = useState([
    {
      icon_name: "减",
      name: "满减优惠",
      description: "满30减5，满60减8",
    },
  ]);
  let [selectActivity, setSelectActivity] = useState("");
  // const [baseUrl, setBaseUrl] = useState('')
  // const [baseImgPath, setBaseImgPath] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([
    "快餐便当",
    "简餐",
  ]);
  const [visible, setVisible] = useState(false);
  const [formsubmitres] = Form.useForm();
  const [fromactivity] = Form.useForm();
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const onChange = () => {};
  //食品分类
  const initData = async () => {
    // const  citymessa = await cityGuess();
    // console.log(citymessa)

    const categories = await foodCategory();
    categories.forEach((item) => {
      if (item.sub_categories.length) {
        const addnew = {
          value: item.name,
          label: item.name,
          children: [],
        };
        item.sub_categories.forEach((subitem, index) => {
          if (index == 0) {
            return;
          }
          addnew.children.push({
            value: subitem.name,
            label: subitem.name,
          });
        });
        categoryOptions.push(addnew);
        setCategoryOptions(categoryOptions);
        console.log(categoryOptions);
      }
    });
  };
  //
  const addressSelect = (address) => {
    formData.latitude = address.latitude;
    formData.longitude = address.longitude;
    console.log(formData.latitude, formData.longitude);
  };
  //  上传图片
  const handleShopAvatarScucess = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      console.log(info);
      return;
    }
    if (info.file.status === "done") {
      console.log(info);
      formData.image_path = info.file.response.image_path;
    } else {
      message.error("上传图片失败！");
    }
  };
  const handleBusinessAvatarScucess = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      console.log(info);

      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      console.log(info);
      formData.business_license_image = info.file.response.image_path;
    } else {
      message.error("上传图片失败！");
    }
  };
  const handleServiceAvatarScucess = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      console.log(info);

      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.

      console.log(info);
      formData.catering_service_license_image = info.file.response.image_path;
    } else {
      message.error("上传图片失败！");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const format = "HH:mm";
  // 优惠活动 弹出函数
  const selectActivityfun = async (value) => {
    console.log(value);
    selectActivity=value
    setSelectActivity(value);
    setVisible(true);
  };
  const addActivityValue = (value) => {
    const activitiesvalue = JSON.parse(JSON.stringify(activities));
    let newObj = {};
    switch (selectActivity) {
      case "满减优惠":
        newObj = {
          icon_name: "减",
          name: "满减优惠",
          description: value.description,
        };
        break;
      case "优惠大酬宾":
        newObj = {
          icon_name: "特",
          name: "优惠大酬宾",
          description: value.description,
        };
        break;
      case "新用户立减":
        newObj = {
          icon_name: "新",
          name: "新用户立减",
          description: value.description,
        };
        break;
      case "进店领券":
        newObj = {
          icon_name: "领",
          name: "进店领券",
          description: value.description,
        };
        break;
    }
    activitiesvalue.push(newObj);
    activities = activitiesvalue;
    console.log(activitiesvalue);
    setActivities(activitiesvalue);
    setVisible(false);
    console.log(value);

    fromactivity.resetFields();
  };
  const onCancelActivity = () => {
    setVisible(false);
    fromactivity.resetFields();
  };
  // 删除按钮
  const handleDelete = async () => {};
  // // 提交表单函数
  // const submitForm = () => {

  // }
  // 提交失败
  const addActivityValuefailed = (err) => {
    console.log("活动详情提交", err);
  };
  const formsubmit = async (values) => {
    if (values) {
      console.log("Received values of form: ", values);
      formData.name = values.name;
      formData.address = values.address;

      formData.phone = values.phone;
      formData.description=values.description;
      formData.promotion_info=values.promotion_info
      console.log(formData);
      console.log(activities);
      console.log(selectedCategory);
      //Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象
      //Object.assign是深克隆，但克隆的是浅层
      Object.assign(
        formData,
        { activities },
        {
          category: selectedCategory.join("/"),
        }
      );
      let result = await addShop(formData);
      console.log(result);
      if (result.status == 1) {
        message.success("添加成功");
        // formData = {
        //   name: "", //店铺名称
        //   address: "", //地址
        //   latitude: "",
        //   longitude: "",
        //   description: "", //介绍
        //   phone: "",
        //   promotion_info: "",
        //   float_delivery_fee: 5, //运费
        //   float_minimum_order_amount: 20, //起价
        //   is_premium: true,
        //   delivery_mode: true,
        //   new: true,
        //   bao: true,
        //   zhun: true,
        //   piao: true,
        //   startTime: "",
        //   endTime: "",
        //   image_path: "",
        //   business_license_image: "",
        //   catering_service_license_image: "",
        // };
        // selectedCategory = ["快餐便当", "简餐"];
        // activities = [
        //   {
        //     icon_name: "减",
        //     name: "满减优惠",
        //     description: "满30减5，满60减8",
        //   },
        // ];
        formsubmitres.resetFields();
      } else {
        message.error(result.message);
        console.log(result.message);
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("请检查输入是否正确");
  };
  useEffect(() => {
    // setSelectedCategory(selectedCategory)
    initData();
    console.log(categoryOptions);
  }, []);

  return (
    <div>
      {/* <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          console.log(name,values,forms)
          if (name === 'addActivityForm') {
            const { basicForm } = forms;
            const users = basicForm.getFieldValue('users') || [];
            basicForm.setFieldsValue({
              users: [...users, values],
            });
            setVisible(false);
          }
        }}
      > */}
      <Form
        name="formsubmit"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        form={formsubmitres}
        name="control-hooks"
        onFinish={formsubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="店铺名称"
          name="name"
          rules={[{ required: true, message: "请输入店铺名称" }]}
        >
          <Input
            value={formData.name}
            // onChange={(e) => {
            //   formData.name = e.target.value;
            //   console.log(e.target.value);
            //   setFormData(formData)
            // }}
          />
        </Form.Item>
        <Form.Item
          label="详细地址"
          name="address"
          placeholder="请输入地址"
          rules={[{ required: true, message: "请输入详细地址" }]}
        >
          <Input value={formData.address} />
        </Form.Item>
        <div style={{ marginLeft: "250px" }}>当前城市：{city.name}</div>
        {/* transform将字段值转换成目标值后进行校验 */}
        <Form.Item
          label="联系电话"
          name="phone"
          rules={[
            { required: true, message: "请输入联系电话" },
            {
              type: "number",
              message: "电话号码必须是数字",
              transform(value) {
                if (value) {
                  return Number(value); //将输入框当中的字符串转换成数字类型
                }
              },
            },
          ]}
        >
          <Input value={formData.phone} />
        </Form.Item>
        <Form.Item label="店铺简介" name="description">
          <Input value={formData.description} />
        </Form.Item>
        <Form.Item label="店铺标语" name="promotion_info">
          <Input value={formData.promotion_info} />
        </Form.Item>
        <Form.Item label="店铺分类" name="category">
          <Cascader defaultvalue={selectedCategory} options={categoryOptions} />
        </Form.Item>

        <div style={{ marginLeft: "210px" }}>
          <span style={{ marginRight: "50px" }}>店铺特点:</span>
          <Form.Item name="is_premium" style={{ display: "inline-block" }}>
            <span>品牌保证</span>
            <Switch
              checked={formData.is_premium}
              onChange={(checked) => {
                console.log(checked);
                formData.is_premium = checked;
              }}
            />
          </Form.Item>
          <Form.Item name="delivery_mode" style={{ display: "inline-block" }}>
            <span>蜂鸟专送</span>
            <Switch
              checked={formData.delivery_mode}
              onChange={(checked) => {
                console.log(checked);
                formData.delivery_mode = checked;
              }}
            />
          </Form.Item>
          <Form.Item style={{ display: "inline-block" }} name="new">
            <span>新开店铺</span>
            <Switch
              checked={formData.new}
              onChange={(checked) => {
                console.log(checked);
                formData.new = checked;
              }}
            />
          </Form.Item>
        </div>
        <div style={{ marginLeft: "300px" }}>
          <Form.Item name="bao" style={{ display: "inline-block" }}>
            <span>外卖保</span>
            <Switch
              checked={formData.bao}
              onChange={(checked) => {
                console.log(checked);
                formData.bao = checked;
              }}
            />
          </Form.Item>
          <Form.Item style={{ display: "inline-block" }} name="zhun">
            <span>准时达</span>
            <Switch
              checked={formData.zhun}
              onChange={(checked) => {
                console.log(checked);
                formData.zhun = checked;
              }}
            />
          </Form.Item>
          <Form.Item style={{ display: "inline-block" }} name="piao">
            <span>开发票</span>
            <Switch
              checked={formData.piao}
              onChange={(checked) => {
                console.log(checked);
                formData.new = checked;
              }}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="配送费"
          name="float_delivery_fee"
          name="float_delivery_fee"
        >
          <InputNumber
            min={0}
            max={20}
            defaultValue={5}
            onChange={(value) => {
              console.log(value);
              formData.float_delivery_fee = value;
            }}
          />
        </Form.Item>
        <Form.Item
          label="起送价"
          name="float_minimum_order_amount"
          name="is_premium"
        >
          <InputNumber
            min={0}
            max={100}
            defaultValue={20}
            onChange={(value) => {
              formData.float_minimum_order_amount = value;
            }}
          />
        </Form.Item>
        <div style={{ marginLeft: "158px" }}>
          <span style={{ marginRight: "82px" }}>营业时间:</span>
          <Form.Item>
            <TimePicker
              placeholder="起始时间"
              format={format}
              name="startTime"
              onChange={(a, b) => {
                console.log(a, b);
                formData.startTime=b
              }}
            />
          </Form.Item>
          <Form.Item>
            <TimePicker placeholder="结束时间" format={format} name="endTime"
            onChange={(a,b)=>{
formData.endTime=b
            }} />
          </Form.Item>
        </div>

        <Form.Item label="上传店铺头像" name="image_path">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + "/v1/addimg/shop"}
            beforeUpload={beforeUpload}
            onChange={(info) => handleShopAvatarScucess(info)}
          >
            {formData.image_path ? (
              <img
                src={baseImgPath + formData.image_path}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="上传营业执照" name="business_license_image">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + "/v1/addimg/shop"}
            beforeUpload={beforeUpload}
            onChange={(info) => handleBusinessAvatarScucess(info)}
          >
            {formData.business_license_image ? (
              <img
                src={baseImgPath + formData.business_license_image}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="上传餐饮服务许可证"
          name="catering_service_license_image"
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={baseUrl + "/v1/addimg/shop"}
            beforeUpload={beforeUpload}
            onChange={(info) => handleServiceAvatarScucess(info)}
          >
            {formData.catering_service_license_image ? (
              <img
                src={baseImgPath + formData.catering_service_license_image}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="优惠活动" name="activities">
          <Select
            defaultValue={activityValue}
            style={{ width: 120 }}
            onChange={selectActivityfun}
            placeholder="activityValue"
          >
            {options.map((item) => (
              <Option key={item.value}>{item.value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Table
          bordered
          rowKey="id"
          // onRow={(record,index)=>{
          // return{
          //   onClick:event=>{

          //   }
          // }
          // }}
          size="small"
          // 分页每页20个
          // pagination={{ defaultPageSize: 20 }}
          columns={columns}
          // key={index}
          dataSource={activities}
          pagination={false}
        />
        <Form.Item className="button_submit">
          <Button type="primary" htmlType="submit">
            立即创建
          </Button>
        </Form.Item>
      </Form>
      {/* <ModalForm visible={visible} onCancel={hideUserModal} /> */}
      {/* </Form.Provider> */}
      <Modal
        title="提示"
        visible={visible}
        //   onOk={addspecs}
        //   cancelText="取消"
        //   okText="确认"
        footer={null}
        onCancel={onCancelActivity}
      >
        <Form
          name="addActivitysubmit"
          form={fromactivity}
          onFinish={addActivityValue}
          onFinishFailed={addActivityValuefailed}
        >
          <Form.Item
            label="请输入活动详情"
            lable-width="100px"
            name="description"
            rules={[
              { required: true, message: "请输入活动详情", trigger: "blur" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default AddShop;
