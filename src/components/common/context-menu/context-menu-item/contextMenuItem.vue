<template>
    <div @click="itemClick" :class="['context-menu-item', { 'disabled': disabled }]">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'contex-menu-item',
    props: {
        command: {
            type: [Object, String]
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {}
    },
    methods: {
        itemClick(e){
            if(!this.disabled){
                this.$parent.$emit('command', this.command);
                this.$parent.$emit('update:visible', false);
            }
        }
    }
}
</script>

<style lang="less">
.context-menu-item{
    padding: 0 20px;
    line-height: 36px;
    cursor: pointer;
    user-select: none;
    &:hover{
        color: #67aef6;
    }
}
.disabled{
    cursor: not-allowed;
    color: #bbb;
    &:hover{
        color: #bbb;
    }
}
</style>