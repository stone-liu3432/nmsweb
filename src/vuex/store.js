import Vue from "vue";
import Vuex from "Vuex";
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    actions
});