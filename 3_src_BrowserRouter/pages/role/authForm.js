import React, { Component } from 'react'
import {Tree,Form, Input} from 'antd'
import PropTypes from 'prop-types'
// 根据该menuList数组生成树的标签结构数组
import menuList from '../../config/menuConfig'
const Item = Form.Item
export default class AuthForm extends Component {
    state = {
        checkedKeysValue:[]
    }
    
    constructor(props){
        super(props)
        //根据传入的角色的menus生成初始状态
        const {menus} = this.props.role
        // console.log('constructor',menus)
        this.state = {           
            checkedKeysValue: menus
        }

    }
    static propTypes={
        role:PropTypes.object
    }
 
    onCheck = checkedKeysValue => {
        // console.log('onCheck', checkedKeysValue);
        this.setState({checkedKeysValue})
    }
    //为父组件提供/读取最新的menus
    getMenus =()=> this.state.checkedKeysValue
    //根据新传入的role来更新checkedKeysvalue //只有组件接收到新的属性的时候这个钩子才会使用（在render之前）
    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeysValue:menus
        })
    }
    render() {  
        const {role} = this.props
        const {checkedKeysValue} = this.state
        console.log('role:',role.menus)
        console.log('checkedKeysValue:',checkedKeysValue)

        const dataRole = [
            { 
                title: '平台权限', // 菜单标题名称 
                key: 'all', // 对应的 path 
                children:[
                    ...menuList
                ]
          }
        ]
        return (         
            <div>
                <Item label='角色名称'>
                    {/* input的value值由父组件role传过来 为当前选择的role的name值 */}
                    <Input  value={role.name} disabled/>
                </Item>
                <Item>
                    <Tree
                        // selectedKeys={}
                        checkable  //是否选中   
                        defaultExpandAll='true'  
                        checkedKeys={checkedKeysValue}     //会自动匹配合适的key/path值  
                        // onSelect={onSelect}
                        onCheck={this.onCheck}
                        treeData={dataRole}
                    />
                </Item>
            </div>
        )
    }
}
