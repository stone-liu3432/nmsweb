<template>
    <el-main>
        <div class="custom-breadcrumb">{{ langMap[breadcrumb] }}</div>
        <router-view/>
    </el-main>
</template>

<script>
import { mapState,mapMutations } from 'Vuex'
export default {
    name: 'contentArea',
    computed: mapState(['breadcrumb', 'langMap']),
    created(){
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
main{
    width: 100%;
    height: calc(100% - 61px);
    padding-bottom: 30px;
}
.custom-breadcrumb{
    margin: 8px 0 20px 10px;
    font-size: 16px;
    color: #233;
    text-align-last: left;
}
//  firefox 在有滚动条的情况下，padding-bottom将会失效
//  -moz-document 只有firefox浏览器能识别
@-moz-document url-prefix() {
    main {
        margin-bottom: 30px !important;
        padding-bottom: 0 !important;
        height: calc(100% - 91px) !important;
    }
}
</style>
