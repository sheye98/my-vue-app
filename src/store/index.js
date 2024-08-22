import {createStore} from "vuex";
import router from "../router/index.js";
import Cookie from "js-cookie";


export default createStore({
    state: {
        isCollapse: true, currentMenu: null, tabsList: [{
            path: '/', name: 'home', label: '首页', icon: 'home'
        }], menu: [], token: ''
    },

    mutations: {
        updateIsCollapse(state, payload) {
            state.isCollapse = !state.isCollapse
        },

        selectMenu(state, val) {
            // 判断如果 menu 指向首页则不做任何操作
            // val.name == 'home' ? (state.currentMenu = null) : (state.currentMenu = val)

            if (val.name === 'home') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                let result = state.tabsList.findIndex(item => item.name === val.name)
                result === -1 ? state.tabsList.push(val) : ''
            }

        },

        // tab 栏关闭
        closeTab(state, val) {
            let res = state.tabsList.findIndex(item => item.name === val.name)
            // 如果点击删除,则在 tabsList 中删除
            state.tabsList.splice(res, 1)
        },

        // 设置 menu 权限
        setMenu(state, val) {
            state.menu = val
            // 设置本地存储数据，持久化存储
            localStorage.setItem('menu', JSON.stringify(val))
        },

        // 从 localstorage 中获取 menu 信息
        addMenu(state, router) {
            if (!localStorage.getItem('menu')) {
                return
            }

            // 若 localstorage 中有数据，则从 localstorage 中取 menu 数据
            const menu = JSON.parse(localStorage.getItem('menu'))
            state.menu = menu

            // 设置动态路由
            const menuArray = []
            menu.forEach((item) => {
                if (item.children) {
                    item.children = item.children.map(item => {
                        let url = `../views/${item.url}`
                        item.component = () => import(url)
                        return item
                    })
                    menuArray.push(item)
                } else {
                    let url = `../views/${item.name}/${item.url}`
                    item.component = () => import(url)
                    menuArray.push(item)
                }
            })

            menuArray.forEach((item) => {
                console.log(item)
                router.addRoute('home1', item)
            })
        },

        // 用户退出登录后，清楚 menu
        cleanMenu(state) {
            state.menu = []
            localStorage.removeItem('menu')
        },

        // 设置 token
        setToken(state, token) {
            state.token = token
            Cookie.set('token', token)
        },

        // 清楚 token
        clearToken(state) {
            state.token = ''
            Cookie.remove('token')
        },

        // 获取 token
        getToken(state) {
            // 先从 state 中获取，获取不到再从 cookies 中获取
            state.token = state.token || Cookie.get('token')
        }
    }
})