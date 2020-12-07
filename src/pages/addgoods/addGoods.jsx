import React, { useState, useEffect } from 'react';
import './addgoods.less'
import { getCategory, addCategory, addFood } from '../../api/getData'
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
    Upload,
    message,
    Row,
    Table,
    Popconfirm,
    Modal
} from 'antd';
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
        message.error('上传头像图片只能是JPG格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
function AddGoods(props) {
    const columns = [
        {
            title: '规格',
            dataIndex: 'specs',
            key: 'specs',

        },
        {
            title: '包装费',
            dataIndex: 'packing_fee',
            key: 'packing_fee',
            align: 'center',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
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
    const [value, setValue] = React.useState('one');
    const [loading, setLoading] = useState(false)
    // const [url, setImgUrl] = useState('')
    // const [baseUrl, setBaseUrl] = useState('')
    // const [baseImgPath, setBaseImaPath] = useState('')
    const [restaurant_id, setrestaurant_id] = useState('')
    const [visible, setVisible] = useState(false)
    const [categoryForm, setcategoryForm] = useState({
        categoryList: [],
        categorySelect: '',
        name: '',
        description: '',
    })
    const [foodForm, setfoodForm] = useState({
        name: '',
        description: '',
        image_path: '',
        activity: '',
        attributes: [],
        specs: [{
            specs: '默认',
            packing_fee: 0,
            price: 20,
        }],
    })
    const [foodrules, setfoodrules] = useState({
        name: [
            { required: true, message: '请输入食品名称', trigger: 'blur' },
        ],
    })
    const [attributes, setattributes] = useState([{
        value: '新',
        label: '新品'
    }, {
        value: '招牌',
        label: '招牌'
    },])
    // 显示添加食品种类
    const [showAddCategory, setshowAddCategory] = useState(false)
    const [foodSpecs, setfoodSpecs] = useState('one')
    //单规格展示
    const [foodSpecsshow, setFoodSpecsshow] = useState(true)
    const [dialogFormVisible, setdialogFormVisible] = useState(false)
    const [specsForm, setspecsForm] = useState({
        specs: '',
        packing_fee: 0,
        price: 20,
    })
    const [specsFormrules, setspecsFormrules] = useState({
        specs: [
            { required: true, message: '请输入规格', trigger: 'blur' },
        ],
    })
    // 单规格多规格选框
    const onChangeradio = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
        if (e.target.value == 'one') {
            setFoodSpecsshow(true)
        } else {
            setFoodSpecsshow(false)
        }
    };
    // 下拉值
    const selectValue = () => {
        return categoryForm.categoryList[categoryForm.categorySelect] || {}
    }
    // 点击添加食品种类
    const addCategoryFun = () => {
        setshowAddCategory(showAddCategory => !showAddCategory)
        // return showAddCategory ?'showEdit': ''
    }
    // 添加分类提交
    const submitcategoryForm = () => {
        // $refs[categoryForm].validate(async (valid) => {
        //     if (valid) {
        //         const params = {
        //             name: categoryForm.name,
        //             description: categoryForm.description,
        //             restaurant_id: restaurant_id,
        //         }
        //         try{
        //             const result = await addCategory(params);
        //             if (result.status == 1) {
        //                 initData();
        //                 categoryForm.name = '';
        //                categoryForm.description = '';
        //                 showAddCategory = false;
        //                 $message({
        //                     type: 'success',
        //                     message: '添加成功'
        //                   });
        //             }
        //         }catch(err){
        //             console.log(err)
        //         }
        //     } else {
        //        $notify.error({
        //             title: '错误',
        //             message: '请检查输入是否正确',
        //             offset: 100
        //         });
        //         return false;
        //     }
        // });
    }
    // 请求食品列表
    const initData = async () => {
        const result = await getCategory(restaurant_id);
        console.log(restaurant_id)
        console.log(result)
        if (result.status == 1) {
            result.category_list.map((item, index) => {
                item.value = index;
                item.label = item.name;
            })
            categoryForm.categoryList = result.category_list;
            console.log(categoryForm.categoryList)
            setcategoryForm(categoryForm.categoryList)
        } else {
            console.log(result)
        }
    }
    //  上传图片
    const uploadImg = info => {
        console.log(info)
        if (info.file.status === 'uploading') {
            console.log(info)
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setLoading(false);
                // setBaseImaPath(imageUrl);
                console.log(info)
                foodForm.image_path = imageUrl

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
    // 多规格删除
    const handleDelete = () => {

    }
    // 
    const onChange = () => {

    }
    //添加规格弹窗 确认
    const handleedietok = () => {
        console.log('确认添加')
    }
    // // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取数据
    useEffect(() => {
        if (props.match.params.restaurant_id) {
            setrestaurant_id(props.match.params.restaurant_id)
            console.log(props.match.params.restaurant_id)
            console.log(props)
            initData()
        } else {
            // restaurant_id = Math.ceil(Math.random() * 10);
            setVisible(true)
            console.log(props)
          
        }
      
        // console.log(categoryForm.categoryList)
    }, [props])
    const handleOk = () => {
        props.history.push('/shopList')
    }
    // const format = 'HH:mm';
    return (
        <div>
            <div style={{ marginTop: 20 }}>

                <header className="form_header">选择食品种类</header>
                <Form label-width="110px" className="form"
                    // labelCol={{
                    //     span: 4,
                    // }}
                    wrapperCol={{
                        span: 14,
                        offset: 4
                    }}
                >
                    <div className='category_select'>
                        <Form.Item label="食品种类">
                            <Select style={{ width: "100%" }}>
                                {/* {categoryForm.categoryList.map(item => (
                                    <Option key={item.value}>{item.value}</Option>
                                ))} */}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={`add_category_row${showAddCategory ? 'showEdit' : ''}`}>
                        <div className="add_category">
                            <Form.Item label="食品种类">
                                <Input />
                            </Form.Item>
                            <Form.Item label="种类描述">
                                <Input />
                            </Form.Item>
                            <Form.Item >
                                <Button type="primary" onClick={submitcategoryForm('categoryForm')}>提交</Button>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="add_category_button" onClick={addCategoryFun}>
                        <span>添加食品种类</span>
                    </div>
                </Form>
                <header className="form_header">添加食品</header>
                <Form label-width="110px" className="form food_form" rules={foodrules}>
                    <Form.Item label="食品名称">
                        <Input />
                    </Form.Item>
                    <Form.Item label="食品活动">
                        <Input />
                    </Form.Item>
                    <Form.Item label="食品详情">
                        <Input />
                    </Form.Item>

                    <Form.Item label="上传食品图片"  >
                        <Upload
                            className="avatar-uploader"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={baseUrl + '/v1/addimg/food'}
                            beforeUpload={beforeUpload}
                            onChange={(info)=>uploadImg(info)}
                        >
                            {foodForm.image_path ? <img src={baseImgPath + foodForm.image_path} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="优惠活动"  >
                        <Select defaultValue="lucy" style={{ width: 120 }} placeholder="请选择">
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="食品规格"  >
                        <Radio.Group onChange={onChangeradio} value={value}>
                            <Radio value={'one'}>单规格</Radio>
                            <Radio value={'more'}>多规格</Radio>

                        </Radio.Group>
                    </Form.Item>
                    <Row className={foodSpecsshow ? '' : 'isunshow'}>
                        <Form.Item label="包装费"  >
                            <InputNumber min={0} max={100} onChange={onChange} />
                        </Form.Item>
                        <Form.Item label="价格"  >
                            <InputNumber min={0} max={10000} defaultValue={20} onChange={onChange} />
                        </Form.Item>
                    </Row>
                    <Row className={foodSpecsshow ? ' isunshow' : ''} style={{ overflow: 'auto', textAlign: 'center' }}>
                        <Button type="primary" onClick={() => setdialogFormVisible(true)} style={{ marginBottom: '10px' }}>添加规格</Button>
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
                            dataSource={foodForm.specs}
                            style={{ marginBottom: '20px' }}
                        />
                    </Row>

                    <Form.Item   >
                        <Button type="primary" onClick={addFood('foodForm')}>确认添加食品</Button>
                    </Form.Item>

                </Form>
                <Modal
                    title="添加规格"
                    visible={dialogFormVisible}
                    onOk={handleedietok}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => setdialogFormVisible(false)}
         
                >
                    <Form rules={specsFormrules} onChange={() => setspecsForm(specsForm)}>
                        <Form.Item label="规格" lable-width='100px'  >
                            <Input onChange={() => setspecsForm(specsForm.specs)} auto-complete={'off'} />
                        </Form.Item>
                        <Form.Item label="包装费" lable-width='100px'  >
                            <InputNumber min={0} max={100} onChange={() => setspecsForm(specsForm.packing_fee)} />
                        </Form.Item>
                        <Form.Item label="价格" lable-width='100px'   >
                            <InputNumber min={0} max={10000} onChange={() => setspecsForm(specsForm.specsForm.price)} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="提示"
                    visible={visible}
                    // onOk={handleOk}
                    // okText='确定'
                    // onCancel={false}
                    footer={null}
                >
                    <p>添加商品需要选择一个商铺，请先选择商铺</p>
                    <Button type='primary' onClick={handleOk} style={{marginLeft:'200px',marginTop:'100px'}}>确定</Button>
                </Modal>
            </div>

        </div >

    )
}
export default AddGoods