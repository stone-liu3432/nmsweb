<template>
    <div class="nms-main">
        <nav-header></nav-header>
        <content-area></content-area>
        <common-footer></common-footer>
    </div>
</template>

<script>
import navHeader from '../main/header'
import contentArea from '../main/content'
import commonFooter from '../main/footer'
export default {
    name: 'nmsMain',
    components: { navHeader, contentArea, commonFooter },
    data(){
        return {}
    },
    created(){},
    methods: {}
}
</script>

<style lang="less" scoped>
.nms-main{
    margin: 0 0 30px 0;
}
</style>
