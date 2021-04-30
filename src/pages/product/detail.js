// product的详情子路由组件
import React, { Component } from 'react'
import {Card,List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button/link_button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api1/index'
import memoryUtils from '../../utils/memoryUtils'
const Item = List.Item

export default class ProductDetail extends Component {
    state = {
        cName1:'',  //一级分类的名称
        cName2: '', //二级分类的名称
    }
    async  componentDidMount(){
      // categoryId是当前分类的ID，pCategoryId是父分类的ID ，如果当前分类是一级分类的时候  父分类ID为0
      // 得到当前商品分类的ID
      
      const {pCategoryId,categoryId} = memoryUtils.product
      if(pCategoryId==='0') //一级分类下的商品
      {
          const result = await  reqCategory(categoryId)  //查找当前分类的ID
          this.setState({cName1:result.data.name})
      }
      else{
        //   通过多个await方式发送多个请求：后面一个请求是前一个请求成功返回之后才发送的
        //   const result1 = await  reqCategory(pCategoryId) 
        //   const result2 = await reqCategory(categoryId)
        //   const cName1 = result1.data.name
        //   const cName2 = result2.data.name
        // 一次性发送多个请求，只有都成功了  才处理
          const results =await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
          console.log(results)
          const cName1 = results[0].data.name
          const cName2 = results[1].data.name || ''
          this.setState({
            cName1,
            cName2
        })
      }

    }
    componentWillUnmount(){
        //卸载之前清除保存的数据  退出不清楚数据很危险
        memoryUtils.product = {}
      }
    render() {
        const title=(
            <span> 
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined 
                        style={{marginRight: 10,fontSize:15}                       
                    }/> 
                </LinkButton>
                
                <span>商品详情</span>
            </span>           
        )
        const {cName1,cName2} =this.state
        const {price,detail,name,desc,imgs} = memoryUtils.product
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item bordered={true}>
                        <span className="prodct-item">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item bordered={true}>
                        <span className="prodct-item">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item bordered={true}>
                        <span className="prodct-item">商品价格</span>
                        <span>{price}</span>
                    </Item>
                    <Item bordered={true}>
                        <span className="prodct-item">所属分类</span>
                        <span>{cName1}{cName2?'-->'+cName2:''}</span>
                    </Item>
                    <Item bordered={true}>
                        <span className="prodct-item">商品图片</span>
                        {/* <span>
                            <img 
                                src='http://zlx.cool:5000/upload/image-1607597171738.jpg'
                                // key={Img}
                                className="product_img"
                                alt='img'/>
                        </span> */}
                        <span>
                            {
                             imgs.map( Img=>
                                <img 
                                    src={BASE_IMG_URL+Img}
                                    key={Img}
                                    className="product_img"
                                    alt='img'
                                />
                            
                            ) 
                            }                         
                        </span>
                    </Item>
                    <Item bordered={true}>
                        <span className="prodct-item">商品详情：</span>
                        <span className="prodct-span-img"  dangerouslySetInnerHTML={{__html:detail}}/>
                    </Item>            
                </List>
            </Card>
        )
    }
}
