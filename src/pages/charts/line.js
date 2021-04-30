import React, { Component } from 'react'
import {Button, Card} from 'antd'
import ReactEcharts from 'echarts-for-react'
/*
    折线图路由
*/ 
export default class Line extends Component {
    state={
        sales:[5,20,16,18,35,41],  //销量数组
        stores:[8,15,30,50,15,66]  //库存数组
    }
    /*返回柱状图的配置对象 */
    getOption=(sales,stores)=>{
        // 指定图表的配置项和数据  
       return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            // series所有要显示数据的数组
            series: [{
                name: '销量',
                type: 'line',
                data: sales
            },{
                name: '库存',
                type: 'line',
                data: stores
            }]
        };
    }
     /*更新状态数据 */
    update = () =>{
        this.setState(
            state=>({
                sales:state.sales.map(sale=>sale+1),  //数据的哪个更新
                stores:state.stores.reduce((pre,store)=>{
                    pre.push(store-1)
                    return pre
                },[]),
            })
        )
    }
    render() {
        const {sales,stores} = this.state
        return (
            <div>
                <Card>
                  <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='折线图一'>
                    <ReactEcharts option={this.getOption(sales,stores)}/>
                </Card>
            </div>
        )
    }
}
