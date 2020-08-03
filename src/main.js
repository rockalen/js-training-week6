import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {
  ValidationObserver,
  ValidationProvider, configure, localize, extend
} from 'vee-validate' // 驗證套件
import * as rules from 'vee-validate/dist/rules' // 規則檔案（ex: email...）
import zhTW from 'vee-validate/dist/locale/zh_TW.json' // 語系檔案
// Import vue-loading-overlay component
import Loading from 'vue-loading-overlay'
// Import vue-loading-overlay stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap'
// Bus
import './bus'
// 讓瀏覽器的全域環境可以使用到 $
import jQuery from 'jquery'
// 匯入 money，千分號轉換
import FormatMoney from './filters/FormatMoney'
window.$ = window.jQuery = jQuery
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
// register VueAxios prototype
Vue.use(VueAxios, axios)
// Install BootstrapVue
// Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)
Vue.component('Loading', Loading)
// vee-validate
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
}) // 所有驗證規則
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
})
localize('tw', zhTW)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// money，千分號轉換
Vue.filter('money', FormatMoney)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
