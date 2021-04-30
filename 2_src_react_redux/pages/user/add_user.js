import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select} from 'antd'
const Option = Select.Option
const Item =Form.Item
export default class AddOrUpdateUser extends Component {
   formRef = React.createRef()
   static propTypes={
    setForm: PropTypes.func.isRequired,   //用来传递form对象的函数
    roles:PropTypes.array.isRequired, 
    user:PropTypes.object
   }
   UNSAFE_componentWillMount(){
       this.props.setForm(this.formRef)
   }
    render() {
        const {roles} = this.props
        const user = this.props.user || {}
        console.log('updateuser',user)
        const layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
          };
        return (
            <Form 
                name="添加/修改用户" 
                ref={this.formRef}
                {...layout}
                initialValues={{
                    username: user.username,
                    password:user.password,
                    email:user.email,
                    phone:user.phone,
                    role_id:user.role_id
                }}
            >
                <Item 
                    name="username" 
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder='请输入用户名称'/>
                </Item>
                {
                    user._id?null:(<Item 
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input  type="password" placeholder='请输入用户密码'/>
                    </Item>)
                }
                <Item 
                    label="电话" 
                    name="phone"
                    rules={[{ required: true, message: '请输入用户电话' }]}
                >
                    <Input placeholder='请输入用户手机号'/>
                </Item>
                <Item 
                    label="邮箱" 
                    name="email"
                    rules={[{ required: true, message: '请输入用户邮箱' }]}
                >
                    <Input placeholder='请输入用户邮箱'/>
                </Item>   
                <Item 
                    label="角色" 
                    name="role_id"                   
                >
                   <Select>
                    {
                       roles.map(role=>
                              <Option key={role._id} value={role._id}>
                                {role.name}
                              </Option>
                          )
                    }
                   </Select>
                </Item>                       
            </Form>
        )
    }
}
