import React from "react";
import { useState, useEffect } from "react";
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
  Space,
} from "antd";
import { baseUrl, baseImgPath } from "../../config/env";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getFoods,
  getFoodsCount,
  getMenu,
  updateFood,
  deleteFood,
  getResturantDetail,
  getMenuById,
} from "../../api/getData";
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
const { Option } = Select;

function FoodList(props) {
    const specscolumns = [
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
                <Button
                  type="danger"
                  size="small"
                  onClick={()=>{
                      console.log(specs,index)
                      let specsdelete=JSON.parse(JSON.stringify(specs)) 
                    specsdelete.splice(index,1)
                    console.log(specsdelete)
                    setSpecs(specsdelete)
                  }}
                >
                  删除
                </Button>
              </div>
            );
          },
        },
      ];
  const columns = [
    {
      title: "食品名称",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "食品介绍",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "评分",
      dataIndex: "rating",
      key: "rating",
    },

    {
      title: "操作",
      width: 300,
      key: "action",
      render: (txt, record, index) => (
        <Space size="small">
          <Button
            onClick={() => {
              console.log(txt, record, index);
              //表单无初始值显示
              //函数里有异步请求 先执行此同步函数代码，setVisible true 会先展示表单页面，initvalue只会在表单初始显示的时候获取初始值，而此时异步函数还未执行
              //【解决】所有函数执行完获取到数据后 再展示表单 
              getSelectItemData(record, "edit");
              console.log(txt);
              console.log(txt.specfoods);
              if (txt.specfoods) {
                txt.specfoods.forEach((item) => {
                  specs.push({
                    specs: item.specs_name,
                    packing_fee: item.packing_fee,
                    price: item.price,
                  });
                  console.log(specs);
                  setSpecs(specs);
                });
              }
            }}
          >
            编辑
          </Button>
          {/* <Button onClick={()=>handleEdit()}>编辑</Button> */}
          <Button
            onClick={async () => {
              try {
                const res = await deleteFood(record.item_id);
                if (res.status == 1) {
                  message.success("删除食品成功");
                  tableData.splice(index, 1);
                } else {
                  throw new Error(res.message);
                }
              } catch (err) {
                message.error(err.message);
                console.log("删除食品失败");
              }
            }}
            type="primary"
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const [form] = Form.useForm();
  // const [baseUrl, setBaseUrl] = useState()
  // const [baseImgPath, setbaseImgPath] = useState()
  const [loading, setLoading] = useState(false);
  let [restaurant_id, setRestaurant] = useState(0);
  const [city, setCity] = useState({});
  //
  let [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  let [count, setcount] = useState(0);
  let [tableData, settableData] = useState([]);
  let [selectTable, setSelectable] = useState({});
  const [dialogFormVisible, setdialogFormVisible] = useState(false);
  const [menuOptions, setmenuOptions] = useState([]);
  let [selectMenu, setselectMenu] = useState({});
  const [selectIndex, setselectIndex] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [specsForm, setSpacsForm] = useState({
    specs: "",
    packing_fee: 0,
    price: 20,
  });
  const [specsFormrules, setspecsFormrules] = useState({
    specs: [{ required: true, message: "请输入规格", trigger: "blur" }],
  });
  const [specsFormVisible, setspecsFormVisible] = useState(false);
  const [expendRow, setexpendRow] = useState([]);
  // 修改框是否可见
  const [visible, setvisible] = useState(false);
  //   const specsFun = () => {
  //     if (selectTable.specsfoods) {
  //       selectTable.specsfoods.forEach((item) => {
  //         specs.push({
  //           specs: item.specs_name,
  //           packing_fee: item.packing_fee,
  //           price: item.price,
  //         });
  //       });
  //     }
  //     return specs;
  //   };

  const initData = async () => {
    try {
      const countData = await getFoodsCount({ offset, limit, restaurant_id });
      console.log(countData);
      if (countData.status == 1) {
        count = countData.count;
        setcount(count);
        console.log(count);
      } else {
        throw new Error("获取数据失败");
      }
      getFoodslist();
    } catch (err) {
      console.log("获取数据失败", err);
    }
  };
  //食品分类
  const getMenuvalue = async () => {
    console.log(selectTable);
    // console.log(data);
    const menu = await getMenu({
      restaurant_id: selectTable.restaurant_id,
      allMenu: true,
    });
    console.log(menu);
    const menuOptionsvalue = JSON.parse(JSON.stringify(menuOptions));
    menu.forEach((item, index) => {
      menuOptionsvalue.push({
        label: item.name,
        value: item.id,
        index,
      });
    });
    console.log(menu);
    console.log(menuOptionsvalue);
    setmenuOptions(menuOptionsvalue);
    setvisible(true);
  };
  //异步获取食品列表
  const getFoodslist = async () => {
    const Foods = await getFoods({
      offset: offset,
      limit: limit,
      restaurant_id: restaurant_id,
    });

    //   console.log(restaurant)
    tableData = [];
    Foods.forEach((item, index) => {
      const tableDatavalue = {};
      tableDatavalue.name = item.name;
      tableDatavalue.item_id = item.item_id;
      tableDatavalue.description = item.description;
      tableDatavalue.rating = item.rating;
      tableDatavalue.month_sales = item.month_sales;
      tableDatavalue.restaurant_id = item.restaurant_id;
      tableDatavalue.category_id = item.category_id;
      tableDatavalue.image_path = item.image_path;
      tableDatavalue.specfoods = item.specfoods;
      tableDatavalue.index = index;
      //   tableDatavalue.data = item;
      tableData.push(tableDatavalue);
    });
    // console.log(Foods)
    console.log(tableData);
    settableData(tableData);
  };
  //   //扩展展示的信息
  //   const expand = async (record, stattus) => {};
  // 点击编辑
  //   const handleEdit = (tableData) => {
  //     getSelectItemData(tableData, "edit");
  //     setvisible(true);
  //   };
  const expand = (expanded, record) => {
    console.log(expanded, record);
    if (expanded) {
      getSelectItemData(record);
      console.log(tableData);
      settableData(tableData);
    } else {
      const index = expendRow.indexOf(record.index);
      expendRow.splice(index, 1);
    }
  };

  // 所点击的该行的店铺信息
  const getSelectItemData = async (record, type) => {
    console.log(record.restaurant_id);
    // const { data } = record;
    try {
      const restaurant = await getResturantDetail(record.restaurant_id);
      const category = await getMenuById(record.category_id);
      selectTable = {
        ...record,
        ...{
          restaurant_name: restaurant.name,
          restaurant_address: restaurant.address,
          category_name: category.name,
        },
      };
      //   data.restaurant = restaurant;
      //   data.category = category;
      //   let selectTablevalue={...selectTable}

      //   const selectTablevalue={...selectTable}

      setSelectable(selectTable);

      const tableDatavalue = [...tableData];
      selectMenu = { label: category.name, value: record.category_id };

      tableDatavalue.splice(record.index, 1, { ...selectTable });
      console.log("------------------------------", selectTable);
      console.log(tableDatavalue);
      settableData(tableDatavalue);
      expendRow.push(record.index);

      if (type == "edit" && restaurant_id != record.restaurant_id) {
        getMenuvalue();
      }
      // console.log(restaurant);
    } catch (err) {
      console.log("获取餐馆信息失败", err);
    }
  };

  const handleSelect = (index) => {
      selectIndex = index;
      selectMenu = menuOptions[index];
    },
    addspecs = (values) => {
      console.log(values);
      //   const specs=[]
      const specsValue = [...specs];
      specsValue.push({ ...values });
      setSpecs(specsValue);
      console.log(specsValue);
      form.resetFields();
      //    specsForm.specs = '';
      //    specsForm.packing_fee = 0;
      //    specsForm.price = 20;

      setspecsFormVisible(false);
    },

    deleteSpecs = (index) => {
      console.log(index);
    };
  // 分页
 const handlePageChange = (val, pageSize) => {
    // 每页条数
    console.log(pageSize);

    offset = (val - 1) * limit;
    // setCurrentPage(currentPage)
    // setOffset(offset)
    getFoodslist();
  };

  //   // 异步获取删除数据内容
  //   const handleDelete = async (tableData) => {
  //     const res = await deleteFood(tableData.id);
  //     if (res.status == 1) {
  //       this.$message({
  //         type: "success",
  //         message: "删除店铺成功",
  //       });
  //       tableData.splice(tableData.index, 1);
  //     }
  //   };
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
      selectTable.image_path = info.file.response.image_path;
      //   });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  // 编辑提交
  const updateFoodvalue = async () => {
    setvisible(false);
    form.resetFields();
    console.log(selectTable)
    const subData = { new_category_id: selectTable.category_id, specs: specs };
    console.log(subData);
    const postData = { ...selectTable, ...subData };
    const res = await updateFood(postData);
    console.log(res);
    if (res.status == 1) {
       
      message.success("更新食品信息成功");
      getFoodslist();
    } else {
      message.error(res.message);
    }
  };
  const updateFoodfailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("请检查输入是否正确");
  };
  useEffect(() => {
    restaurant_id = props.match.params.restaurant_id;
    console.log(restaurant_id);
    console.log(props);
    initData();
  }, []);
  return (
    <div>
      <Table
        rowKey="item_id"
        onExpand={expand}
        size="small"
        // 分页每页20个
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
              <p style={{ margin: 0 }}>食品名称 {record.name}</p>
              <p style={{ margin: 0 }}>餐馆名称 {record.restaurant_name}</p>
              <p style={{ margin: 0 }}>食品 ID {record.item_id}</p>
              <p style={{ margin: 0 }}>餐馆 ID {record.restaurant_id}</p>
              <p style={{ margin: 0 }}>食品介绍 {record.description}</p>
              <p style={{ margin: 0 }}>餐馆地址{record.restaurant_address}</p>
              <p style={{ margin: 0 }}>食品评分{record.rating}</p>
              <p style={{ margin: 0 }}>食品分类{record.category_name}</p>
              <p style={{ margin: 0 }}>月销量{record.month_sales}</p>
            </div>
          ),
        }}
        dataSource={tableData}
      />
      <Modal
        title="修改食品信息"
        visible={visible}
        // onOk={updateFood}
        footer={null}
        // okText="确定"
        // cancelText="取消"
        onCancel={() => setvisible(false)}
      >
        <div>
          {JSON.stringify(selectMenu.lable)}
          {/* {JSON.stringify(selectTable)}  initialValue只有表单最开始创建的时候应用 */}
          <Form
              form={form}
            label-width="110px"
            className="form food_form"
            onFinish={updateFoodvalue}
            defaultValue={{ name: 123 }}
            onFinishFailed={updateFoodfailed}
          >
            <Form.Item
              label="食品名称"
              name="name"
              initialValue={selectTable.name}
              rules={[
                { required: true, message: "请输入食品名称", trigger: "blur" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="食品介绍"
              name="description"
              initialValue={selectTable.description}
            >
              <Input />
            </Form.Item>
            <Form.Item label="食品分类">
              <Select
                style={{ width: "100%" }}
                defaultValue={selectTable.category_name}
              >
                {menuOptions.map((item, index) => (
                  <Option key={index}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="食品图片">
              <Upload
                className="avatar-uploader"
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={baseUrl + "/v1/addimg/food"}
                beforeUpload={beforeUpload}
                onChange={(info) => uploadImg(info)}
              >
                {selectTable.image_path ? (
                  <img
                    className="avtar"
                    src={baseImgPath + selectTable.image_path}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            <Row style={{ overflow: "auto", textAlign: "center" }}>
              <Button
                type="primary"
                onClick={() => setspecsFormVisible(true)}
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
                columns={specscolumns}
                // key={index}
                dataSource={specs}
                style={{ marginBottom: "20px" }}
              />
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="添加规格"
            visible={specsFormVisible}
            //   onOk={addspecs}
            //   cancelText="取消"
            //   okText="确认"
            footer={null}
            onCancel={() => setspecsFormVisible(false)}
          >
            <Form form={form} initialValues={specsForm} onFinish={addspecs}>
              <Form.Item
                label="规格"
                lable-width="100px"
                name="specs"
                rules={[
                  { required: true, message: "请输入规格", trigger: "blur" },
                ]}
              >
                <Input auto-complete={"off"} />
              </Form.Item>
              <Form.Item label="包装费" lable-width="100px" name="packing_fee">
                <InputNumber min={0} max={100} />
              </Form.Item>
              <Form.Item label="价格" lable-width="100px" name="price">
                <InputNumber min={0} max={10000} />
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => {
                    setvisible(false);
                  }}
                >
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Modal>
    </div>
  );
}
export default FoodList;
