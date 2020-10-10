import React ,{useState,useEffect}from 'react';
import './ediet.less'
import { Card ,Button, message} from 'antd';
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'//获取编辑器html内容
import htmlToDraft from 'html-to-draftjs'//将html内容转为编辑器显示内容
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'//引入样式
function Ediet(){
    // 创建一个没有内容的编辑对象
    const [editorState,seteditorState]=useState(EditorState.createEmpty())
    const [ editorContent,seteditorContent]=useState('')
      //编辑器发上内容发生变化时的回调
    const onEditorStateChange = (editorState)=>{
        // console.log(convertToRaw(editorState.getCurrentContent()))
        seteditorState(editorState)
    }
       //获取内容变化值
     const onEditorChange = (editorContent) => {
        // console.log(JSON.stringify(editorContent));
        seteditorContent(
            editorContent
        );
    };
    const submit=()=>{
        console.log(editorContent);
       message.success('提交成功！');
    }
    const uploadImageCallBack=(file)=>{
        return new Promise(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('POST', '/img/')
              const data = new FormData()
              data.append('image', file)
              xhr.send(data)
              xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url // 得到图片的url
                resolve({data: {link: url}})
              })
              xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
              })
            }
          )
    }
    //清空编辑器内容
   const handleClearContent = ()=> {
        seteditorState(editorState='')
    }
    return (
        <div>
        <div className="edit_container">
                
                    <Editor  
                        wrapperClassName="wrapper"
                        editorClassName="editer"
                        onContentStateChange={onEditorChange} //获取内容变化值
                        onEditorStateChange={onEditorStateChange}  //编辑器状态发生变化时
                        toolbar={{
                            image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                          }}
                    />
          
                </div>
                <div className="submit_btn">
                <Button type='primary' onClick={submit}>提交</Button>
                </div>
              
      
        </div>

    )
}
export default Ediet