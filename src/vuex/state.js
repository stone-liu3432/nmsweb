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
    wsState: true,
    //  olt 配置时，缓存olt端口名称和id的映射
    port_name: {},
    dev_ip: '',
    basicInfo: {},
    //  以时间戳来标记，时间戳更新时，刷新当前页面数据
    timestamp: 0
}

export default state