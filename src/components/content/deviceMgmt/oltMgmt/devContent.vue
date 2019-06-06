<template>
    <div>
        <running-status v-if="showContent === 'running_status'"></running-status>
        <remote-mgmt v-if="showContent === 'remote_mgmt'"></remote-mgmt>
        <service-ssh v-if="showContent === 'service'"></service-ssh>
        <olt-alarm v-if="showContent === 'alarm'"></olt-alarm>
        <olt-user-mgmt v-if="showContent === 'user_mgmt'"></olt-user-mgmt>
    </div>
</template>

<script>
const runningStatus = () => import(/* webpackChunkName: 'olt-system' */ './system/running-status');
const remoteMgmt = () => import(/* webpackChunkName: 'olt-system' */ './system/remoteMgmt');
const serviceSsh = () => import(/* webpackChunkName: 'olt-system' */'./system/service');
const oltAlarm = () => import(/* webpackChunkName: 'olt-system' */'./system/oltAlarm');
const oltUserMgmt = () => import(/* webpackChunkName: 'olt-system'  */'./system/oltUserMgmt');
export default {
    name: 'devContent',
    props: ['showContent'],
    components: { runningStatus, remoteMgmt, serviceSsh, oltAlarm, oltUserMgmt },
    data(){
        return {}
    },
    methods: {}
}
</script>

<style lang="less" scoped>
</style>
