import React, { Component } from 'react'
import { Form ,Select,Input} from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;

// 添加分类类的from组件   
//这个不是路由组件  所以不能直接用ref和this.setform.current来获取本组件的属性
export default class AddForm extends Component {
    formRef = React.createRef();
    //告诉外部通过form求取数据
    static propTypes={
        formRef: PropTypes.func.isRequired,   //用来传递form对象的函数
    }

    UNSAFE_componentWillMount(){
        //传入form对象
        this.props.formRef(this.formRef)
        // console.log('UNSAFE_componentWillMount--this.setForm',this.setForm)
    }
    // componentDidMount(){
    //     console.log('componentDidMount--this.setForm',this.formRef)
    // }
    render() {
        return (
            <Form ref={this.formRef} >               
                <Item 
                    label='角色名称:'
                    name='roleName' 
                    rules={[{ required: true, message: '请输入角色名称' }]}>
                    <Input  placeholder='请输入角色名称' />
                </Item>
            </Form>
        )
    }
}
