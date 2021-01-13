import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引用样式
import '@reasy-team/reasy-ui-vue/dist/styles.css';
import './common/css/normalize.scss'
import './common/css/grid.css'
import './common/css/common.scss'
import api from "./http/api";
import valid from './common/js/validate'
// function translator(n){
//   return n;
// }
// window._=Vue.prototype._=translator;
//引用文件
import ReasyUIVue from '@reasy-team/reasy-ui-vue';
import { Table, Page, Poptip, Message, Tooltip} from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ReasyUIVue);
Vue.component("Table", Table);
Vue.component("Page", Page);
Vue.component("Poptip", Poptip);
Vue.component("Tooltip", Tooltip);
// Vue.component("Message", Message);
//通过this.$Message这种调用的组件，不能用component注册，需要把属性绑到Vue实例上
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$Message = Message;
Vue.prototype.$valid = valid;
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
