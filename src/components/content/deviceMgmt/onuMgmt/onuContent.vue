<template>
    <div>
        <onu-basic-info v-if="showContent === 'onu_basic_info'"></onu-basic-info>
        <onu-port-cfg v-if="showContent === 'onu_port_cfg'"></onu-port-cfg>
        <onu-multicast v-if="showContent === 'onu_multicast'"></onu-multicast>
        <onu-perf-info v-if="showContent === 'onu_perf_info'"></onu-perf-info>
    </div>
</template>

<script>
import { mapState } from "Vuex";
export default {
    name: "onuContent",
    computed: mapState(["langMap"]),
    props: {
        showContent: { type: String }
    },
    components: {
        onuBasicInfo: () =>
            import(/* webpackChunkName: 'onu-config' */ "./onuBasicInfo"),
        onuPortCfg: () =>
            import(/* webpackChunkName: 'onu-config' */ "./onuPortCfg"),
        onuMulticast: () =>
            import(/* webpackChunkName: 'onu-config' */ "./onuMulticast"),
        onuPerfInfo: () =>
            import(/* webpackChunkName: 'onu-config' */ "./onuPerf")
    },
    inject: ["dev_ip"],
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
