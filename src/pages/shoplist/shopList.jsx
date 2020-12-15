import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Cascader,
  Table,
  Select,
  Tag,
  Space,
  Button,
  Modal,
  Popconfirm,
  AutoComplete,
} from "antd";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "./shopList.less";
import { baseUrl, baseImgPath } from "../../config/env";
import {
  cityGuess,
  getResturants,
  getResturantsCount,
  foodCategory,
  updateResturant,
  searchplace,
  deleteResturant,
} from "../../api/getData";

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
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
function ShopList(props) {
  const columns = [
    {
      title: "店铺名称",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "店铺地址",
      width: 300,
      dataIndex: "address",
      key: "address",
    },
    {
      title: "店铺介绍",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "操作",
      width: 300,
      key: "action",
      align: "center",

      render: (txt, record, index) => {
        return (
          <div>
            <Button
              size="small"
              onClick={() => {
                setselectTable(record);
                address.address = record.address;
                console.log(record);
                selectedCategory = record.category.split("/");
                console.log(selectedCategory);
                setselectedCategory(selectedCategory);
                setvisible(true);
                if (!categoryOptions.length) {
                  getCategory();
                }
              }}
            >
              编辑
            </Button>
            {/* <Button onClick={()=>handleEdit()}>编辑</Button> */}
            <Button
              style={{ margin: "0 1rem" }}
              size="small"
              onClick={() => {
                props.history.push(`/manage/addgoods/${record.id}`);

                // props.history.push({
                //   pathname: '/addgoods',
                //   query: { restaurant_id:record.id },
                // })
              }}
            >
              添加食品
            </Button>
            <Popconfirm
              title="确定删除此项？"
              onCancel={() => console.log("用户点击取消")}
              onConfirm={async () => {
                try {
                  const res = await deleteResturant(record.id);
                  console.log(res);
                  if (res.status == 1) {
                    message.success("删除店铺成功");
                    tableData.splice(index, 1);
                  } else {
                    throw new Error(res.message);
                  }
                } catch (err) {
                  message.error(err.message);
                  console.log("删除店铺失败");
                }
              }}
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  let [tableData, settableData] = useState([]); //一级分类列表
  let [city, setCity] = useState({ name: "南京" });
  let [cityList, setCityList] = useState([]);
  // 有多少页
  let [offset, setOffset] = useState(0);
  // 每页限制数据条数
  const [limit, setLimit] = useState(20);
  let [count, setcount] = useState(0);
  let [selectTable, setselectTable] = useState({});
  const [dialogFormVisible, setdialogFormVisible] = useState(false);
  const [categoryOptions, setcategoryOptions] = useState([]);
  let [selectedCategory, setselectedCategory] = useState([]);
  let [address, setaddress] = useState({});
  // 修改框是否可见
  const [visible, setvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [baseUrl, setBaseUrl] = useState('')
  // const [baseImgPath, setBaseImgPath] = useState('')
  const [form] = Form.useForm();
  //异步获取 城市信息 店铺数量--------------
  const initData = async () => {
      try {
        //------------------------------------------ city接口504
        //  const cityvalue = await cityGuess();
        // console.log(cityvalue)
        const countData = await getResturantsCount();
        if (countData.status == 1) {
          setcount(count);
          count = countData.count;
          console.log("商铺列表数量", count);
          setcount(count);
        } else {
          throw new Error("获取数据失败");
        }
        getRes();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    // 异步获取商家列表----------------[加try catch 加const报错 ]
    getRes = async () => {
      const { latitude, longitude } = city;
      const restaurants = await getResturants({
        latitude,
        longitude,
        offset: offset,
        limit: limit,
      });
      console.log(restaurants);
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
      console.log(tableData);
    };

  // 异步获取食品分类
  const getCategory = async () => {
    const categories = await foodCategory();
    console.log(categories);
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
      }
    });
    setcategoryOptions(categoryOptions);
    // console.log(tableData)
  };
  // 异步获取删除数据内容
  // const handleDelete = async (txt, record, index) => {
  //   const res = await deleteResturant(record.id);
  //   if (res.status == 1) {
  //     this.$message({
  //       type: 'success',
  //       message: '删除店铺成功'
  //     });
  //     tableData.splice(index, 1);
  //   }

  // }
  // -----------------------------------city接口504   city.id无
  const querySearchAsync = async (searchText) => {
    console.log(searchText);
    console.log(city.id);
    cityList = await searchplace(city.id, searchText);
    setCityList(cityList);
    console.log(cityList);
  };
  //地址栏下拉
  const addressSelect = (vale) => {
    const { address, latitude, longitude } = vale;
    address = { address, latitude, longitude };
    setaddress(address);
  };
  // 分页
  const handlePageChange = (val, pageSize) => {
    // 每页条数
    console.log(pageSize);

    offset = (val - 1) * limit;
    // setCurrentPage(currentPage)
    // setOffset(offset)
    getRes();
  };

  // 编辑框点击确认 将编辑信息提交
  const handleedietok = async (e) => {
    console.log(e);
    setvisible(false);
    try {
      Object.assign(selectTable, address);
      console.log(selectedCategory);
      selectTable.category = selectedCategory.join("/");
      const res = await updateResturant(selectTable);
      if (res.status == 1) {
        message.success("更新店铺信息成功");
        getRes();
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log("更新餐馆信息失败", err);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  //编辑框点击取消
  const handleCancel = (e) => {
    console.log(e);
    setvisible(false);
  };
  // // 点击添加食品
  // const addGoods = (tableData) => {
  //   console.log(tableData)
  //   // 进入添加食品路由页面
  //   props.history.push(`/addgoods${}`)
  // }
  //  上传图片
  const handleChange = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl => {
      setLoading(false);
      console.log(info);
      // setImgUrl(imageUrl);
      // setBaseImgPath(imageUrl);
      selectTable.image_path = info.file.response.image_path;
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // const filterOption=(inputValue, option)=>{

  // }
  // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取列表
  useEffect(() => {
    initData();
    // getResturants()
    // console.log(tableData)
  }, []);
  return (
    <div>
      <Table
        rowKey="id"
        size="small"
        pagination={{
          total: count,
          defaultCurrent: 1,
          pageSize: 20,
          showSizeChanger: false,
          onChange: handlePageChange,
        }}
        columns={columns}
        // key={index}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p style={{ margin: 0 }}>店铺描述 {record.description}</p>
              <p style={{ margin: 0 }}>店铺名称 {record.name}</p>
              <p style={{ margin: 0 }}>店铺地址 {record.address}</p>
              <p style={{ margin: 0 }}>ID {record.id}</p>
              <p style={{ margin: 0 }}>联系电话 {record.phone}</p>
              <p style={{ margin: 0 }}>评分 {record.rating}</p>
              <p style={{ margin: 0 }}>分类 {record.category}</p>
            </div>
          ),
         
        }}
        dataSource={tableData}
      />
      <Modal
        title="修改店铺信息"
        visible={visible}
        footer={null}
        closable={true}
        // onOk={handleedietok}
        // okText='确定'
        // cancelText='取消'
        onCancel={handleCancel}
      >
        <div>
          <Form
            form={form}
            name="control-hooks"
            onFinish={handleedietok}
            onFinishFailed={onFinishFailed}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
          >
            <Form.Item
              label="店铺名称"
              name="name"
              initialValue={selectTable.name}
              rules={[{ required: true, message: "请输入店铺名称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="详细地址"
              name="address"
              placeholder="请输入地址"
              rules={[{ required: true, message: "请输入详细地址" }]}
            >
              <AutoComplete
                defaultValue={address.address}
                style={{ width: "100%" }}
                onSearch={querySearchAsync}
                onSelect={addressSelect}
                options={cityList}
                filterOption={(inputValue, option) => {
                  console.log(option);
                  option.props.children.includes(inputValue);
                }}
                placeholder="请输入地址"
              />
            </Form.Item>
            <Form.Item></Form.Item>
            <div style={{ marginLeft: "250px" }}>当前城市：{city.name}</div>
            <Form.Item
              label="店铺介绍"
              name="description"
              initialValue={selectTable.description}
              rules={[{ required: true, message: "请输入店铺介绍" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
              initialValue={selectTable.phone}
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
              <Input />
            </Form.Item>

            <Form.Item label="店铺分类" name="category">
              <Cascader
                defaultValue={selectedCategory}
                options={categoryOptions}
                changeOnSelect
              />
            </Form.Item>

            <Form.Item label="店铺头像">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={baseUrl + "/v1/addimg/shop"}
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info)}
              >
                {selectTable.image_path ? (
                  <img
                    src={baseImgPath + selectTable.image_path}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item className="dialog-footer">
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
export default ShopList;
