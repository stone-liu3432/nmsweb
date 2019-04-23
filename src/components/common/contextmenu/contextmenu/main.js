import Vue from 'vue'
import contextMenu from './main.vue'

var defaults = {
    visible: true,
    data: [],
    left: '',
    top: ''
}
const _constructor = Vue.extend(contextMenu);

_constructor.prototype.close = function() {
    var vm = this;
    this.$on("after-leave", _ => {
        if (vm.$el && vm.$el.parentNode) {
            vm.$el.parentNode.removeChild(vm.$el);
        }
        vm.$destroy();
    });
    vm.visible = false;
};

const ctxMenu = (options = {}) => {
    if (Vue.prototype.$isServer) return;
    options = Object.assign({}, defaults, options);
    var parent = document.body;
    var instance = new _constructor({
        el: document.createElement("div"),
        data: options
    });
    //  兼容IE   Array.from()
    var nodelist = Array.prototype.slice.call(document.querySelectorAll("ul.context-menu"));
    if (nodelist.length !== 0) {
        nodelist.forEach(item => {
            parent.removeChild(item);
        });
    }
    parent.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.visible = true;
    });
    return instance;
};

export default ctxMenu