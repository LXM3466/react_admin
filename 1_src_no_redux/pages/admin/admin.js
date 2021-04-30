import React, { Component } from 'react'

import { Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import Header from '../../components/header/header'
import Left_nav from '../../components/left-nav/left_nav'

import memoryUtils from '../../utils/memoryUtils'
import Home from '../home/home' 
// import Category from './category/category' 
import Category from '../category/category' 
import Product from '../product/product' 
import Role from '../role/role' 
import User from '../user/user' 
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component{
    render() {
        const user = memoryUtils.user
        if(!user || !user._id){
        // <Redirect   user  undefined?
             console.log('没有数据在admin中，login没传过来',user)
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
                        <Route path='/home' component={Home}></Route>
                        <Route path='/category' component={Category}></Route>
                        <Route path='/role' component={Role}></Route>
                        <Route path='/product' component={Product}></Route>
                        <Route path='/user' component={User}></Route>
                        <Route path='/charts/bar' component={Bar}></Route> 
                        <Route path='/charts/line' component={Line}></Route>
                        <Route path='/charts/pie' component={Pie}></Route>
                        <Redirect to='/home'/>
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
