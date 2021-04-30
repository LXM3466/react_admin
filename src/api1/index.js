/*
基本要求：能根据接口文档定义请求函数
*/

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE=''
export const  reqLogin=(username,password)=>{
  return   ajax(BASE+'/login',{username,password},'POST')
}

export const  reqAddUser = user =>  ajax(BASE+'/manage/user/add',user,'POST')
  
/*
  json请求的接口请求函数   返回promise对象  以传给组件
*/

// 获取一级/二级分类的列表  默认GET请求(形参默认值) parentId为要传的请求参数
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list', {parentId})
//添加分类
export const reqAddCategorys = ({parentId,categoryName}) => ajax(BASE+'/manage/category/add', {parentId,categoryName},'POST')
//更新分类
export const reqUpdateCategorys = (categoryId,categoryName) => ajax(BASE + '/manage/category/update', {categoryId,categoryName},'POST')
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})
// export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')
export const reqWeather= (cityCode)=>{
  const url=`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=5a0e48b23fb613c067f86b7f4fa994c2`
  // 箭头回调函数  接收两个参数
  //发送jsonp请求
  // let promise;
  return new Promise((resolve,rejected)=>{

    jsonp(url,{},(err,data)=>{
      //测试
      console.log('jsonp',err,data)
      //如果成功了
      if(!err && data.status==="1")
      {
        //解构赋值 取出需要的数据
        const {city,weather,temperature} = data.lives[0]
        resolve({city,weather,temperature})
      }
      // 如果失败了
      else{
        message.error('获取天气信息失败')
      }
    })
  }
  )

}
//获取商品分页列表
export const reqProducts =(pageNum,pageSize)=> ajax(BASE+'/manage/product/list',{pageNum,pageSize})

export const reqSearchProducts =({pageNum,pageSize,searchType,searchName})=> ajax(
  BASE+'/manage/product/search',
  {
    pageNum,
    pageSize,
    [searchType]:searchName
  }
)//**/ *//

// 更新商品分类(上架、下架)
export const reqUpdateSatatus = (status,productId)=> ajax(BASE+'/manage/product/updateStatus',{status,productId},'POST')
// 删除上传的图片
export const reqDeleteImg = (name)=>ajax(BASE+'/manage/img/delete',{name},'POST')

// 添加或者更新商品
// export const reqAddOrUpdateProduct = (product)=>ajax(BASE+'/manage/product/update',{product},'POST')
export const reqAddOrUpdateProduct = (product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')

//获取角色列表
export const reqRoleList =()=>ajax(BASE+'/manage/role/list')
//添加角色列表
export const reqAddRole = (roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
//更新角色列表
export const reqUpdateRole = (role)=>ajax(BASE+'/manage/role/update',role,'POST')

//获取用户列表
export const reqUser =()=>ajax(BASE+'/manage/user/list')
//删除用户
export const reqDeleteUser= (userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')
//添加用户
export const reqAddOrUpdateUser= (user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')