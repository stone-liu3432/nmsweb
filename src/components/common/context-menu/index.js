import ctxMenu from './contextMenu';

export default {
    install(Vue){
        Vue.component('context-menu', ctxMenu);
    }
}