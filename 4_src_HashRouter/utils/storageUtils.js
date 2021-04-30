/*
    进行local数据存储管理的工具模块(也就是说登陆之后就不用再做)
*/

// import { getSuggestedQuery } from "@testing-library/dom"
import store from 'store'
const USERNAME = 'user_key'
export default{
/*
    保存user
*/
    saveUser(user){
        // localStorage.setItem(USERNAME,JSON.stringify(user))
        // store可以跨浏览器  兼容性更高
        console.log('已保存......')
        store.set(USERNAME,JSON.stringify(user))
    },

/*
读取user
*/
    getUser(){
        // 解析成JSON格式字符串
        return JSON.parse(store.get(USERNAME)||'{}')
    } ,
/*
    删除
*/    
    removeUser(){
        store.remove(USERNAME)
        // localStorage.removeItem(USERNAME)
    },

}