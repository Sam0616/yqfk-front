import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import UserList from "../components/user/UserList";
import RoleList from "../components/role/RoleList";
import MenusList from "../components/menus/MenusList";
import AuthList from "../components/authority/AuthList";
import AppList from "../components/app/AppList";
import RiskList from "../components/risk/RiskList";
import RecordList from "../components/target/RecordList";
import Registration from "../components/register/Registration";
import StatList from "../components/stat/StatList";
import Dept from "../components/dept/Dept";

// 解決同一路径,点击多次报错问题 Navigating to current location ("/home/user") is not allowed
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      // 注册模块
      path: '/register',
      component: Registration
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          // 个人来源地查询
          path: 'source',
          component: RoleList
        },
        {
          // 个人历史轨迹查询
          path: 'history',
          component: MenusList
        }, {
          // 危险伴行行为查询
          path: 'dangerous',
          component: AppList
        },
        {
          // 个人综合感染风险
          path: 'risk',
          component: RiskList
        },
        {
          // 区域疑似&感染案例查询
          path: 'case',
          component: MenusList
        },
        {
          // 区域来源地人流统计分布
          path: 'statistics',
          component: StatList
        },
        {
          // 区域风险指标
          path: 'target',
          component: RecordList
        },
        {
          // 危险伴行人员
          path: 'riskPersonal',
          component: MenusList
        },
        {
          // 疫情原因追溯
          path: 'trace',
          component: RiskList
        },
        {
          // 疫情扩散仿真
          path: 'scale',
          component: MenusList
        },
        {
          // 用户管理
          path: 'user',
          component: UserList
        },
        {
          // 角色管理
          path: 'role',
          component: RoleList
        },
        {
          // 菜单管理
          path: 'menu',
          component: MenusList
        },
        {
          // 菜单管理
          path: 'auth',
          component: AuthList
        },
        {
          // 菜单管理
          path: 'dept',
          component: Dept
        }
      ]
    },
  ]
})


/*
//导航守卫
router.beforeEach((to, from, next) => {
  console.log("=======导航守卫=====")
var loginName=sessionStorage.getItem("LOGIN_NAME")
if (loginName!=null||to.path==='/login'||to.path==='/register'){
  next();
}else {
  next("/login")
}
  // 放行
  next();
})
*/

// export default router;
