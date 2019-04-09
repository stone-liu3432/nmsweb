import Vue from "vue";
import Vuex from "vuex";
import menu from '../config/menu.js'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        menu,
    },
    mutations: {
        changeLoadingState(state, data){
            state.isLoading = data;
        }
    }
});