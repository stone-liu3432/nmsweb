import { Button } from 'element-ui';
// 节流函数
function throttle(func, delay, context, event) {
    if(func.timer){
        return;
    }
    func.timer = true;
    func.call(context, event);
    setTimeout(function() {
        func.timer = false;
    }, delay);
}
// element-ui 中click方法拷贝
function _handleClick(event) {
    this.$emit("click", event);
}
// 导出新组件
export default {
    props: {
        interval: {
            type: Number,
            default: 300
        }
    },
    mixins: [Button],
    data() {
        return {};
    },
    methods: {
        handleClick(event) {
            throttle(_handleClick, this.interval, this, event);
        }
    }
};
