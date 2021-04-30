import React from 'react'
import ReactDOM from 'react-dom'
// react-redux简化redux编码
import { Provider } from 'react-redux'
import App from './App'
import store from './redux/store'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//一上来就读取local中保存user，保存到内存中，登陆后页面刷新也不会退出登陆
const user = storageUtils.getUser()
memoryUtils.user = user
ReactDOM.render(
<Provider store={store}>
   <App/> 
</Provider>
,document.getElementById('root'))