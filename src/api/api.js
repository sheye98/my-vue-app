/**
 * 整个项目 api 管理
 */

import request from "./request"

export default {
    // home 组件，左侧表格获取
    getTableData(params) {
        return request({
            url: '/home/getTableData',
            method: 'get',
            data: params,
            mock: true
        })
    },

    getCountData() {
        return request({
            url: '/home/getCountData',
            method: 'get',
            mock: true,
        })
    },

    getChartData() {
        return request({
            url: '/home/getChartData',
            method: 'get',
            mock: true
        })
    },

    getUserData(params) {
        return request({
            url: '/user/getUser',
            method: 'get',
            mock: false,
            data: params
        })
    },
    addUserData(params) {
        return request({
            url: '/user/addUser',
            method: 'post',
            mock: false,
            data: params
        })
    },
    editUserData(params) {
        return request({
            url: '/user/edit',
            method: 'post',
            mock: false,
            data: params
        })
    },
    deleteUserData(params) {
        return request({
            url: '/user/delete',
            method: 'get',
            mock: false,
            data: params
        })
    },
    // 根据用户的用户名不同，返回不一样的菜单列表
    getMenu(params) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            mock: false,
            data: params
        })
    }
}