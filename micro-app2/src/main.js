import "./public-path";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import actions, { updateMicroAppStrategy } from './shared/qiankun_actions'
Vue.config.productionTip = false;
let instance = null;
function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#micro2") : "#micro2");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
// 生命周期
export async function bootstrap(props) {
  console.log('micro-app2微应用bootstrap', props)
  // console.log('[vue] vue app bootstraped')
}
export function mount(props) {
  console.log('micro-app2微应用mount', props)
  // storeTest(props);
  actions.setActions(props)
  render(props)
}
export async function unmount() {
  console.log('micro-app2微应用unmount')
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  store.dispatch('SET_KEEP_ALIVE', [])
}
export async function update(payload) {
  console.log('micro-app2微应用update')
  let { props } = payload  
  updateMicroAppStrategy[props.type](props)
}
