import { Button } from "element-ui";
// 节流函数
function throttle(func, delay, context, event) {
    if (func.timer) {
        clearTimeout(func.timer);
        func.timer = setTimeout(_ => {
            func.apply(context, event);
            func.timer = null;
        }, delay);
    } else {
        func.timer = setTimeout(_ => {
            func.apply(context, event);
            func.timer = null;
        }, delay);
    }
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
        },
        type: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'small'
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
