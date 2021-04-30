import React, { Component } from 'react'
import { Form ,Select,Input} from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;
const Option = Select.Option;
// 添加分类类的from组件   
export default class AddForm extends Component {
    formRef = React.createRef();
    static propTypes={
        setForm: PropTypes.func.isRequired,   //用来传递form对象的函数
        categorys:PropTypes.string.isRequired, //一级分类的数组
        parentId:PropTypes.string.isRequired,  //父分类的ID
    }

    UNSAFE_componentWillMount(){
        //传入form对象
        this.props.setForm(this.formRef)
        // console.log('UNSAFE_componentWillMount--this.setForm',this.setForm)
    }
    componentDidMount(){
        console.log('componentDidMount--this.setForm',this.setForm)
    }
    render() {
        const {categorys,parentId} = this.props;
        return (
            <Form ref={this.formRef} initialValues={{ parentId:parentId }}>
                <Item name='parentId'>
                    <Select>
                        <Option value='0'>一级分类 </Option>
                        {
                            categorys.map((category)=>{
                                return (
                                    <Option value={category._id} key={category._id}>{category.name} </Option>
                                )
                            }
                            )
                        }
                    </Select>
                </Item>
                <Item name='categoryName' rules={[{ required: true, message: '请输入分类名称' }]}>
                    <Input  placeholder='请输入分类名称' />
                </Item>
            </Form>
        
             
            // <Form onFinish={onFinish}>
            //     <Form.Item name="username" rules={[{ required: true }]}>
            //         <Input />
            //     </Form.Item>
            // </Form>
          
        // <Form
        // name="normal_login"
        // className="login-form"
        // initialValues={{
        //     remember: true,
        // }}
        // onFinish={onFinish}
        // >
        // <Form.Item
        //     name="username"
        //     rules={[
        //         { required: true,whitespace:true, message: '请输入你的用户名!'},
        //         { min: 4, message: '用户名至少4位'},
        //         { max: 12, message: '用户名最多12位'},
        //         {pattern:/^[a-zA-Z0-9_]+$/, message: '密码只能是字母、数字和下划线的组合'}
        //     ]}
        // >
        //     <Input placeholder="Username" />
        // </Form.Item>
        // <Form.Item
        //     name="password"
        //     rules={[
        //         { required: true,whitespace:true, message: '请输入你的用户名!'},
        //         { min: 4, message: '用户名至少4位'},
        //         { max: 12, message: '用户名最多12位'},
        //         {pattern:/^[a-zA-Z0-9_]+$/, message: '密码只能是字母、数字和下划线的组合'}
        //     ]}
        // >
        //     {/*   prefix={<LockOutlined className="site-form-item-icon" />}
        //     type="password"
        //     placeholder="Password" */}
        //     <Input type="password"/>
        // </Form.Item>

        // <Form.Item>
        //     <Button type="primary" htmlType="submit" className="login-form-button">
        //          登陆
        //     </Button>
        // </Form.Item>
        // </Form>
        )
    }
}
