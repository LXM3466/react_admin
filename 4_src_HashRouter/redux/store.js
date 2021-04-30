/*
    redux最核心的管理模块
*/ 
import  {applyMiddleware, createStore} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
//利用中间插件实现异步action
import thunk from 'redux-thunk'
import reducer from './reducer'

// 向外暴露store  管理的是总的状态
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))