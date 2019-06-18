<template>
    <div>
        <running-status v-if="showContent === 'running_status'"></running-status>
        <remote-mgmt v-if="showContent === 'remote_mgmt'"></remote-mgmt>
        <service-ssh v-if="showContent === 'service'"></service-ssh>
        <olt-alarm v-if="showContent === 'alarm'"></olt-alarm>
        <olt-user-mgmt v-if="showContent === 'user_mgmt'"></olt-user-mgmt>
        <olt-time-set v-if="showContent === 'time'"></olt-time-set>
        <onu-deny v-if="showContent === 'onu_deny'"></onu-deny>
        <sla-cfg v-if="showContent === 'sla_cfg'"></sla-cfg>
        <pon-setting v-if="showContent === 'pon_setting'"></pon-setting>
        <loid-mgmt v-if="showContent === 'loid_mgmt'"></loid-mgmt>
        <pon-optical v-if="showContent === 'pon_optical'"></pon-optical>
        <port-info v-if="showContent === 'port_info'"></port-info>
        <perf-info v-if="showContent === 'perf_info'"></perf-info>
        <port-config v-if="showContent === 'port_cfg'"></port-config>
        <port-vlan v-if="showContent === 'port_vlan'"></port-vlan>
        <mac-mgmt v-if="showContent === 'mac_mgmt'"></mac-mgmt>
        <vlan-mgmt v-if="showContent === 'vlan_mgmt'"></vlan-mgmt>
        <rstp v-if="showContent === 'rstp'"></rstp>
        <igmp v-if="showContent === 'igmp'"></igmp>
    </div>
</template>

<script>
const runningStatus = () =>
    import(/* webpackChunkName: 'olt-system' */ "./system/running-status");
const remoteMgmt = () =>
    import(/* webpackChunkName: 'olt-system' */ "./system/remoteMgmt");
const serviceSsh = () =>
    import(/* webpackChunkName: 'olt-system' */ "./system/service");
const oltAlarm = () =>
    import(/* webpackChunkName: 'olt-system' */ "./system/oltAlarm");
const oltUserMgmt = () =>
    import(/* webpackChunkName: 'olt-system'  */ "./system/oltUserMgmt");
const oltTimeSet = () =>
    import(/* webpackChunkName: 'olt-system' */ "./system/oltTime");
const onuDeny = () => import(/* webpackChunkName: 'olt-pon' */ "./pon/onuDeny");
const slaCfg = () => import(/* webpackChunkName: 'olt-pon' */ "./pon/slaCfg");
const ponSetting = () =>
    import(/* webpackChunkName: 'olt-pon' */ "./pon/ponSetting");
const loidMgmt = () => import(/* webpackChunkName: 'olt-pon' */ "./pon/loid");
const ponOptical = () =>
    import(/* webpackChunkName: 'olt-pon' */ "./pon/ponOptical");
const portInfo = () =>
    import(/* webpackChunkName: 'olt-port' */ "./switchPort/portInfo");
const perfInfo = () =>
    import(/* webpackChunkName: 'olt-port' */ "./switchPort/perfInfo");
const portConfig = () =>
    import(/* webpackChunkName: 'olt-port' */ "./switchPort/portCfg");
const portVlan = () =>
    import(/* webpackChunkName: 'olt-port' */ "./switchPort/portVlan");
const macMgmt = () =>
    import(/* webpackChunkName: 'olt-port' */ "./layer2/macMgmt");
const vlanMgmt = () =>
    import(/* webpackChunkName: 'olt-port' */ "./layer2/vlanMgmt");
const rstp = () =>
    import(/* webpackChunkName: 'olt-protocol' */ "./protocol/rstp");
    const igmp = () => import(/* webpackChunkName: 'olt-protocol' */ './protocol/igmp');
export default {
    name: "devContent",
    props: ["showContent"],
    components: {
        runningStatus,
        remoteMgmt,
        serviceSsh,
        oltAlarm,
        oltUserMgmt,
        oltTimeSet,
        onuDeny,
        slaCfg,
        ponSetting,
        loidMgmt,
        ponOptical,
        portInfo,
        perfInfo,
        portConfig,
        portVlan,
        macMgmt,
        vlanMgmt,
        rstp,
        igmp
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
