import Vue from "vue";
import Vuex from "vuex";
import menu from '../config/menu.js'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        menu,
        //  主题    dark   light   primary(仅适用于水平排列 Menu组件,mode="horizontal")
        theme: 'dark'
    },
    mutations: {
        changeLoadingState(state, data){
            state.isLoading = data;
        },
        chnageTheme(state, data){
            state.theme = data;
        }
    }
});