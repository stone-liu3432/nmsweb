<template>
    <div>
        <h3>IGMP</h3>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="langMap['info']" name="info">
                <igmp-info v-if="activeName === 'info'"></igmp-info>
            </el-tab-pane>
            <el-tab-pane :label="langMap['multicast_table']" name="multicast_table">
                <igmp-multicast v-if="activeName === 'multicast_table'"></igmp-multicast>
            </el-tab-pane>
            <el-tab-pane :label="langMap['mvlan']" name="mvlan">
                <igmp-mvlan v-if="activeName === 'mvlan'"></igmp-mvlan>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import igmpInfo from './igmpInfo';
import igmpMulticast from './igmpMulticast';
import igmpMvlan from './igmpMvlan';
export default {
    name: "igmp",
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"])
    },
    components: { igmpInfo, igmpMulticast, igmpMvlan },
    data() {
        return {
            activeName: 'info'
        };
    },
    created() {},
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
