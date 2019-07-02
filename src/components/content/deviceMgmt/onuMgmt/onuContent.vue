<template>
    <div>
        <onu-basic-info v-if="showContent === 'onu_basic_info'"></onu-basic-info>
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
        onuBasicInfo: () => import(/* webpackChunkName: 'onu-config' */ './onuBasicInfo')
    },
    inject: ['dev_ip'],
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
