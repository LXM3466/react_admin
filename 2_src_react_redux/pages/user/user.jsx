import React, { Component } from 'react'
import {Button, Card,message,Table,Modal} from 'antd'
import {formateDate} from '../../utils/dateUtils'
import { QuestionOutlined } from '@ant-design/icons';
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/link-button/link_button'
import { reqDeleteUser, reqUser,reqAddOrUpdateUser } from '../../api1'
import AddOrUpdateUser from './add_user'

export default class User extends Component {
    addForm = React.createRef()   
    state = {
        users:[],
        roles:[],
        showStatus:false,       
    }
    
    iniColumns=()=>{
        this.columns=[
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
              },
              {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
                // render:formateDate
              },
              {
                title: '注册时间',
                dataIndex: 'create_time',
                render:(create_time)=>formateDate(create_time)
              },
              {
                title: '所属角色',
                dataIndex: 'role_id',  //根据role_id找到相应的角色名字 
                render: (role_id) =>{
                  console.log('roles',this.state.roles)
                  const role =  this.state.roles.find(item=>item._id===role_id) ||{name:''}                 
                //   console.log('role',role)
                  return role.name  
                } 
              },
              {
                title: '操作',
                render:(user)=>
                (  <span>
                      <LinkButton onClick={()=>{this.updateClick(user)}}>修改</LinkButton>
                      <LinkButton onClick={()=>{this.deleteClick(user)}}>删除</LinkButton>                                     
                    </span>
                )
                
              },
        ]
    }
    initRolesName=(roles)=>{
       const rolesName = roles.reduce((pre,role)=>{
           pre[role._id] = role.name
           return pre
        },{})
        this.rolesName = rolesName
    }
    getUsers= async ()=>{
        const result = await reqUser()
        if(result.status===0)
        {
            const users = result.data.users
            const roles = result.data.roles
            // console.log('roles',roles)
            this.setState({users,roles})
        }
        else{
            message.error('获取用户列表失败')
        }
    }
    addUser=()=>{
        // console.log('添加用户')
        this.user = null   // 去除前面保存的user
        this.setState({showStatus:true})
    }
    updateClick=(user)=>{
        this.user = user
        // console.log('update',user)
        this.setState({showStatus:true})
    }
    deleteClick=(user)=>{
        // console.log('user',user.username)
        Modal.confirm({        
            title:`确定删除用户${user.username}吗?`,
            icon: <QuestionOutlined/>,        
            okText: '确认',
            cancelText: '取消',
            onOk:async ()=>{
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    this.getUsers()       
                    message.success(`删除用户${user.username}成功`)
                }
                else{
                    message.error(`删除用户${user.username}失败`)
                }
            },                
          });
    }
    addOrUpdateUser_modal=async ()=>{
        // const {addUser} =  this.addForm.current.getFieldsValue()
        this.addForm.current.validateFields().then(
            async (user)=>{
                // console.log('addUser',user)
                // console.log('this.user',this.user)
                //如果是更新，this.user有值
                if(this.user){
                    user._id = this.user._id
                    console.log('更新用户',user)
                }
                // const {username,password,email,phone} = value
                // const user =  {username,password,email,phone}
                const result = await reqAddOrUpdateUser(user)
                // console.log('请求的数据',result)
                this.addForm.current.resetFields()
                if(result.status===0)
                {
                    this.getUsers()
                    message.success(`${user._id?'更新':'添加'}用户成功`)
                }
                else{
                    message.error(`${user._id?'更新':'添加'}用户失败`)
                }
            }
        )
        // console.log('addUser',addUser)
        // const result = await reqAddOrUpdateUser()
        this.setState({showStatus:false})
    }
 
    handleCancel_add=()=>{
        this.addForm.current.resetFields()
        this.setState({showStatus:false})
    }
   
    UNSAFE_componentWillMount(){
        //render之前调用 初始化数值用 只调用一次  准备数据用
        this.iniColumns()     
    }
    componentDidMount(){
        //render之前调用  主要是异步获取数据
        this.getUsers()
    }
    render() {
        
        const {users,showStatus,roles} = this.state
        const user = this.user || {}
        const title =(
            <Button type='primary'  onClick={this.addUser}>创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'  //每一行的key值
                    dataSource={users} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}                   
                />
                <Modal title={user._id?'修改用户':'添加用户'}
                    visible={showStatus} 
                    onOk={this.addOrUpdateUser_modal} 
                    onCancel={this.handleCancel_add}
                >                 
                   <AddOrUpdateUser 
                      setForm={form=>{this.addForm=form}} 
                      roles={roles} 
                      user={user}/>                   
                </Modal>

            </Card>
        )
    }
}
