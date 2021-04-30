// product的主页面--子路由组件

import React, { Component } from 'react'
import {Card,Select,Table,Button,Input, message} from 'antd'
import { PlusOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button/link_button'
import {reqProducts,reqSearchProducts,reqUpdateSatatus,reqAddOrUpdateProduct} from '../../api1/index'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option
export default class ProductHome extends Component {
    state = {
        total:0,         //商品的总数量
        products:[],
        loading:false,   //加载的状态
        searchType:'productName',  //搜索类型 只有两种 productName/productDesc
        searchName:''
    }
    // 初始化table的列的数组
    initColumns =()=>{
        this.columns =[
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'age',
              },
              {
                title: '价格',
                dataIndex: 'price',
                render:(price) => '￥'+price//返回需要显示的界面标签             
              },
              {
                  width:100,
                  title: '状态',
                //   dataIndex: 'status',
                  render:(product)=>{
                      const {_id,status} = product
                      return (
                          <span>
                             <Button type="primary" onClick={()=>this.updateStatus(_id,status===1?2:1)}>{status===1?'下架':'上架'}</Button>
                             <span>{status===1?'在售':'已下架'}</span>
                          </span>
                      )
                  }
                  // dataIndex: 'address',
                  // key: 'address',
              },
              {
                  width:100,
                  title: '操作',
                //   dataIndex: 'product',
                  render:(product)=>{
                      return (
                          <span>
                              {/* 通过state传给ProductDetail路由组件 */}
                              <LinkButton onClick={()=>{this.props.history.push('/product/detail',{product})}}>详情</LinkButton>
                              <LinkButton onClick={()=>{this.props.history.push('/product/addUpdate',product)}}>修改</LinkButton>
                          </span>               
                      )
                  }
                  // dataIndex: 'address',
                  // key: 'address',
              },
        ]
    }
    // send =async ()=>{
    //     const result = await reqAddOrUpdateProduct(
    //         {name:'商品15',price:'520',
    //         pCategoryId:'5f33e54fb1719c574aa7de4b',
    //         categoryId:'5f33e58fb1719c574aa7de54',
    //         _id:'5fd1fc78b1719c574aa7de88',
    //         desc:'66666666'
    //       })
    // }
    //获取指定页码的列表数据列表
    getProducts=async (pageNum)=>{
        this.pageNum = pageNum  //保存当前页码 供其他方法使用
        //流程：发请求，然后判断结果返回是否正常，正常就结构赋值获取需要的数据，然后更新状态
        this.setState({loading:true})//显示loading
        const {searchName,searchType} = this.state
        let result
        //输入框有值才搜索
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName}) 
        }
        else{
            result =await reqProducts(pageNum,PAGE_SIZE)
        }       
        this.setState({loading:false})//隐藏loading
        if(result.status===0)
        {
            //list为当前页的数据数组
            const {total,list} = result.data
            this.setState({total,
                products:list
            })
        }
       
    }
    updateStatus=async (productId,status)=>{
        const result=await reqUpdateSatatus(status,productId) 
        if(result.status===0){
            //更新成功
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render() {
        const {total,products,loading,searchType,searchName} = this.state
        const   title = (
            <span>
                <Select 
                    style={{ width: 150 }}    
                    value={searchType}    
                    onChange= {(value=>{this.setState({searchType:value})})}   
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{margin:'0 15px',width:150}} 
                    value={searchName}
                    onChange={(event)=>{this.setState({searchName:event.target.value})}}
                />
                <Button type="primary" onClick={()=>this.getProducts(1)} >搜索</Button>
            </span>                   
        )
        const  extra=(
            <Button type='primary' onClick={()=>{this.props.history.push('/product/addUpdate')}}>
                < PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>       
                <Table 
                    loading={loading}
                    dataSource={products} 
                    columns={this.columns} 
                    //total为总记录数 即商品的总记录数
                    pagination={
                        {
                            current:this.pageNum,
                            total,
                            defaultPageSize:PAGE_SIZE,
                            showQuickJumper:true,
                            onChange:this.getProducts,
                            // onChange:(pageNum)=> this.getProducts(pageNum)//等同于
                        }}     
                />;
                {/* <Button onClick={this.send}>按钮</Button> */}
            </Card>
        )
    }
}
