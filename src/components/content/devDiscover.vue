<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="langMap['dev_group_mgmt']" name="group">
            <group-mgmt></group-mgmt>
        </el-tab-pane>
        <el-tab-pane :label="langMap['add_device']" name="node">
            <discover-node></discover-node>
        </el-tab-pane>
        <el-tab-pane :label="langMap['discovery_network']" name="nwework">
            <discover-net></discover-net>
        </el-tab-pane>
        <!-- <el-tab-pane label="日志搜索" name="third">
            <log-search></log-search>
        </el-tab-pane> -->
    </el-tabs>
</template>

<script>
import { mapState } from "vuex";
import discoverNode from './devDiscover/discover-node'
import discoverNet from './devDiscover/discover-network'
import logSearch from './devDiscover/log-search'
import groupMgmt from './devDiscover/group-mgmt'
export default {
    name: 'devDiscover',
    components: { logSearch, discoverNode, discoverNet, groupMgmt },
    computed: mapState(["langMap"]),
    data(){
        return {
            activeName: 'group'
        }
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>

</style>
