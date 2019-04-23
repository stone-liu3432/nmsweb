import ctxMenu from "./contextmenu/main";

export default {
    install(Vue) {
        Vue.prototype.$ctxMenu = ctxMenu;
    }
};
