import Vue from "vue";
export default {
  setRouter(state, data) {
    state.routerList = data;
  },
  //设置路由缓存
  SET_KEEP_ALIVE: (state, keepAlive) => {
    state.keepAlive = keepAlive;
  },
  setNeedReload: (state, val) => {
    state.needReload = val;
  },
};
