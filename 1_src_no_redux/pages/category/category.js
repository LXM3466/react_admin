import React, { Component } from 'react'
import { Card,Button ,Table, message,Modal} from 'antd';
import { PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button/link_button'
import {reqCategorys,reqAddCategorys,reqUpdateCategorys} from '../../api1/index'
import  AddForm from './add-form'
import UpdateForm from './update_form'
/*
  商品分类路由
*/ 
export default class Category extends Component {
  formRef = React.createRef();
  formRef_ADD = React.createRef();
  state = {
      loading:false, //数据是否加载中
      categorys:[],  //一级分类列表    
      subCategory:[], //二级分类列表
      parentId:'0',//当前需要显示的分类列表的父分类parentId
      parentName:'',//当前需要显示的分类列表的父分类名称
      showStatus: 0, //标识添加/更新的确认框是否显示  0：都不显示  1：显示添加 2：显示更新
  }
      //点击展示子分类按键
  showSubCategory =(category)=>{
      // const {parentId} = this.state
      this.setState({
        parentId:category._id,
        parentName:category.name
        },
        //  console.log('parentId',parentId),
        ()=>{
        //  console.log('parentId',parentId),
          this.getCategorys() 
        }
          
      ) 
    //   console.log('parentId',parentId)
    //  this.getCategorys()
      
  }
      /* 初始化Table所有列的数组 */
  initColumns =() =>{
    this.columns = [
          {
            // 每一列有三个属性
            title: '分类的名称',
            dataIndex: 'name',                   
          },
          {
            title: '操作', 
            width:300,
            //render会得到categorys的每一项数据
            render: (category) => (  //返回需要显示的界面标签
              <span>
                  <LinkButton onClick={ ()=>this.showUpdate(category)}>修改分类</LinkButton>
                  {this.state.parentId ==='0'? 
                  <LinkButton onClick= {()=>this.showSubCategory(category)}>查看子分类</LinkButton>:null
                  }
                  
              </span> )           
          }
        ]
  }   
    //获取一级/二级分类列表
  getCategorys = async (parentId) =>{
    //在发请求前，显示loading
    this.setState({loading:true})
    // 有入口参数parentId就等于入口参数的值 否则为state状态中的值
    parentId = parentId||this.state.parentId
    
    //发异步ajax请求
    const  result = await reqCategorys(parentId)
    //请求完成后，隐藏loading
    this.setState({loading:false})
    if(result.status ===0)
    {
      const categorys = result.data
      if(parentId==='0'){
        this.setState({categorys})
      }
      else{
        this.setState({subCategory:categorys})
      }      
    }
    else
    {
      message.error('请求分类列表失败')
    }
  }

/*
 为第一次render()准备数据、展示的是二级分类组件
*/
  showCategory=(category)=>{
    //将每一项存起来  递给updateForm组件使用  category可能为空对象为了不报错需要这样写
    this.category = category || {};
    //更新显示为1级列表的状态
    this.setState({
      parentId:'0',
      parentName:' ',
      subCategory:[]
    })
  }
  /*
    响应点击取消：隐藏确定框
  */
  handleCancel_add=() =>{
    this.setState({
      showStatus:0
    })
    this.formRef_ADD.current.resetFields()
  }
  handleCancel_update=() =>{
    this.setState({
      showStatus:0
    })  
  }
  addCategory= async () =>{

  // 收集数据 并提交添加分类的请求  为甚么这里就this.formRef_ADD.current.一次就行。。。烦恼哦
    // const {categoryName,parentId} =  this.formRef_ADD.current.getFieldsValue()
    // const result = await reqAddCategorys({parentId,categoryName})
    // if(result.status === 0){
    //   //重新获取分类列表显示  当添加的分类和当前显示的分类在同一级别时才重新更新列表
    //   if(parentId === this.state.parentId)
    //       this.getCategorys();
    //   else if(parentId === '0')//在二级分类列表中添加一级分类列表，重新获取一级分类列表，但不需要显示一级列表
    //   {
    //     this.getCategorys('0');
    //   }
    // }

    // else{
    //   message.error('添加分类失败')
    // }
    // this.formRef_ADD.current.resetFields()
    this.formRef_ADD.current.validateFields().then(
      async (value)=>{       
        // 隐藏对话框
        this.setState(
          {
            showStatus:0
          }    
        )
        //收集数据  根据Item的name收集得到
        const {categoryName,parentId} = value;
        this.formRef_ADD.current.resetFields()
        const result = await reqAddCategorys({parentId,categoryName})
        if(result.status === 0){
          //重新获取分类列表显示
          this.getCategorys();
        }
        else{
          message.error('添加分类失败')
        }
      }
    )
    // 清chu输入数据
    // this.formRef_ADD.current.resetFields()
  }
  /*
    显示更新的确认框
  */
  updateCategory = ()=>{
    //有个前提条件，就是表单验证通过才能执行以下代码 this.formRef.current.formRef.current两次是什么操作
    this.formRef.current.formRef.current.validateFields().then(
      async (value)=>{
          // if(!err){
            // 隐藏对话框
            this.setState({showStatus:0})
            // 准备数据
            const categoryId =this.category._id           
            const {categoryName} = value
            // 发更新请求
            const result=await reqUpdateCategorys(categoryId,categoryName)
            if(result.status===0){
                //3.重新显示列表
              this.getCategorys()   
            }
      }
    )
  }
  /*
    显示添加的确认框
  */
  showAdd=()=>{
    // 
    this.setState({
      showStatus:1
    })
  }
  showUpdate=(category)=>{
    this.category = category;
    this.setState({
      showStatus:2
    })
  }
  UNSAFE_componentWillMount(){
    this.initColumns()
  }

/*
  发送异步ajax请求
*/
  componentDidMount(){
      this.getCategorys()
  }

  render() {
      //读取状态数据
      const {categorys,parentName,loading,parentId,subCategory} = this.state
      const category = this.category  || {}
      //card的左侧

      const title=  parentId==='0'? '一级分类列表':(
        <span>
            <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
            <ArrowRightOutlined style={{marginRight:'5px'}}/>
            <span>{parentName}</span>
        </span>
      )      
      const extra =(
          <Button type='primary' onClick={this.showAdd}>
              < PlusOutlined />
              添加
          </Button>
      )
      return (
        <Card title={title} extra={extra} >
          <Table 
              dataSource={ parentId==='0'? categorys:subCategory}
              rowKey = '_id'
              bordered
              columns={this.columns}
              loading={loading}
              pagination={{defaultPageSize:4,showQuickJumper:true}}     
              // pagination={{current: 1,pageSize: 3}}               
          />         
          <Modal title="添加分类" 
                visible={this.state.showStatus===1} 
                onOk={this.addCategory} 
                onCancel={this.handleCancel_add}>
               <AddForm setForm={(formRef)=>{this.formRef_ADD = formRef }}  
                        categorys={categorys}
                        parentId = {parentId}
          />
          </Modal> 
          <Modal title="更新分类" 
                visible={this.state.showStatus===2} 
                onOk={this.updateCategory} 
                onCancel={this.handleCancel_update}>
            {/* <UpdateForm categoryName={category.name }/> */}
            <UpdateForm ref={this.formRef} categoryName={category.name}/>
          </Modal>            
        </Card>
      )
}
}
