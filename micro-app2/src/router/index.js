import Vue from "vue";
import store from "@/store/index";
import VueRouter from "vue-router";
import actions from '@/shared/qiankun_actions'
Vue.use(VueRouter);

const routes = [
  {
    path: "/p1",
    name: "p1",
    component: () =>
      import(/* webpackChunkName: "Index" */ "@/views/p1/p1.vue"),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/p2",
    name: "p2",
    component: () =>
      import(/* webpackChunkName: "Index" */ "@/views/p2/p2.vue"),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/p3",
    name: "p3",
    component: () =>
      import(/* webpackChunkName: "Index" */ "@/views/p3/p3.vue"),
  },
];


routes.forEach((element) => {
  element.path = `${window.__POWERED_BY_QIANKUN__ ? "/micro-2" : ""}${
    element.path
  }`;
});
const router = new VueRouter({
  routes,
});
if (window.__POWERED_BY_QIANKUN__) {
  /**
   * 改写router.push方法，通知主应用将页面push进当前高亮的页签的history历史记录栈中
   */

  VueRouter.prototype.push = function push(location) {
      actions.setGlobalState({ historyAction: 'push' })
      return VueRouter.prototype.replace.call(this, location) // 改用router.replace的原因是为了避免产生浏览器的历史记录（防止产生浏览器的前进后退键造成页签切换有误）
  }
  /**
   * 改写router.history.go方法，通知主应用取出当前高亮的页签的history历史记录栈中最后一条页面数据等其他相应操作
   */
  const originalRouterHistoryGo = router.history.__proto__.go
  router.history.__proto__.go = function go(val) {
      if (val === -1) {
          // 只对go(-1)进行处理
          return actions.setGlobalState({ historyAction: 'pop' })
      }
      return originalRouterHistoryGo.call(this, val)
  }
}
router.beforeEach((to, from, next) => {
  let keepAlive = store.state.keepAlive;
  if (to.meta.keepAlive) {
    if (!keepAlive.includes(to.name)) {
      keepAlive.push(to.name);
      store.dispatch("SET_KEEP_ALIVE", keepAlive);
    }
  }
  next();
});
export default router;
