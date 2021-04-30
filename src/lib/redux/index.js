/*
    redux的核心库  ：自定义 redux 库

    1) redux 库向外暴露下面几个函数 
        createStore(): 接收的参数为 reducer 函数, 返回为 store 对象 
        combineReducers(): 接收包含 n 个 reducer 方法的对象, 返回一个新的 reducer 函数 
        applyMiddleware() // 暂不实现 
    2) store 对象的内部结构 
        getState(): 返回值为内部保存的 state 数据
        dispatch(): 参数为 action 对象 
        subscribe(): 参数为监听内部 state 更新的回调函数
*/

export default function createStore(reducer){
    let state = reducer(undefined,{type:'@@/reducer-init'})
    const listeners = []  //用来存储监听state更新回调函数的数组容器

    function getState(){
        return state
    }

    function dispatch(action){
        //有三件事情要做
        //1. 调用reducer返回新的state值
        const newState = reducer(state,action)
        //2.保存新的state值
        state = newState
        //3.调用所有监听的回调函数，通知组件更新
        listeners.forEach(listener=>listener())

    }
    // 订阅 state 变化的监听
    function subscribe(listener){
       listeners.push(listener)  // 保存到缓存listen的listeners容器中  
    }
    return {
        getState,
        dispatch,
        subscribe
    }
}

/*
    reducers:{
        count: (state=2,action),
        user: (state={},action)
    }
    得到新的reducer结构：
    reducers:{
        count: (state.count,action),
        user: (state.user,action)
    }
*/ 
export default function combineReducers(reducers){
    // let totalState = {}
    // Object.keys(reducers).forEach(key=>
    //     totalState[key] =  reducers[key](state[key],action)
    // )
    // return totalState
    return (state={},action)=>{
        return Object.keys(reducers).reduce((prestate,key)=>{
                prestate[key] = reducers[key](state[key],action)
                return prestate
            },{})
    }
   
}
