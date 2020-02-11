<template>
    <div>
        <h3>DHCP</h3>
        <h3 class="dhcp-admin">
            <span>DHCP{{ langMap['status'] }}:</span>
            <span>{{ dhcpData.dhcp_admin ? langMap['on'] : langMap['off'] }}</span>
            <el-button
                type="primary"
                size="small"
                @click="changeAdminState"
            >{{ dhcpData.dhcp_admin ? langMap['off'] : langMap['on'] }}</el-button>
        </h3>
        <template v-if="dhcpData.dhcp_admin">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="DHCP Relay" name="relay">
                    <dhcp-relay
                        :data="dhcpData"
                        @refreshData="getData"
                        v-if="activeName === 'relay'"
                    ></dhcp-relay>
                </el-tab-pane>
                <el-tab-pane label="DHCP Option82" name="option82">
                    <dhcp-option82
                        :data="dhcpData"
                        @refreshData="getData"
                        v-if="activeName === 'option82'"
                    ></dhcp-option82>
                </el-tab-pane>
                <el-tab-pane label="DHCP Snooping" name="snooping">
                    <dhcp-snooping :data="dhcpData" v-if="activeName === 'snooping'"></dhcp-snooping>
                </el-tab-pane>
                <el-tab-pane label="DHCP Server" name="server">
                    <dhcp-server :data="dhcpData" v-if="activeName === 'server'"></dhcp-server>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import dhcpRelay from "./dhcpRelay";
import dhcpOption82 from "./dhcpOption82";
import dhcpSnooping from "./dhcpSnooping";
import dhcpServer from "./dhcpServer";
export default {
    name: "dhcp",
    components: { dhcpRelay, dhcpOption82, dhcpSnooping, dhcpServer },
    computed: {
        ...mapState(["langMap", "dev_ip", "timestamp"])
    },
    data() {
        return {
            dhcpData: {},
            activeName: "relay"
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.dhcpData = {};
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_dhcp",
                    params: { form: "global_config" }
                }),
                method: "get"
            }).then(res => {
                if (res.data.code === 1) {
                    if (res.data.data) {
                        this.dhcpData = res.data.data;
                    }
                }
            });
        },
        changeAdminState() {
            const flag = !!this.dhcpData.dhcp_admin;
            const action = flag ? this.langMap["close"] : this.langMap["open"];
            this.$confirm(this.langMap["if_sure"] + " " + action + " DHCP ?")
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_dhcp",
                            params: { form: "dhcp_admin" }
                        }),
                        method: "set",
                        param: {
                            dhcp_admin: Number(!flag)
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-admin {
    margin: 10px;
    span {
        margin-right: 20px;
    }
}
</style>