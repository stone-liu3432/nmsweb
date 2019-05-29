import menu from '../config/menu.js'

let state = {
    isLoading: false,
    menu,
    //  主题    dark   light   primary
    theme: 'dark',
    //  保存所有echarts实例
    charts: [],
    //  面包屑导航数据
    breadcrumb: 'home',
    language: '',
    langMap: {},
    wsState: true
}

export default state