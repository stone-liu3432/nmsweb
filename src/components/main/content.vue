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
}
.custom-breadcrumb{
    margin: 8px 0 20px 10px;
    font-size: 16px;
    color: #233;
    text-align-last: left;
}
</style>
