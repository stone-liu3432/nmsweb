import { Button } from "element-ui";
import { debounce } from '@/utils/common';

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
            debounce(_handleClick, this.interval, this, event);
        }
    }
};
