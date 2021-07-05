import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'
import $tabs from '@/utils/tabs'
import _ from 'lodash'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "首页",
    redirect:'/index'
  },
  {
    path: "/index",
    name: "首页",
    component: () =>
      import(/* webpackChunkName: "Index" */ "@/views/index/index.vue"),
  },
  {
    path: "/p1",
    name: "Page1",
    component: () =>
      import(/* webpackChunkName: "Index" */ "@/views/p1/p1.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/login/login.vue"),
    meta: {
      single: true,
    },
  },
];

const router = new VueRouter({
  routes,
});
VueRouter.prototype.push = function push(location) {
  $tabs.activeTabHistoryAction['push']() // push当前选中的页签历史记录栈
  return VueRouter.prototype.replace.call(this, location).catch(err => err) // 改用router.replace的原因是为了避免产生浏览器的历史记录（防止点击浏览器的前进后退键造成页签切换有误）
}
/**
* 改写router.history.go方法，通知主应用取出当前高亮的页签的history历史记录栈中最后一条页面数据等其他相应操作
*/
const originalRouterHistoryGo = router.history.__proto__.go
router.history.__proto__.go = function go(val) {
  if (val === -1) {
      // 只对go(-1)进行处理
      return $tabs.activeTabHistoryAction['pop']() // pop当前选中的页签历史记录栈
  }
  return originalRouterHistoryGo.call(this, val)
}
// debugger
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
      // if (!Cookies.get('access_token')) {
      //     next({ replace: true, path: '/login' })
      // }
      let hasOpenTab = $tabs.tabs.find(item => {
          let realRoute = item.realRoute
          if (!realRoute) {
              // realRoute不存在的时候直接返回false
              return false
          }
          // console.log(realRoute.path, '=====>', realRoute.path === to.path && _.isEqual(realRoute.query, to.query))

          return realRoute.path === to.path && _.isEqual(realRoute.query, to.query)
      })
      if (hasOpenTab) {
          $tabs.tabs.map(item => {
              item.active = hasOpenTab.id === item.id
              return item
          })
          $tabs.setLocalTabs()
      } else {
          $tabs.setRealRoute({ ...to })
      }
      next()
  } else {
      next()
  }
})

export default router;
