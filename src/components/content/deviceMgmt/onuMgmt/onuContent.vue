<template>
    <div>
        <onu-basic-info v-if="showContent === 'onu_basic_info'"></onu-basic-info>
        <onu-port-cfg v-if="showContent === 'onu_port_cfg'"></onu-port-cfg>
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
            import(/* webpackChunkName: 'onu-config' */ "./onuPortCfg")
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
