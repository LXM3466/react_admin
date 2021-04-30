// import { importManager } from 'less'
import React, { Component } from 'react'

import './home.less'
/*
首页分类
*/ 
export default class Home extends Component {
    render() {
        return (
            <div className='home'>
                欢迎使用硅谷后台管理系统
            </div>
        )
    }
}



// function toCustom(n){
//     var arr = [];
//     for(var i=0;i<n;i++){
//         arr.push(random(n));
//     }
//     return arr;
// }

// function random(n){
//     let arr=[];
//     for(var i=0;i<n;i++)
//     {
//         arr.push(Math.random().toFixed(1)*n)
//     }
//     return arr.sort();
// }

// console.log(toCustom(3))


