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
} from 'antd';

function AddGoods(props) {
    const [restaurant_id, setrestaurant_id] = useState(1)
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
    // 下拉值
    const selectValue = () => {
        return categoryForm.categoryList[categoryForm.categorySelect] || {}
    }
    // 点击添加食品种类
    const addCategoryFun = () => {
        setshowAddCategory(showAddCategory => !showAddCategory)
        // return showAddCategory ?'showEdit': ''
    }

    const submitcategoryForm = () => {

    }
    // 请求食品列表
    const initData = async () => {
        const result = await getCategory(restaurant_id);
        if (result.status == 1) {
            result.category_list.map((item, index) => {
                item.value = index;
                item.label = item.name;
            })
            categoryForm.categoryList = result.category_list;
            console.log(categoryForm.categoryList)
        } else {
            console.log(result)
        }
    }
    // // (组件第一次渲染完成，每次组件更新执行) 发送接口请求  执行异步任务 获取数据
    useEffect(() => {
        console.log(props)
        initData()
        console.log(categoryForm.categoryList)
    }, [props])
    return (
        <div>
            <div style={{ marginTop: 20 }}>

                <header className="form_header">选择食品种类</header>
                <Form label-width="110px" className="form"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                >
                    <div className='category_select'>
                        <Form.Item label="食品种类">
                            <Select style={{ width: "100%" }}>
                                <Select.Option value=""></Select.Option>
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
                                <Button type="primary" onClick={submitcategoryForm('categoryForm')}>Submit</Button>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="add_category_button" onClick={addCategoryFun}>
                        <span>添加食品种类</span>
                    </div>
                </Form>
                <header className="form_header">添加食品</header>

            </div>

        </div >

    )
}
export default AddGoods