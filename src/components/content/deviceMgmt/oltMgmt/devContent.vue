<template>
    <div>
        <running-status v-if="showContent === 'running_status'"></running-status>
        <remote-mgmt v-if="showContent === 'remote_mgmt'"></remote-mgmt>
    </div>
</template>

<script>
const runningStatus = () => import(/* webpackChunkName: olt-system */ './system/running-status');
const remoteMgmt = () => import(/* webpackChunkName: olt-system */ './system/remoteMgmt');
export default {
    name: 'devContent',
    props: ['showContent'],
    components: { runningStatus, remoteMgmt },
    data(){
        return {}
    },
    methods: {}
}
</script>

<style lang="less" scoped>
</style>
