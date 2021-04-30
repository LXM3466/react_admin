import React, { PureComponent } from 'react'
import {Card,Button,Table, Modal, message}  from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqAddRole, reqRoleList,reqUpdateRole } from '../../api1/index'
import AddForm from './add-form'
import AuthForm from './authForm'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
/*
    角色管理路由
*/ 
export default class Role extends PureComponent {
    formRef = React.createRef();
    state = {
        roles:[],  //全部角色
        role:{} , //当前选中的角色
        isModalVisible:false , //是否显示对话框
        isShowAuth:false
    }
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    initColumns=()=>{
        this.columns=[
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '创建时间',
                dataIndex: 'create_time',
                render:(create_time)=>formateDate(create_time)
              },
              {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
              },
              {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
              },
        ]
    }
    onRow=(role)=>{
        //每一行对应一个role对象 
        //点击后做什么事情呢？ 点击完毕更新当前选中的role   
        return{
            onClick: event=>{
                console.log(role)
                // alert('点击行')
                this.setState({role})
            }
        }
    }
    addRole =async ()=>{
        const {roleName} = this.formRef.current.getFieldsValue()
        // console.log(roleName)
        const result =await  reqAddRole(roleName)
        this.formRef.current.resetFields()
        if(result.status===0)
        {
            // this.getRoleLists()
            //后台直接返回添加角色的相关数据 所以不用再发请求来更新当前列表 提升效率
            const role = result.data 
            //只需要更新roles的数据就行
            // const roles =this.state.roles
            this.setState(state=>({
                roles:[...state.roles,role]
            }))
            // roles.push
            message.success('添加角色成功')
        }
        else{
            message.error('添加角色失败')
        }
        //最后关闭对话框
        this.setState({isModalVisible:false})
    }
    updateRole = async()=>{
        const role = this.state.role
        //获取更新的menus数据
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        //更新role
        const result = await reqUpdateRole(role)
        if(result.status===0){
            this.setState({roles:[...this.state.roles]  })
            message.success('角色权限更新成功')
        }
        else{
            message.error('角色权限更新失败')
        }
        //最后关闭对话框
        this.setState({isShowAuth:false})
    }
    handleCancel = ()=>{
        this.formRef.current.resetFields()
        this.setState({isModalVisible:false})
    }
    getRoleLists= async()=>{
        //发送异步请求获取数据
        const result = await reqRoleList()
        if(result.status===0)
        {
            //请求成功
           const roles = result.data
           this.setState({roles})
        }
        else{
            message.error('请求角色列表数据失败')
        }
    }
    createRole=()=>{
        this.setState({isModalVisible:true})
    }
    updateAuth=()=>{
        this.setState({isShowAuth:true})
    }
    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoleLists()
    }
    render() {
        
        const {roles,role,isModalVisible,isShowAuth} = this.state
        console.log('roles_proptype',roles)  
        const title=(
            <span>
                <Button type="primary" onClick={this.createRole}>创建角色</Button> &nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={this.updateAuth}>设置角色权限</Button>
            </span>
        )                
        return (
            <Card title={title}>
                    <Table 
                        bordered
                        rowKey='_id'  //每一行的key值
                        dataSource={roles} 
                        columns={this.columns} 
                        pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
                        // selectedRowKeys指定选中项的 key 数组，可以指定多个 所以是一个数组
                        rowSelection={{
                            type:'radio',
                            selectedRowKeys:[role._id],
                            onSelect:(role)=>{   //选择某个radio时
                                this.setState({role})
                            }
                        }} //selectedRowKeys点击行的时候自动勾上
                        onRow={this.onRow} //该方法会返回当前选中行的所有数据 怎么写参考官方文档
                    />;
                    {/* 对话框  进行确认 */}
                      <Modal 
                        title="创建角色" 
                        visible={isModalVisible} 
                        onOk={this.addRole} 
                        onCancel={this.handleCancel}
                      >   
                         <AddForm formRef={(form)=>{this.formRef = form}}/>             
                      </Modal>
                      <Modal 
                        title="设置角色的权限" 
                        visible={isShowAuth} 
                        onOk={this.updateRole} 
                        onCancel={()=>{this.setState({isShowAuth:false})}}
                      >  
                      <AuthForm ref={this.auth} role={role}/> 
                         {/* <AuthForm/>              */}
                      </Modal>
            </Card>
        )
    }
}
