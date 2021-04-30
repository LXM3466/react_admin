import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import {reqLogin} from '../../api/index'
export default class Login extends Component {
    // 自定义的验证
    validatePwd = (rule,value,callback)=>{
        // console.log('validatePwd',rule,value)
        // callback（）为验证通过
        // callback（xxx）为验证失败
            if(!value)  {callback('密码不能为空')}
            else if(value.length<4) { callback('密码长度不能小于4')}
            else if(value.length>12) { callback('密码长度不能大于12')}
            else if(!/^[a-zA-Z0-9_]+$/.test(value)){
                callback('密码只能是字母、数字和下划线的组合')
            }
            else {callback()}
    }
    render() {
        const onFinish =async (values) => {
            console.log('Received values of form: ', values);
            // 验证成功
            if(values) {
                //console.log('Received values of form，发送ajax请求', values);
                // reqLogin(values.username,values.password).then(response =>{
                //     console.log('成功了',response.data)
                // }).catch(error=>{
                //     console.log('检验失败了',error)
                // })
                const {username,password} = values;
                const response = await reqLogin(username,password)
                const result= response.data
                if(result.status===0)
                {
                    // 提示登陆成功
                    console.log('成功了',response.data)
                    message.success('登陆成功')
                    // 跳转到后台管理界面(不需要再回退到登陆界面 所以用replace而不是push)
                    this.props.history.replace('/home')
                }
                else{
                    //登陆失败  提示错误信息
                    message.error(result.msg)
                }  
                // try{
                //     console.log('成功了',response.data)
                // }
                // catch(error){
                //     console.log('检验石失败了',error.message)
                // }
            }
            else{
                console.log('检验失败');
            }          
        };
        return (
         <div className="Login">
            <header className="Login-header" >
                <img src={logo}  alt="logo"/>
                <h1>React项目：后台管理系统</h1>
            </header>
            <section className="Login-content">
                <h2>用户登陆</h2>   
                <Form
                    name="normal_login"
                    className="Login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { validator: this.validatePwd}
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true,whitespace:true, message: '请输入你的用户名!'},
                            { min: 4, message: '用户名至少4位'},
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
