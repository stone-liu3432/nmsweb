<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="添加设备" name="node">
            <discover-node></discover-node>
        </el-tab-pane>
        <el-tab-pane label="发现网络" name="nwework">
            <discover-net></discover-net>
        </el-tab-pane>
        <el-tab-pane label="日志搜索" name="third">
            <log-search></log-search>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import discoverNode from './devDiscover/discover-node'
import discoverNet from './devDiscover/discover-network'
import logSearch from './devDiscover/log-search'
export default {
    name: 'devDiscover',
    components: { logSearch, discoverNode, discoverNet },
    data(){
        return {
            activeName: 'node'
        }
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>

</style>
