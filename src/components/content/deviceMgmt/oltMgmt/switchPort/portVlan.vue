<template>
    <div>
        <port-nav @port-change="portChange" type="port">
            <template slot="title">{{ langMap['port_vlan'] }}</template>
        </port-nav>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="langMap['vlan_cfg']" name="vlan_cfg">
                <pv-cfg v-if="activeName === 'vlan_cfg'" :port_id="port_id"></pv-cfg>
            </el-tab-pane>
            <el-tab-pane label="VLAN Translate" name="vlan_translate">
                <pv-translate v-if="activeName === 'vlan_translate'" :port_id="port_id"></pv-translate>
            </el-tab-pane>
            <el-tab-pane label="VLAN QinQ" name="vlan_qinq">
                <pv-qinq v-if="activeName === 'vlan_qinq'" :port_id="port_id"></pv-qinq>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import pvCfg from "./portVlan/vlanCfg";
import pvTranslate from "./portVlan/vlanTranslate";
import pvQinq from "./portVlan/vlanQinq";
export default {
    name: "portVlan",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    components: { pvCfg, pvTranslate, pvQinq },
    data() {
        return {
            port_id: 1,
            activeName: "vlan_cfg"
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
