import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
import SuperTable from '../packages/index'
Vue.use(SuperTable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
