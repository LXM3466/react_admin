import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'
const Item = Form.Item
export default class UpdateUser extends Component {
    formUpdate = React.createRef()
    static propTypes = {
        formUpdate: PropTypes.func.isRequired, 
    }
    UNSAFE_componentWillMount(){
        this.props.formUpdate(this.formUpdate)
    }
    render() {
        const layout = {
            labelCol: { span: 5},
            wrapperCol: { span: 16 },
          };
        const user = this.props.user
        console.log('user',user)
        return (
            <Form 
                ref={this.formUpdate} 
                {...layout} 
                name="修改用户"
                initialValues={{ username: user.username,email:user.email,phone:user.phone }}
            >
                <Item 
                    label="用户名" 
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="用户名" />
                </Item>
                <Item 
                    label="邮箱" 
                    name="email"
                    rules={[{ required: true, message: '请输入用户邮箱' }]}
                >
                  <Input  placeholder="邮箱"/>
                </Item>
                <Item 
                    label="电话" 
                    name="phone"
                    rules={[{ required: true, message: '请输入用户电话' }]}
                >
                  <Input  placeholder="phone" />
                </Item>
            </Form>
        )
    }
}
