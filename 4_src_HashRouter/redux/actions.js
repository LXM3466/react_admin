/*
   包含n个action creator函数的模块
   同步action:对象{type:'xxx',data:数据值}
   异步action:函数 dispatch=>{}
*/
// import { message } from "antd";
import { reqLogin } from "../api1";
import storageUtils from "../utils/storageUtils";
import { RECEIVE_USER, SET_HEAD_TITLE ,SHOW_ERROR_MSG,RESET_USER} from "./action-types";
/*
    设置头部标题的同步action  返回一个对象 入口参数为设定的新的值
*/ 
export const setHeadTitle = (headTitle) =>({type:SET_HEAD_TITLE,data:headTitle})
/*
    接收用户的同步action  返回一个对象 入口参数为设定的新的值
*/ 
export const receive_user = (user)=>({type:RECEIVE_USER,user})
/*
    显示错误信息的同步action  返回一个对象 入口参数为设定的新的值
*/ 
export const  show_error_msg = (error_msg)=>({type:SHOW_ERROR_MSG,error_msg})
/*
    退出登陆的同步action  返回一个对象 入口参数为设定的新的值
*/
export const logout =()=> {
    // 先删除local中user
    storageUtils.removeUser()
    //在返回action对象
    return {type:RESET_USER}
}  //重置 不需要传数据
/*
    登陆的异步action
*/
export const login =(username,password)=>{
    return async dispatch =>{
        //1. 执行异步ajax请求
       const result = await  reqLogin(username,password)
        //2.1 如果成功了 分发成功的同步action
        if(result.status ===0){
            //成功后需要将数据存到状态中去 并分发同步action
            const user = result.data
            //到这一步说明登陆成功 得到一个新的user 需要存到local状态内存中去
            storageUtils.saveUser(user)
            //分发接收用户的同步action
            //一旦执行这个代码。就会触发我的reducer调用，最终进入reducer的user函数更新状态
            dispatch(receive_user(user))
        }
        
        else{//2.2 如果失败了 分发失败的同步action
            const msg = result.msg  //显示后台返回的错误信息
            //分发一个登陆失败的错误信息提示
            dispatch(show_error_msg(msg))
        }
    }
}
