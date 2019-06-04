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
import { removeUnderline } from "@/utils/common";
import "element-ui/lib/theme-chalk/index.css";
import "@/custom-css/custom.css";
import Message from "@/components/common/message";
import throttleButton from '@/components/common/debounceButton';
import qs from "qs";

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: sessionStorage.getItem("lang") || "en",
    messages: {
        en: enLocale,
        zh: zhLocale
    }
});
locale.i18n((key, value) => i18n.t(key, value));

Vue.use(Vuex);
Vue.use(ElementUI);
//  MessageBox 添加默认显示close按钮
Vue.prototype.$message = Message;

// 添加了throttle 的 el-button，用于表单提交
Vue.component('tButton', throttleButton);

Vue.filter("removeUnderline", removeUnderline);
Vue.config.productionTip = false;

axios.defaults.timeout = 5000;

if (process.env.NODE_ENV === "development") {
    //  开发模式
    axios.defaults.baseURL = "http://192.168.5.58:8200";
} else if (process.env.NODE_ENV == "production") {
    //  生产模式
    axios.defaults.baseURL = "";
}
//  request拦截器  -->  全局request添加请求头
axios.interceptors.request.use(
    config => {
        //  to do
        var token = sessionStorage.getItem("x-token");
        if (token) {
            config.headers["x-token"] = token;
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

Vue.prototype.$qs = ({ url, params }) => {
    if (!url || typeof url !== "string") {
        return "";
    }
    //  url第一个字符不为 / 时，添加
    if (url.charCodeAt(0) !== 47) {
        url = `/${url}`;
    }
    if (!params) {
        return url;
    }
    return url.indexOf("?") === -1
        ? `${url}?${qs.stringify(params)}`
        : `${url}&${qs.stringify(params)}`;
};

Vue.prototype.$devProxy = ({ devicelist, url, method, param }) => {
    return axios.post("/api/proxy", {
        devicelist,
        url,
        method,
        param
    });
};

Vue.prototype.$http = axios;

new Vue({
    el: "#app",
    i18n,
    router,
    store,
    components: { NMS },
    template: "<NMS/>"
});
