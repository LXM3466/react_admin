import React, { Component } from 'react'
// import { Button } from 'antd';
import {Route,Switch,BrowserRouter} from 'react-router-dom'
import Login from './pages/login1/login'
import Admin from './pages/admin/admin'
// import { connect } from 'react-redux'

export default class App extends Component {
    render() {
        console.log('子路由组件'+this.props.children)
        return (
            <BrowserRouter>           
                    <Switch>
                        <Route path='/login' component={Login}></Route>
                        <Route path='/' component={Admin}></Route>
                        {/* <Route path='/home' component={Home}></Route> */}
                        {/* <Redirect to='/login' */}
                    </Switch>                    
                {/* </BrowserRouter> */}
            </BrowserRouter>
        )
    }
}
// export default connect(
//     // state通过store传进来，在redux中保存
//     state=>({user:state.user})
// )(App)
