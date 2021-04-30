/*
   能发送异步ajax请求的函数模块
       返回一个对象实例
   优化：统一处理请求异常  
        外部包裹一个promis对象
*/

import axios from 'axios'
import {message } from 'antd';
export default function ajax(url,data={},type='GET'){
    return  new Promise((resolve,reject)=>{
        //1.执行异步ajax请求
        let promise
        if(type==='GET'){
           promise = axios.get(url,{  //配置对象
              params:data  //制定请求参数
           })
        }
        else{
            promise =   axios.post(url,data)
        }   
        //2. 如果执行成功了，调用resolve(value)
        promise.then( response=>{
            // resolve(response)
            resolve(response.data)
        }
        ).catch(error=>{
           //3.如果失败了，不调用reject(reason)，因为会触发catch(error)就不是统一处理了，而是提示异常信息
            message.error('请求出错'+error.message)
        }
        )
    }
    )

}
        

