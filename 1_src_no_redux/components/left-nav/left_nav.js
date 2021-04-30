import React, { Component } from 'react'
import './left-nav.less'
import logo from '../../assets/images/logo.png'
import {Link,withRouter} from 'react-router-dom'
import {Menu} from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import menuList from '../../config/menuConfig'
import { connect } from 'react-redux'

const { SubMenu } = Menu;
// import Header from './'
class Left_nav extends Component {   
  hasPath=(item)=>{
    const {isPublic,key} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    if(isPublic|| username==='admin' || menus.indexOf(key)!==-1){
        //如果都没有权限至少显示首页 如果是管理员授予全部权限  如果匹配到的key是一级列表页显示
        return true
    }
    else if(item.children){   //二级分类列表的子路由
      return  !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }
    return false

  }
  /*
    第一种方法
    根据menu数据的数组生成对应的标签数组
    使用map加上递归调用
  */    
    getMenuNodes_map=(menuList)=>{

        return menuList.map(item=>{
          // 没有孩子  没有子路由
          if(!item.children)
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>
                <span>
                  {item.title}
                </span>   
                </Link>
              </Menu.Item>
            )
            else
              return (
                <SubMenu key={item.key} title={item.title} icon={item.icon}>
                  {this.getMenuNodes(item.children)}
                </SubMenu>
              )

        }
        )
    }
  /*
    第一种方法
    根据menu数据的数组生成对应的标签数组
    使用reduce()+递归调用
  */    
    getMenuNodes = (menuList)=>{
      const path = this.props.location.pathname;
      
      //初始值返回空数组
      //reduce的遍历回调函数，有两个参数 之前的结果 和当前的结果
        return menuList.reduce((pre,item)=>{
          // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
          if(this.hasPath(item)){
            //向pre添加<Menu.Item>
            //向pre添加<Submenu>  根据children有无来判断添加哪个
            if(!item.children){
              pre.push(
              (  <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>
                <span>
                  {item.title}
                </span>   
                </Link>
                </Menu.Item>)
              )
            }
            else{
              //找是否选择的是某个路由的子路由 如果是  刷新的时候要仍然显示该子路由为展开状态
              // 找item.children中的每一项cItem是和当前路径一样  一样则说明确实展开了，返回1
              //查找一个与当前请求路径相同的子Item
              // const cItem =  item.children.find(cItem=>cItem.key===path)
              const cItem =  item.children.find(cItem=>path.indexOf(cItem.key)===0)
              // 如果存在  说明当前item的子列表需要展开
              if(cItem)
              {
                this.openKey = item.key  //将当前item的key值存到组件实例的openKey中
              }          
              pre.push(
                  (          
                  <SubMenu key={item.key} title={item.title} icon={item.icon}>
                    {this.getMenuNodes(item.children)}
                  </SubMenu>
                  )
              )
            }     
          }
          return pre;
        }
        ,[])
    }
    /*
      在第一次render之前执行一次 只创建一次  很符合要求 
      为第一次render()准备数据（必须同步的准备）
    */
    UNSAFE_componentWillMount(){
      this.menuNodes = this.getMenuNodes(menuList);
    }
    render() {
      // debugger
        //每次render都重新创建一遍 所以应该放在componWillMount中  
        // const menuNodes = this.getMenuNodes(menuList);

        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if(path.indexOf('/product')===0)
        {
          // 说明当前请求的是商品或者商品的子路由
          path ='/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (      
          <div  className='left-nav'>
            <Link to='/' className='left-nav-header'>
                <img src={logo} alt='logo'/>
                <h1>硅谷后台</h1>
            </Link> 
            <Menu           
              mode="inline"
              theme="dark"
              selectedKeys={[path]}    
              defaultOpenKeys={[openKey]}        
            >
             { 
               this.menuNodes
             }
              {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
                <Link to='/home'>
                  首页                  
                </Link>
              </Menu.Item>
              <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                <Menu.Item key="5" icon={<MailOutlined />}>
                  <Link to='/category'>
                      品类管理
                  </Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<MailOutlined />}>
                  <Link to='/product'>
                    商品管理
                  </Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="2" icon={<PieChartOutlined />}>
                <Link to='/user'>
                    用户管理
                </Link>
              </Menu.Item>        
              <Menu.Item key="3" icon={<PieChartOutlined />}>
                <Link to='/role'>
                    角色管理
                </Link>
              </Menu.Item>
              <SubMenu key="sub4" icon={<AppstoreOutlined />} title="图形图表">
                <Menu.Item key="9" >
                <Link to='/charts/bar'>
                  柱形图
                </Link>    
                </Menu.Item>
                <Menu.Item key="10" icon={<AppstoreOutlined />}>
                  <Link to='/charts/line'>
                     折线图
                  </Link> 
                </Menu.Item>   
                <Menu.Item key="11" >
                  <Link to='/charts/pie'>
                     饼图
                  </Link>
                </Menu.Item> 
              </SubMenu> */}
            </Menu>
          </div>            
        )
  }
}
/*
  withrouter为高阶组件：
    包装非路由组件，返回一个新的组件
    新的组件向非路由组件传递三个属性：history/location/match
*/
export default  connect(
  // state通过store传进来，在redux中保存
  state=>({headTitle:state.headTitle})
)(withRouter(Left_nav)) 