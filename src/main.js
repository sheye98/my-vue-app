import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/less/index.less'
import store from './store/index'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import './api/mock'
import api from './api/api'

const app = createApp(App)

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 将 api.js 内的方法注入到全局
app.config.globalProperties.$api = api
app.use(ElementPlus)
// 页面刷新前添加路由
store.commit('addMenu', router)

function checkRouter(path) {
    let hasCheck = router.getRoutes().filter(route => route.path === path).length
    return !!hasCheck;
}

// 路由卫士：拒绝没有权限直接在 url 访问
router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.token
    // 如果没有 token 还想跳到其他页面则直接访问跳回 login
    if (!token && to.name !== 'login') {
        next({name: 'login'})
    } else if (!checkRouter(to.path)) {
        // 若在 url 中输入 路由中不存在的 url 则跳回 home 页面
        next({name: 'home'})
    } else {
        next()
    }
})
app.use(router).use(store)
app.mount('#app')


