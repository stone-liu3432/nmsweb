<template>
    <div>
        <running-status v-if="showContent === 'running_status'"></running-status>
        <remote-mgmt v-if="showContent === 'remote_mgmt'"></remote-mgmt>
        <service-ssh v-if="showContent === 'service'"></service-ssh>
        <olt-alarm v-if="showContent === 'alarm'"></olt-alarm>
        <olt-user-mgmt v-if="showContent === 'user_mgmt'"></olt-user-mgmt>
        <olt-time-set v-if="showContent === 'time'"></olt-time-set>
        <onu-allow v-if="showContent === 'onu_allow'"></onu-allow>
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
        <time-range v-if="showContent === 'time_range'"></time-range>
        <acl-mgmt v-if="showContent === 'acl_mgmt'"></acl-mgmt>
        <packet-filter v-if="showContent === 'packet_filter'"></packet-filter>
        <qos-mgmt v-if="showContent === 'QoS'"></qos-mgmt>
        <static-route v-if="showContent === 'route_mgmt'"></static-route>
        <arp-table v-if="showContent === 'ARP'"></arp-table>
        <diagonose v-if="showContent === 'diagonose'"></diagonose>
        <dev-mgmt v-if="showContent === 'dev_mgmt'"></dev-mgmt>
        <dhcp v-if="showContent === 'dhcp'"></dhcp>
    </div>
</template>

<script>
const runningStatus = () =>
    import(/* webpackChunkName: 'system' */ "./system/running-status");
const remoteMgmt = () =>
    import(/* webpackChunkName: 'system' */ "./system/remoteMgmt");
const serviceSsh = () =>
    import(/* webpackChunkName: 'system' */ "./system/service");
const oltAlarm = () =>
    import(/* webpackChunkName: 'system' */ "./system/oltAlarm");
const oltUserMgmt = () =>
    import(/* webpackChunkName: 'system'  */ "./system/oltUserMgmt");
const oltTimeSet = () =>
    import(/* webpackChunkName: 'system' */ "./system/oltTime");
const onuDeny = () => import(/* webpackChunkName: 'pon' */ "./pon/onuDeny");
const slaCfg = () => import(/* webpackChunkName: 'pon' */ "./pon/slaCfg");
const ponSetting = () =>
    import(/* webpackChunkName: 'pon' */ "./pon/ponSetting");
const loidMgmt = () => import(/* webpackChunkName: 'pon' */ "./pon/loid");
const ponOptical = () =>
    import(/* webpackChunkName: 'pon' */ "./pon/ponOptical");
const portInfo = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./switchPort/portInfo");
const perfInfo = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./switchPort/perfInfo");
const portConfig = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./switchPort/portCfg");
const portVlan = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./switchPort/portVlan");
const macMgmt = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./layer2/macMgmt");
const vlanMgmt = () =>
    import(/* webpackChunkName: 'port-mgmt' */ "./layer2/vlanMgmt");
const rstp = () => import(/* webpackChunkName: 'protocol' */ "./protocol/rstp");
const igmp = () => import(/* webpackChunkName: 'protocol' */ "./protocol/igmp");
const timeRange = () =>
    import(/* webpackChunkName: 'acl-qos' */ "./acl-qos/timerange");
const aclMgmt = () =>
    import(/* webpackChunkName: 'acl-qos' */ "./acl-qos/aclMgmt");
const packetFilter = () =>
    import(/* webpackChunkName: 'acl-qos' */ "./acl-qos/packetfilter");
const qosMgmt = () => import(/* webpackChunkName: 'acl-qos' */ "./acl-qos/qos");
const staticRoute = () =>
    import(/* webpackChunkName: 'route' */ "./route/staticRoute");
const arpTable = () => import(/* webpackChunkName: 'route' */ "./route/arp");
const diagonose = () =>
    import(/* webpackChunkName: 'system' */ "./system/diagonose");
const devMgmt = () =>
    import(/* webpackChunkName: 'system' */ "./system/devMgmt");
const onuAllow = () => import(/* webpackChunkName: 'pon' */ "./pon/onuAllow");
const dhcp = () => import(/* webpackChunkName: 'protocol' */ "./protocol/dhcp");
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
        onuAllow,
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
        igmp,
        timeRange,
        aclMgmt,
        packetFilter,
        qosMgmt,
        staticRoute,
        arpTable,
        diagonose,
        devMgmt,
        dhcp
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
