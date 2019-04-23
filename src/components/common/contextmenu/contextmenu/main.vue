<template>
    <transition name="context-menu" v-if="visible">
        <ul v-if="data.data.tag && data.data.value" :style="{ 'left': left, 'top': top, 'width': width }" class="context-menu" ref="ctxMenu">
            <li v-for="(item, index) in data.data.tag" :key="index" @click="emmitEvt(data.data.value)">{{ item }}</li>
        </ul>
    </transition>
</template>

<script>
export default {
    name: 'contextmenu',
    data(){
        return {
            data: {},
            visible: true,
            left: '20px',
            top: '30px',
            width: '240px'
        }
    },
    mounted(){
        document.addEventListener('keydown', this.keydown, false);
        document.addEventListener('click', this._click, true);
        document.addEventListener('contextmenu', this.ctxmenu, true);
    },
    computed: {
    },
    methods: {
        keydown(e){
            if (e.keyCode === 27) {     // esc关闭消息
                this.close_menu();
            }
        },
        close_menu(){
            this.visible = false;
        },
        _click(e){
            var ev = e || window.event;
            if(e.target !== this.$refs.ctxMenu){
                this.close_menu();
            }
        },
        ctxmenu(e){
            var ev = e || window.event;
            if(e.target !== this.$refs.ctxmenu){
                this.close_menu();
            }
        },
        emmitEvt(item){
            this.$bus.$emit('ctxMenuClick', item);
            this.close_menu();
            this.$destroy();
        }
    },
    beforeDestroy(){
        document.removeEventListener('keydown', this.keydown);
        document.removeEventListener('click', this._click);
        document.removeEventListener('contextmenu', this.ctxmenu);
    }
}
</script>

<style lang="less" scoped>
ul{
    list-style: none;
    margin: 0;
    background: #fff;
    padding: 0;
    border: 1px solid #bababa;
    box-shadow: 3px 3px 3px #8E8E8E;
    position: fixed;
    z-index: 999;
    >li{
        padding: 6px 20px;
        &:hover{
            background: #E8EAED;
        }
    }
}
// .context-menu-enter-active {
//     transition: all 0.3s linear;
// }
// .context-menu-leave-active {
//     transition: all 0.3s linear;
// }
// .context-menu-enter,
// .context-menu-leave-to {
//     opacity: 0;
// }
</style>
