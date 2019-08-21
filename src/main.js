import "babel-polyfill";
import Vue from "vue";
import Vuex from "Vuex";
import store from "./vuex/store";
import NMS from "./nms";
import router from "./router";
import ElementUI from "element-ui";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import { removeUnderline } from "@/utils/common";
import "element-ui/lib/theme-chalk/index.css";
import "@/custom-css/custom.css";
import Message from "@/components/common/message";
import debounceButton from '@/components/common/debounceButton';
import portNav from '@/components/common/portNav';
import axios, { _qs, devProxy, } from './config/httpConfig';
import contextMenu from '@/components/common/context-menu';
import contextMenuItem from '@/components/common/context-menu/context-menu-item';

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
Vue.use(portNav);
Vue.use(contextMenu);
Vue.use(contextMenuItem);
//  MessageBox 添加默认显示close按钮
Vue.prototype.$message = Message;

// 添加了 debounce 的 el-button，用于表单提交
Vue.component('dbcButton', debounceButton);

Vue.filter("removeUnderline", removeUnderline);
Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$qs = _qs;
Vue.prototype.$devProxy = devProxy;

new Vue({
    el: "#app",
    i18n,
    router,
    store,
    components: { NMS },
    template: "<NMS/>"
});
