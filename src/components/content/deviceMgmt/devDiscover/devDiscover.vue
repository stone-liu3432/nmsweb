<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="langMap['discovery_network']" name="network">
            <discover-net v-if="activeName === 'network'"></discover-net>
        </el-tab-pane>
        <el-tab-pane :label="langMap['add_device']" name="node">
            <discover-node v-if="activeName === 'node'"></discover-node>
        </el-tab-pane>
        <el-tab-pane :label="langMap['dev_group_mgmt']" name="group">
            <group-mgmt v-if="activeName === 'group'"></group-mgmt>
        </el-tab-pane>
        <!-- <el-tab-pane label="日志搜索" name="third">
            <log-search></log-search>
        </el-tab-pane>-->
    </el-tabs>
</template>

<script>
import { mapState } from "Vuex";
import discoverNode from "./discover-node";
import discoverNet from "./discover-network";
import logSearch from "./log-search";
import groupMgmt from "./group-mgmt";
export default {
    name: "devDiscover",
    components: { logSearch, discoverNode, discoverNet, groupMgmt },
    computed: mapState(["langMap"]),
    data() {
        return {
            activeName: "network"
        };
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
