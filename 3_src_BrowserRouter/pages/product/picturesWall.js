import React, { Component } from 'react'
import PropsTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import {reqDeleteImg} from '../../api1/index'
import { BASE_IMG_URL } from '../../utils/constants';
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
export default class PicturesWall extends Component {
    // state = {
    //     previewVisible: false,  //标识是否显示大图预览Modal 是否显示modal
    //     previewImage: '',  //大图的url 
    //     previewTitle: '',
    //   };
    //接收属性
      static propTypes = {
          imgs:PropsTypes.array
      }
      constructor(props){
          super(props)
          const imgs = this.props.imgs
          //fileList图片的相关信息
          let fileList = []
          if(imgs && imgs.length>0){
              fileList = imgs.map((img,index)=>({
                    uid: -index,
                    name:img, //图片文件名
                    status: 'done', //图片状态：done--已经上传，uploading：正在上传中，removed:已删除
                    url: BASE_IMG_URL + img //图片链接
              }))
          }
          //初始化状态
          this.state = {
            previewVisible: false,  //标识是否显示大图预览Modal 是否显示modal
            previewImage: '',  //大图的url 
            fileList    //所有已上传图片的数组
          }
      }
      handleCancel = () => this.setState({ previewVisible: false });
      getImgs = () =>{
          //收集fileList文件的所有图片的文件名       
          return this.state.fileList.map(file=>file.name)
      }
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,   
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
      /*
        fileList 有已经上传图片的数组 
        file:所有已上传图片文件对象的数组（上传）
      */
      handleChange =async ({ file,fileList }) => {
          console.log('handleChange',file)
          //一旦上传成功，将当前上传的file的信息修正（name,url）  
          // 为什么要修正？返回服务器中当前图片存储的名字和地址，然后修改本地存储图片的url和name
          if(file.status==='done'){
              const result = file.response  //{status:0,{name:'xxx.png},url:'图片地址'}
              if(result.status===0){
                  message.success('上传成功')
                  const {name,url} =result.data
                //   console.log('响应数据',result)
                  file = fileList[fileList.length-1]
                  file.name = name
                  file.url = BASE_IMG_URL + name
                //   console.log('url',BASE_IMG_URL + name)
                //   file.url = 'http://zlx.cool:5000/upload/'+name
              }
              else{
                  message.error('上传失败')
              }
          }
          else if(file.status==='removed'){
              //请求服务器删除该图片
              const result = await reqDeleteImg(file.name)
              if(result.status===0){
                  message.success('删除成功')
              }
              else{
                  message.error('删除失败')
              }
          }
          //在操作（上传/删除过程中更新filesList状态）
          this.setState(
          { fileList });
      }
      
    
    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
             </div>
        );
        return (
            <>
                <Upload
                action="/manage/img/upload"
                accept='image/*'  //只接收图片文件
                listType="picture-card"  //卡片样式
                name='image'  //请求参数名字
                fileList={fileList}   //所有已经上传图片文件对象的数组
                onPreview={this.handlePreview}  //显示指定file的图片的大图
                onChange={this.handleChange}
                >
                {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={this.handleCancel}
                >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        )
    }
}
