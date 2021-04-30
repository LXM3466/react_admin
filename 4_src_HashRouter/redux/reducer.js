/*
    用来根据老的state和指定的action生成并返回新的state的函数
*/ 
import { combineReducers } from "redux"
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE ,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from "./action-types"
/*
  函数headTitle用来管理头部标题的reducer函数 
*/
const initTitle='首页'
function headTitle(state=initTitle,action){
    console.log('headTitle change')
    switch(action.type){
        case SET_HEAD_TITLE:
            return action.data  //和之前的状态无关
        default:
            return state
    }
}
/*
  函数headTitle用来管理当前登录用户的reducer函数 ：
      初始值已经存在了本地的localstorage内存里面
*/
const initUser = storageUtils.getUser()
function user(state=initUser,action){
    switch(action.type){
        case RECEIVE_USER:
            return action.user   //接收新的user 
        case SHOW_ERROR_MSG:
            const errorMsg = action.error_msg   
            return {...state,errorMsg}    //记住返回的是一个对象   在原有的状态基础上   不要直接在原来的状态上修改数据
        case RESET_USER:           
            return {}   //接收新的user 
        default:
            return state
    }
}
/*
    向外默认暴露的是合并生产的总的reducer函数
    管理的总的state的结构：
    {
        headTitle:headTitle,  //headTitle:'首页'
        user:user             // user：{}
    }
*/
export default combineReducers({
    headTitle,
    user
})