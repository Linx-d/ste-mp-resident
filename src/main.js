import Vue from 'vue'
import App from './App'

import store from './store'

//样式引入
import '@/assets/css/reset.css'
import "@/assets/fonts/iconfont.css"
import "@/assets/less/common.less"

import '@/plugins/mixin'

import loading from './components/app-loading.vue'
Vue.component('basics',loading)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

// broker
import home from './pages/home/home.vue'
Vue.component('home',home)

import work from './pages/work/home.vue'
Vue.component('work',work)

import finish from './pages/finish/home.vue'
Vue.component('finish',finish)

import isuse from './pages/isuse/home.vue'
Vue.component('isuse',isuse)

import mine from './pages/mine/home.vue'
Vue.component('mine',mine)

import task from './pages/task/detail.vue'
Vue.component('task',task)
import uView from 'uview-ui';
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

 



