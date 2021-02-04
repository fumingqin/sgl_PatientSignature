import Vue from 'vue'
import App from './App'
import Sgl from '@/common/sgl_Interface.js'


Vue.config.productionTip = false;
App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);
Vue.prototype.$sgl=Sgl;
App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
