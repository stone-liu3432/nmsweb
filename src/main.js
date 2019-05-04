import "babel-polyfill";
import Vue from "vue";
import Vuex from "Vuex";
import store from "./vuex/store";
import NMS from "./nms";
import router from "./router";
import axios from "axios";
import ElementUI from "element-ui";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import "element-ui/lib/theme-chalk/index.css";
import "@/custom-css/custom.css";

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: sessionStorage.getItem('lang') || 'en',
    messages: {
        "en": enLocale,
        "zh": zhLocale
    }
});
locale.i18n((key, value) => i18n.t(key, value));

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.config.productionTip = false;

axios.defaults.timeout = 5000;

if (process.env.NODE_ENV === "development") {
    //  开发模式
    axios.defaults.baseURL = "http://localhost:8200";
} else if (process.env.NODE_ENV == "production") {
    //  生产模式
    axios.defaults.baseURL = "";
}
//  request拦截器  -->  全局request添加请求头
axios.interceptors.request.use(
    config => {
        //  to do
        var token = sessionStorage.getItem('x-token');
        if(token){
            config['x-token'] = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//  response拦截器  -->  全局错误处理
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        err.response
            ? console.log(`${err.response.status} ${err.response.statusText}`)
            : console.log("Unknow error");
        return Promise.reject(err);
    }
);

Vue.prototype.$http = axios;

new Vue({
    el: "#app",
    i18n,
    router,
    store,
    components: { NMS },
    template: "<NMS/>"
});
