/*
    react-redux库的主模块

    1) react-redux 向外暴露了 2 个 API a. Provider 组件类 b. connect 函数 
    2) Provider 组件 接收 store 属性 让所有容器组件都可以看到 store, 从而通过 store 读取/更新状态 
    3) connect 函数 接收 2 个参数: mapStateToProps 和 mapDispatchToProps 
        mapStateToProps: 为一个函数, 用来指定向 UI 组件传递哪些一般属性 
        mapDispatchToProps: 为一个函数或对象, 用来指定向 UI 组件传递哪些函数属性 
        connect()执行的返回值为一个高阶组件: 包装 UI 组件, 返回一个新的容器组件 
    容器组件会向 UI 传入前面指定的一般/函数类型属性
*/

import React,{Component} from "react"
import PropTypes from 'prop-types'
/*
    用来向所有容器组件提供store的组件
    通过context向所有的容器组件提供store
*/
export class Provider extends Component{
    static propTypes = {
        store: PropTypes.object  //声明接收store
    }
    //声明提供context的数据名称和类型
    static childContextTypes ={
        store:PropTypes.object
    }
    //向所有有声明子组件提供包含要传递数据的context对象
    getChildContext(){
        return {
            store:this.props.store
        }
    }
    render(){
        //返回渲染<Provider>的所有子节点
        return this.props.children
    }
}

/*
    connect高阶函数：接收mapstateToProps 和 mapDispatchToProps两个参数 返回一个高阶组件函数
    mapstateToProps: state=>({count:state})
    mapDispatchToProps:{increment,decrement} 对象形式或者 函数形式
                       (dispatch)=>({
                           increment:(num)=>{dispatch(increment(num)))}  ,
                           decrement:(num)=>{dispatch(decrement(num)))}           
                       })
    高阶组件： 接收一个UI组件，返回一个容器组件
*/ 
export function connect(mapStateToProps,mapDispatchToProps){
    //返回高阶组件函数
    return (UIComponent) =>{
        return class ContainerComponent extends React.Component{
            //声明接收的context数据的名称和类型
            static contextTypes = {
                store:PropTypes.object  
            }
            constructor(props,context){
                super(props)
                //从此处可以发现store为{getState,dispatch,subscribe}
                console.log('context',context.store)
                const {store} =context
                //得到包含所有一般属性的对象
                const stateProps = mapStateToProps(store.getState())  //状态数据 会变
                //将所有一般属性作为容器的状态数据
                this.state ={...stateProps}
                let dispatchProps
                if(typeof mapDispatchToProps === 'function'){
                    //得到包含所有函数属性的对象  //返回的是一个函数，将对象中的方法作为函数属性传入UI组件
                    dispatchProps = mapDispatchToProps(store.dispatch)  
                }
                else{
                    return dispatchProps =  Object.keys(mapDispatchToProps).redux((pre,key)=>{
                        const actionCreator = mapDispatchToProps[key]   
                         //值是函数  
                         // 参数透传： 不知道传几个参数用...args(是将多个数据收集成一个数组),后面的...args是将数组用三点运算符解构处理
                        pre[key] = (...args)=>{store.dispatch(actionCreator(...args))}   
                        return pre
                    },{})
                }

                //保存到组件上
                this.dispatchProps = dispatchProps

                //绑定store的state变化的监听
                store.subscribe( ()=>{  //说明store内部的状态数据发生了变化
                 //更新容器组件 ===》UI组件更新
                 this.setState({...mapStateToProps(store.getState())})
               })
            }
            //返回容器组件
            render(){
                //返回UI组件的标签
                return <UIComponent {...this.state} {...this.dispatchProps}/>
            }
        }
    }
}