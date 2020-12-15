import React, { useState, useEffect } from "react";
import "./addgoods.less";
import { getCategory, addCategory, addFood } from "../../api/getData";
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
  Upload,
  message,
  Row,
  Table,
  Popconfirm,
  Modal,
  Tag
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
// 上传图片
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("上传头像图片只能是JPG格式!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("上传头像图片大小不能超过 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
function AddGoods(props) {
  const [formaddspecs] = Form.useForm();
  const [FormAddFoodSubmit]=Form.useForm()
  const [formaddCategory]=Form.useForm();
  const columns = [
    {
      title: "规格",
      dataIndex: "specs",
      key: "specs",
    },
    {
      title: "包装费",
      dataIndex: "packing_fee",
      key: "packing_fee",
      align: "center",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
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
                // const foodFormvalue={...foodForm}
                //   foodFormvalue.specs.splice(index, 1);
                //   console.log(foodFormvalue)
                // setfoodForm(foodFormvalue)
                foodForm.specs.splice(index, 1);
                setfoodForm(foodForm);
              }} */}
            {/* > */}
              <Button type="danger" size="small" onClick={()=>{
                let foodFormvalue=JSON.parse(JSON.stringify(foodForm))
                foodFormvalue.specs.splice(index,1);
                // foodForm=foodFormvalue
                setfoodForm(foodFormvalue)
                console.log(foodFormvalue.specs)
              }}>
                删除
              </Button>
            {/* </Popconfirm> */}
          </div>
        );
      },
    },
  ];
  const [value, setValue] = React.useState("one");
  const [loading, setLoading] = useState(false);
  // const [url, setImgUrl] = useState('')
  // const [baseUrl, setBaseUrl] = useState('')
  // const [baseImgPath, setBaseImaPath] = useState('')
  let [restaurant_id, setrestaurant_id] = useState("");
  const [visible, setVisible] = useState(false);
  let [categoryForm, setcategoryForm] = useState({
    categoryList: [],
    categorySelect: "",
    name: "",
    description: "",
  });
  let [foodForm, setfoodForm] = useState({
    name: "",
    description: "",
    image_path: "",
    activity: "",
    attributes: [],
    specs: [
      {
        specs: "默认",
        packing_fee: 0,
        price: 20,
      },
    ],
  });
  // const [specs,setSpecs]=useState([{
  //   specs: "默认",
  //   packing_fee: 0,
  //   price: 20,
  // },])

  const [foodrules, setfoodrules] = useState({
    name: [{ required: true, message: "请输入食品名称", trigger: "blur" }],
  });
  const [attributes, setattributes] = useState([
    {
      value: "新品",
      label: "新品",
    },
    {
      value: "招牌",
      label: "招牌",
    },
  ]);
  // 显示添加食品种类
  const [showAddCategory, setshowAddCategory] = useState(false);
  const [foodSpecs, setfoodSpecs] = useState("one");
  //单规格展示
  const [foodSpecsshow, setFoodSpecsshow] = useState(true);
  const [dialogFormVisible, setdialogFormVisible] = useState(false);
  const [specs, setSpecs] = useState([]);
  const [specsForm, setspecsForm] = useState({
    specs: "",
    packing_fee: 0,
    price: 20,
  });
  const [specsFormrules, setspecsFormrules] = useState({
    specs: [{ required: true, message: "请输入规格", trigger: "blur" }],
  });
  // 单规格多规格选框
  const onChangeradio = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    if (e.target.value == "one") {
      setFoodSpecsshow(true);
    } else {
      setFoodSpecsshow(false);
    }
  };
  // 下拉值
  const selectValue = () => {
    return categoryForm.categoryList[categoryForm.categorySelect] || {};
  };
  //
  const onSelectcategory=(values)=>{
    console.log(values)
    categoryForm.categorySelect=values
console.log(values)
  }
  // 点击添加食品种类
  const addCategoryFun = () => {
    setshowAddCategory((showAddCategory) => !showAddCategory);
    // return showAddCategory ?'showEdit': ''
  };
  // 添加分类提交  ------------try -catch都执行
  const submitcategoryForm = async (values) => {
    console.log(values);
    const params = {
      name: values.name,
      description: values.description,
      restaurant_id: restaurant_id,
    };
    // try{
    const result = await addCategory(params);
    console.log(result);
    if (result.status == 1) {
      initData();
      // const nullcate = { ...categoryForm };
      // nullcate.name = "";
      // nullcate.description = "";
      // setcategoryForm(nullcate);
      // console.log(nullcate);
      console.log(values);
      // showAddCategory = false;
      setshowAddCategory(false);
      message.success("添加成功");
      formaddCategory.resetFields();
    }
    // }catch(err){
    //     console.log(err)
    // }
  };

  // 请求食品列表
  const initData = async () => {
    const result = await getCategory(restaurant_id);
    console.log(restaurant_id);
    console.log(result);
    if (result.status == 1) {
      result.category_list.map((item, index) => {
        item.value = index;
        item.label = item.name;
      });
      console.log(result.category_list);
      const cateGory = { ...categoryForm };
      categoryForm.categoryList=result.category_list
      cateGory.categoryList = result.category_list;
      console.log(cateGory);
      setcategoryForm(cateGory);
      console.log(categoryForm);
    } else {
      console.log(result);
    }
  };
  //  上传图片
  const uploadImg = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      console.log(info);
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      //   getBase64(info.file.originFileObj, (imageUrl) => {
      setLoading(false);
      // setBaseImaPath(imageUrl);
      console.log(info);
      const foodFo = JSON.parse(JSON.stringify(foodForm)) 
      foodFo.image_path = info.file.response.image_path;
      foodForm.image_path=info.file.reponse.image_path
      setfoodForm(foodFo)
      //   });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  //添加规格弹出框 确认  values输出带有name 和 description
  const addspecssubmit = (values) => {
    console.log(values);
    // const specsvalues={...specsForm}
    // specsvalues= values;
    // setspecsForm(specsvalues);
    // const defaultSpecs = { ...specsForm };
    // defaultSpecs=values
    // console.log(...foodForm)
    // ----------------------------------
    const foodFo = JSON.parse(JSON.stringify(foodForm)) 
    foodFo.specs.push({
      specs: values.specs,
      packing_fee: values.packing_fee,
      price: values.price,
    });
    // foodForm=foodFo
    console.log(foodFo);
    setfoodForm(foodFo);
    console.log(foodForm)
    // foodFo.specs.forEach((item)=>{
    //   specs.push({
    //     specs: item.specs_name,
    //     packing_fee: item.packing_fee,
    //     price: item.price,
    //   });
    //   console.log(specs);
    //   setSpecs(specs);
    // })
    formaddspecs.resetFields();

    //    const specsvalues={...specsForm}
    // specsvalues.specs = "";
    // specsvalues.packing_fee = 0;
    // specsvalues.price = 20;
    // setspecsForm(specsvalues)
    setdialogFormVisible(false);
  };
  // 多规格删除
  const handleDelete = () => {};
  //
  const onChange = () => {};
  const addFoodsubmit = async (values) => {

    console.log(values);
    if (values) {
    console.log(foodForm)
    foodForm.activity=values.activity
    foodForm.name=values.name
    foodForm.description=values.description
    // values.forEach((item,key)=>{
    //   
    //   // foodForm.att
    // })
    console.log(values)
    console.log(selectValue())
const selectValueid=selectValue()
      const params = {
        ...foodForm,
        category_id: selectValueid.id,
        restaurant_id: restaurant_id,
      };
      console.log(params)
      const result = await addFood(params);
      if (result.status == 1) {
        console.log(result);
        message.success("添加成功");
   FormAddFoodSubmit.resetFields()

        // foodForm = {
        //   name: "",
        //   description: "",
        //   image_path: "",
        //   activity: "",
        //   attributes: [],
        //   specs: [
        //     {
        //       specs: "默认",
        //       packing_fee: 0,
        //       price: 20,
        //     },
        //   ],
        // };
      } else {
        message.error(result.message);
      }
    }
  };
  const addFoodfailed = (err) => {
    // message.error(err)
    console.log(err);
  };

  // // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取数据
  useEffect(() => {
    if (props.match.params.restaurant_id) {
      console.log(props);
      console.log(props.match.params.restaurant_id);
      restaurant_id = props.match.params.restaurant_id;
      setrestaurant_id(restaurant_id);
      initData();
      console.log(categoryForm.categoryList);
    } else {
      // restaurant_id = Math.ceil(Math.random() * 10);
      setVisible(true);
      console.log(props);
    }
  }, []);
  const handleOk = () => {
    props.history.push("/manage/shopList");
  };
  const handleAttributes=(values)=>{
    console.log(values)
 
    
   
    foodForm.attributes=values
    console.log(foodForm)
  }
  // const format = 'HH:mm';
  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <header className="form_header">选择食品种类</header>
        <div
          label-width="110px"
          className="form"
          // labelCol={{
          //     span: 4,
          // }}
          wrappercol={{
            span: 14,
            offset: 4,
          }}
        >
          <div className="category_select">
            <Form.Item label="食品种类">
              <Select style={{ width: "100%" }} onSelect={onSelectcategory}>
                {categoryForm.categoryList.map((item, index) => (
                  <Option key={index}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div
            className={`add_category_row${showAddCategory ? "showEdit" : ""}`}
          >
            <Form
              form={formaddCategory}
              name="addCategory"
              className="add_category"
              onFinish={submitcategoryForm}
            >
              <Form.Item
                label="食品种类"
                name="name"
                initialValue={categoryForm.name}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="种类描述"
                name="description"
                initialValue={categoryForm.description}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="add_category_button" onClick={addCategoryFun}>
            <span>添加食品种类</span>
          </div>
        </div>
        <header className="form_header">添加食品</header>
        <Form
        Form={FormAddFoodSubmit}
          label-width="110px"
          className="form food_form"
          onFinish={addFoodsubmit}
          onFinishFailed={addFoodfailed}
        >
          <Form.Item
            label="食品名称"
            name="name"
            rules={[
              { required: true, message: "请输入食品名称", trigger: "blur" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="食品活动" name="activity">
            <Input />
          </Form.Item>
          <Form.Item label="食品详情" name="description">
            <Input />
          </Form.Item>

          <Form.Item label="上传食品图片" name="image_path">
            <Upload
              className="avatar-uploader"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={baseUrl + "/v1/addimg/food"}
              beforeUpload={beforeUpload}
              onChange={(info) => uploadImg(info)}
            >
              {foodForm.image_path ? (
                <img
                  src={baseImgPath + foodForm.image_path}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          {/* <Form.Item label="食品特点" name='attributes'>
            <Select
              defaultValue={foodForm.attributes}
              labelInValue={true}
              style={{ width: 120 }}
              placeholder="请选择"
            >
              {attributes.map((item,index) => (
                <Option key={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item label="食品特点" name='attributes'>
            <Select
             mode="multiple"
              defaultValue={foodForm.attributes}
              style={{ width: 300 }}
              placeholder="请选择"
              onChange={handleAttributes}
            >
              {attributes.map((item,index) => (
                <Option key={item.value}>
                {item.label}
             </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="食品规格">
            <Radio.Group onChange={onChangeradio} value={value}>
              <Radio value={"one"}>单规格</Radio>
              <Radio value={"more"}>多规格</Radio>
            </Radio.Group>
          </Form.Item>
          <Row className={foodSpecsshow ? "" : "isunshow"}>
            <Form.Item label="包装费">
              <InputNumber
                min={0}
                max={100}
                onChange={onChange}
                defaultValue={5}
              />
            </Form.Item>
            <Form.Item label="价格">
              <InputNumber
                min={0}
                max={10000}
                defaultValue={20}
                onChange={onChange}
              />
            </Form.Item>
          </Row>
          <Row
            className={foodSpecsshow ? " isunshow" : ""}
            style={{ overflow: "auto", textAlign: "center" }}
          >
            <Button
              type="primary"
              onClick={() => setdialogFormVisible(true)}
              style={{ marginBottom: "10px" }}
            >
              添加规格
            </Button>
           
            <Table
              rowKey="id"
              // onRow={(record,index)=>{
              // return{
              //   onClick:event=>{

              //   }
              // }
              // }}
              size="small"
              // 分页每页20个
              pagination={false}
              columns={columns}
              // key={index}
              dataSource={foodForm.specs}
              style={{ marginBottom: "20px" }}
            />
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              确认添加食品
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title="添加规格"
          visible={dialogFormVisible}
          //   onOk={addspecs}
          //   cancelText="取消"
          //   okText="确认"
          footer={null}
          onCancel={() => setdialogFormVisible(false)}
        >
          <Form form={formaddspecs} initialValues={specsForm} onFinish={addspecssubmit}>
            <Form.Item
              label="规格"
              lable-width="100px"
              name="specs"
              rules={[
                { required: true, message: "请输入规格", trigger: "blur" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="包装费" lable-width="100px" name="packing_fee">
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item label="价格" lable-width="100px" name="price">
              <InputNumber min={0} max={10000} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="提示"
          visible={visible}
          // onOk={handleOk}
          // okText='确定'
          //   onCancel={()=>{visible(false)}}
          footer={null}
        >
          <p>添加商品需要选择一个商铺，请先选择商铺</p>
          <Button
            type="primary"
            onClick={handleOk}
            style={{ marginLeft: "200px", marginTop: "100px" }}
          >
            确定
          </Button>
        </Modal>
      </div>
    </div>
  );
}
export default AddGoods;
