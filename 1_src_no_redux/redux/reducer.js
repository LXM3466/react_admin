/*
    用来根据老的state和指定的action生成并返回新的state的函数
*/ 
import { combineReducers } from "redux"
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE } from "./action-types"
/*
  函数headTitle用来管理头部标题的reducer函数 
*/
const initTitle='首页'
function headTitle(state=initTitle,action){
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