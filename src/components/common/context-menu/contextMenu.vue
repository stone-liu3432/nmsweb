<template>
    <div
        v-show="visible"
        class="custom-context-menu"
        :style="{ left: `${location.x}px`, top: `${location.y}px` }"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "contextMenu",
    data() {
        return {};
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        location: {
            type: Object,
            default: _ => ({ x: 0, y: 0 })
        }
    },
    methods: {},
    watch: {
        visible() {
            if (this.visible) {
                this.$nextTick(_ => {
                    if (
                        this.$el.offsetWidth + this.location.x >
                        this.$parent.$el.offsetWidth
                    ) {
                        this.location.x -= this.$el.offsetWidth;
                    }
                    if (
                        this.$el.offsetHeight + this.location.y >
                        this.$parent.$el.offsetHeight
                    ) {
                        this.location.y -= this.$el.offsetHeight;
                    }
                });
            }
        }
    }
};
</script>

<style lang="less">
.custom-context-menu {
    background: #fff;
    border-radius: 3px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    min-width: 250px;
    padding: 10px 0;
    position: absolute;
    box-shadow: 5px 5px 5px 2px rgba(0, 0, 0, 0.1);
}
</style>