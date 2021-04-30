// product的添加和更新子路由组件

import React, { Component } from 'react'
import {Card,Form, Input,Cascader,Button, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button/link_button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api1/index'
import  PicturesWall from './picturesWall'
import RichTextEditor from './richTextEditor'

const Item = Form.Item
const {TextArea} = Input

export default class ProuctAddUpdate extends Component {
    constructor(props)
    {
      super(props)
      // 创建用来保存ref标识的标签对象的容器，并保存在组件对象的一个实例pw上
      this.pw = React.createRef()
      this.richDetail =  React.createRef()
    }    
    state={
      options:[]
    }
    initOptions=async (categorys)=>{
      // 初始化options的数据 用
     const options=  categorys.map(c=>
          ({
            value:c._id,
            label: c.name,
            isLeaf: false,  //动态决定
          })
        )
        //如果是一个二级分类商品的更新
        //isUpdate为真，修改的商品的话 就再此处在商品分类框选中当前商品所在的分类
      const {isUpdate,product} = this
      const {pCategoryId,categoryId} = product
      if(isUpdate && pCategoryId!=='0'){
        //获取对应的二级分类列表
        const subCas = await this.getCategorys(pCategoryId) 
        //生成二级下拉列表的options
        const childoptions = subCas.map(c=>({
          value:c._id,
          label: c.name,
          isLeaf: true,  //动态决定
        }))
        // 那么这个 targetOption.children是什么
        // 找到当前商品对应的一级option
        const targetOption = options.find(option=>option.value===pCategoryId)
        //关联对应的一级option上面
        targetOption.children = childoptions
      }

      //更新状态
      this.setState({options})
    }
    // send=async ()=>{
    //   const result = await reqAddOrUpdateProduct(
    //     {name:'商品15',price:'520',
    //     pCategoryId:'5f33e54fb1719c574aa7de4b',
    //     categoryId:'5f33e58fb1719c574aa7de54',
    //     _id:'5fd1fc78b1719c574aa7de88',
    //     desc:'66666666'
    //   })
    // }
    //异步获取一级/二级分类列表，并显示
    getCategorys =async (parentId)=>{
        const result = await reqCategorys(parentId)
        if(result.status===0){
           const categorys = result.data
           if(parentId==='0')
           {
             //获取一级列表
             this.initOptions(categorys)
           }
           else{
              //获取二级列表
              return categorys    //返回promise实例，且返回的value值为categorys
           }
           
        }
    }
    UNSAFE_componentWillMount(){
      //第一次render之前执行一次  取出携带的product
      const product = this.props.location.state 
      this.isUpdate = !!product //判断是点击的添加还是修改  若是修改 则为真  否则为假
      this.product = product || {}
    }
    componentDidMount(){
      this.getCategorys('0')
    }
    render() {    
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        // console.log(product)
        // 用来接收级联输入分类ID的数组
        const categoryIds = []
        if(isUpdate){
          //如果是一级分类列表
          if(categoryId==='0'){
            categoryIds.push(categoryId)
          }
          else{
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
          }
        }
        const title=(
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>
                  {
                    isUpdate?'修改商品':'添加商品'
                  }
                </span>
            </span>
        )
        //指定Item布局的配置对象
        const layout = {
            labelCol: {
              span:2,   //左侧label的宽度
            },
            wrapperCol: {
              span: 10,    //指定右侧包裹的宽度
            },
          };
        const onFinish = async (values) => {
          console.log('Success:', values);   
          const {categoryIds,desc,name,price}   =values
          //categoryId是一个数组，如果长度为1 则表示是一级分类如果长度是2则是二级分类
          const imgs = this.pw.current.getImgs()
          const detail = this.richDetail.current.getHtmlText()          
          // let 
          console.log('imgs:', imgs);  
          console.log('desc_html:', detail);  
          // 1. 收集数据
          let pCategoryId = ''
          let categoryId = ''
          // const product = {name,price,desc_html,imgs}
          if(categoryIds.length===1){
            //选择了一级分类
            pCategoryId='0'
            categoryId = categoryIds[0]
          }
          else{
            pCategoryId= categoryIds[0]
            categoryId = categoryIds[1]
          }
          const product = {name,price,desc,detail,imgs,pCategoryId,categoryId}
          if(isUpdate) //如果是更新
          {
              product._id = this.product._id
          }
          // 2. 调用接口请求函数去添加/更新
          console.log('product',product)
          const result = await reqAddOrUpdateProduct(product)
          // 3.根据结果提示
         
          if(result.status===0)
          {
            message.success(`${product._id?'更新':'添加'}商品成功`)
            this.props.history.goBack()
          }
          else{
            message.error(`${product._id?'更新':'添加'}商品失败`)
          }

        };
        
        // 用来加载下一级列表的回调函数
        const loadData = selectedOptions => {
          //得到当前选择的option对象
          const targetOption = selectedOptions[0];
          targetOption.loading = true;     
         
          //模拟请求异步获取二级分类列表数据
          setTimeout(async () => {
               
            const subCategorys = await this.getCategorys(targetOption.value)
            //关联到当前option中 
            targetOption.loading = false;  
            if(subCategorys && subCategorys.length>0){
                targetOption.children=  subCategorys.map(c=>
                ({
                  value:c._id,
                  label: c.name,
                  isLeaf: true,  //动态决定
                }))
            } 
            else{
              //否则当前中的分类没有二级分类
              targetOption.isLeaf=true
            }
            
            // targetOption.children = subCategorys
          
            this.setState({options:[...this.state.options]})
            // setOptions([...options]);
          }, 1000);
        };
        return (
            <Card title={title}  >
                <Form {...layout} onFinish={onFinish}>
                    <Item         
                        initialValue={isUpdate?product.name:''}             
                        label="商品名称：" 
                        name="name"
                        // name={['name', '商品名称：']}
                        rules={[{ required: true,message:'必须输入商品名称'}]}
                    >
                        <Input type="text"/>
                    </Item>
                    <Item 
                        initialValue={isUpdate?product.desc:''}    
                        label="商品描述："
                        name="desc"
                        rules={[{ required: true,message:'必须输入商品描述'}]}
                    >
                        <TextArea autosize placeholder="请输入商品描述" />                    
                    </Item>
                    <Item 
                        initialValue={isUpdate?product.price:''}    
                        label="商品价格："
                        name="price"
                        rules={[
                            {
                              required: true,
                              message: '必须输入商品价格',
                            },
                            {
                                validator:(_, value) =>
                                value*1>0 ? Promise.resolve() : Promise.reject(new Error('价格必须大于1')),
                            },
                          ]}
                    >                   
                        <Input type="number" addonAfter="元"/>
                    </Item>
                    <Item 
                       initialValue={categoryIds}
                       label="商品分类："
                       name="categoryIds"
                       rules={[
                            {
                              required: true,
                              message: '必须制定商品分类',
                            }
                      ]}
                    >
                       <Cascader 
                          placeholder="please select"
                          options={this.state.options}   //需要显示的列表数据数组，
                          loadData={loadData}   //当选择某个列表项，加载下一级列表的监听回调
                        />
                    </Item>
                    <Item  label="商品图片：">
                       <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item  label="商品详情：">
                       <RichTextEditor ref={this.richDetail} detail={detail}/>
                    </Item>
                    <Item  >                  
                        <Button type="primary"  htmlType="submit">提交</Button>
                    </Item>
                    {/* <Button onClick={this.send}>按钮</Button> */}
                </Form>
                
            </Card>
        )
    }
}
