import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import './login.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqLogin}  from '../../api1/index'
import { Redirect } from 'react-router';
export default class Login extends Component {
    render() {

        //如果用户已经登陆，则自动跳转到管理界面
        const  user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/admin'/>
        }

        const onFinish = async (values) => {
            // 验证成功
            if(values){
                console.log('验证成功：'+values)    
                const {username,password}= values;
                const response = await reqLogin(username,password);
                const result = response;
                const user = result.data
                if(result.status===0)
                {
                    // 登陆成功
                    console.log('登陆成功',user)
                    message.success('登陆成功')
                    memoryUtils.user = user   //保存到内存中
                    storageUtils.saveUser(user) //保存到本地
                    this.props.history.replace('/admin')
                }
                else{
                    // 登陆失败
                    console.log('登陆失败')
                    message.error('登陆失败')
                }
            }
            // 验证失败
            else{
                console.log('验证失败')
            }
        };
        return (
            <div className="Login">
                <header className="Login_header">
                  <img src={logo} alt="logo"/>
                  <h1>react项目：后台管理系统</h1>
                </header>
                <section className="Login_section">
                  <h2>用户登录</h2>
                  <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true,whitespace:true, message: '请输入你的用户名!'},
                            { min: 3, message: '用户名至少3位'},
                            { max: 12, message: '用户名最多12位'},
                            {pattern:/^[a-zA-Z0-9_]+$/, message: '密码只能是字母、数字和下划线的组合'}
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true,whitespace:true, message: '请输入你的密码!'},
                            { min: 3, message: '密码至少3位'},
                            { max: 12, message: '用户名最多12位'},
                            {pattern:/^[a-zA-Z0-9_]+$/, message: '密码只能是字母、数字和下划线的组合'}
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                             登陆
                        </Button>
                    </Form.Item>
                  </Form>
                </section>
            </div>
        )
    }
}
