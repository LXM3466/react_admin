import React, { Component } from 'react'

import { Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import Header from '../../components/header/header'
import Left_nav from '../../components/left-nav/left_nav'


import Home from '../home/home' 
import Category from '../category/category' 
import Product from '../product/product' 
import Role from '../role/role' 
import User from '../user/user' 
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not_found/not_found'
import { connect } from 'react-redux';

const { Footer, Sider, Content } = Layout;

class Admin extends Component{
    render() {
        const user = this.props.user   //user一旦变了  组件会自动更新
        if(!user || !user._id){
            // console.log('没有数据在admin中，login没传过来',user)
            return <Redirect to ='/login'/>
        }
        return (
          <Layout style={{minHeight:'100%'}}>
            <Sider>
                <Left_nav/>
            </Sider>
            <Layout>
                <Header/>
                {/* <Content style={{backgroundColor:'#fff'}}>     */}
                    {/* <Home/>  注册路由  什么时候要链接路由*/}
                    <Content  style={{margin:20, backgroundColor:'#fff'}}>
                      <Switch>   
                        {/* 如果请求的是根路径（必须开启精确匹配。不然/后面不管是什么都会直接跳到home路径） 相当于直接转到home */}
                        <Redirect exact={true} from='/' to='/home'/>                  
                        <Route path='/home' component={Home}></Route>
                        <Route path='/category' component={Category}></Route>
                        <Route path='/role' component={Role}></Route>
                        <Route path='/product' component={Product}></Route>
                        <Route path='/user' component={User}></Route>
                        <Route path='/charts/bar' component={Bar}></Route> 
                        <Route path='/charts/line' component={Line}></Route>
                        <Route path='/charts/pie' component={Pie}></Route>
                        <Route component={NotFound}/>        {/*上面没有一个时匹配的 路径path不需要再定义*/}               
                     </Switch>      
                    </Content>
                            
                {/* </Content> */}
                  {/* Route分别接收两个属性：path 和 component 属性 */}                             
                <Footer  style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面体验操作</Footer>
            </Layout>
          </Layout> 
        )
    }
}
export default  connect(
  state=>({user:state.user}),
  {}
)(Admin)