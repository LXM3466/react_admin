import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form ,Select,Input} from 'antd';
// import { FormItemPrefixContext } from 'antd/lib/form/context';
const Item = Form.Item;
const Option = Select.Option;
// 添加分类类的from组件   
export default class UpdateForm extends Component {
    static propTypes={
        categoryName: PropTypes.string.isRequired
    }
    formRef = React.createRef();
    componentDidUpdate() {
        //更新之后将form表单内容设置为modal传过来的值
        this.formRef.current.setFieldsValue({
            categoryName: this.props.categoryName,
        });
        // console.log()
    }
    render() {
        // const onFinish =  (values) => {
        //     console.log('Success:', values);        
        // };
        const {categoryName} =  this.props
        return (
            <Form ref={this.formRef} initialValues={{ categoryName: categoryName }}>      
                <Item name='categoryName' rules={[{ required: true, message: '请输入分类名称' }]}>
                    <Input  placeholder='请输入分类名称' />
                </Item>
                {/* <Item name='username' >
                    <Input  placeholder='请输入分类名称'
                            rules={[{ required: true, message: '请输入分类名称' }]} />
                </Item> */}
            </Form>
        )
    }
}
