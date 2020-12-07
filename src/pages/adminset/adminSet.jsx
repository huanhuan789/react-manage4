import React, { useState } from 'react';
import { baseUrl, baseImgPath } from '../../config/env'
import localUtils from '../../config/localUtils'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './adminset.less'
import { connect } from 'react-redux'
import {
    Upload,
    message,
} from 'antd';
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
function AdminSet(props) {

    let adminInfo = props.user
    console.log(adminInfo.avatar)
    const [loading, setLoading] = useState(false)
    // let [imageUrl,setImageUrl]=useState(adminInfo.avatar)

    //  上传图片
    const uploadImg = info => {
        console.log(info)
        if (info.file.status === 'uploading') {
            console.log(info)
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            console.log(info)
            // Get this url from response in real world.
            // getBase64(info.file.originFileObj, imageUrl => {
            //     setLoading(false);
            //     // setBaseImaPath(imageUrl);
            //     console.log(info)
            //     setImageUrl(imageUrl)
            //     console.log(imageUrl)
            //     adminInfo.avatar = Url;
            //     console.log(Url)

            // }
            // );
            // setImageUrl(info.file.response.image_path)
            console.log(info)
            console.log(info.file.response.image_path)
            adminInfo.avatar = info.file.response.image_path
            // setAdminInfo(adminInfo)
            // console.log(localUtils.user.avatar)
            console.log(adminInfo.avatar)
            console.log(adminInfo)
                        dispatch({
                type: 'userAvatar',
                user: info.file.response.image_path
              });
          
        }
    };


    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );
    return (
        <div className="fillcontain">

            <header className="admin_title">管理员信息</header>
            <div className="admin_set">
                <ul>
                    <li>
                        <span>姓名：</span><span>{adminInfo.user_name}</span>
                    </li>
                    <li>
                        <span>注册时间：</span><span>{adminInfo.create_time}</span>
                    </li>
                    <li>
                        <span>管理员权限：</span><span>{adminInfo.admin}</span>
                    </li>
                    <li>
                        <span>管理员 ID：</span><span>{adminInfo.id}</span>
                    </li>
                    <li>
                        <div>更换头像：</div>
                        <Upload
                            className="avatar-uploader"
                            action={baseUrl + '/admin/update/avatar/' + adminInfo.id}
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={(info) => uploadImg(info)}
                        >
                            {adminInfo.avatar ? <img src={baseImgPath + adminInfo.avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}

                        </Upload>
                    </li>
                </ul>
            </div>
        </div>
    )
}
// const userState = (dispatch) => {
//     return {
//         uploadImg(info){
//             let action ={
//                 type: 'adminInfo',
//                 user: adminInfo
//             }
//             dispatch(action)
//         }
//         }

// }
const mapDispatchToProps =(dispatch) =>{
    return{

    }
}
export default connect(
    state => ({
        user: state
    }),
    mapDispatchToProps
)(AdminSet)