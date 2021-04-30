/*
商品分类路由
*/ 
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import ProductHome from './home'
import ProductDetail from './detail'
import ProuctAddUpdate from './add-update'
import './detail.less'
export default class Product extends Component {
    render() {
        return (
          <Switch>
            {/* 注册路由组件 */}
            <Route path='/product' component={ProductHome} exact/>   {/*完全匹配 */}
            <Route path='/product/addUpdate' component={ProuctAddUpdate}/>
            <Route path='/product/detail' component={ProductDetail}/> 
            <Redirect to='/product'/>           
          </Switch>
        )
    }
}
