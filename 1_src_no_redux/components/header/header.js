import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import menuList from "../../config/menuConfig";
import  './header.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api1/index'
import LinkButton from '../link-button/link_button'
class Header extends Component {
    state ={
        currentTime : formateDate(Date.now()),
        weather:'',   //天气情况
        city:'',      //天气城市 
        temperature:''  //温度
    }
     getweather =async ()=>{
       // 调用接口请求异步获取数据   result是个对象
       const {city,weather,temperature} = await reqWeather(441900)
       this.setState({city,weather,temperature} )
    }
    getTitle=()=>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path)
            {
                title = item.title
            }
            else if(item.children){
            //  const cItem =  item.children.find(cItem=> cItem.key === path)
            const cItem =  item.children.find(cItem=> path.indexOf(cItem.key)===0)
             if(cItem) {
                 title = cItem.title
             }
            }
        });
        return title
    };

    logOut=()=>{
        //显示确认框
        Modal.confirm({
            content: '确认退出登陆?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=> {
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login
                // console.log('ok',this);
                this.props.history.replace('/login')
            },})           
    }
    //第一次render之后执行   一般在此执行异步操作 ： 发ajax请求/启动定时器
    componentDidMount(){
        this.timer = setInterval(() => {
        const currentTime = formateDate(Date.now())
        this.setState({currentTime})
        }, 1000);
        this.getweather()
    }
    //当前组件卸载之前调用
    componentWillUnmount(){
        //要关闭定时器
        clearInterval(this.timer)
    }
    render() {
        const{currentTime,weather,city,temperature} = this.state
        const user= memoryUtils.user.username
        //得到当前需要显示的title
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                   <span> 欢迎,{user}</span>
                   <LinkButton onClick={this.logOut}>退出</LinkButton>
                   {/* <a href="javascript:" onClick={this.logOut}>退出</a>                   */}
                   {/* <button>退出</button> */}
                    </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}                   
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>  
                        <span>{city}</span>
                        <span>{weather}</span>
                        <span>{temperature}℃</span>
                                         
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)