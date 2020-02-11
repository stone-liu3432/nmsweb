<template>
    <div>
        <div class="dhcp-relay">
            <span>{{ langMap['relay_admin'] }}:</span>
            <span>{{ admin ? langMap['enable'] : langMap['disable'] }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('admin')"
            >{{ langMap['config'] }}</el-button>
        </div>
        <div class="dhcp-relay" v-if="admin">
            <span>{{ langMap['relay_policy'] }}:</span>
            <span>{{ langMap[policies[data.relay_policy]] || '' }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('policy')"
            >{{ langMap['config'] }}</el-button>
            <template v-if="admin">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('server_ip')"
                >{{ langMap['add'] + langMap['server_ip'] }}</el-button>
            </template>
        </div>
        <template v-if="admin">
            <el-table :data="tableData" border stripe>
                <template v-if="policy === 0">
                    <el-table-column prop="vlan_id" :label="langMap['vlan_id']"></el-table-column>
                </template>
                <template v-if="policy === 1">
                    <el-table-column prop="option60" :label="langMap['option60']"></el-table-column>
                </template>
                <el-table-column prop="server_ip" :label="langMap['server_ip']"></el-table-column>
                <el-table-column width="100px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="deletePolicy(scope.row)"
                        >{{ langMap['delete'] }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ dialogTitle }}</div>
            <dhcp-relay-form :data="data" :type="dialogType" ref="dhcp-relay-form"></dhcp-relay-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-relay-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import dhcpRelayForm from "./dhcpRelayForm";
export default {
    name: "dhcpRelay",
    components: { dhcpRelayForm },
    computed: {
        ...mapState(["langMap", "dev_ip"]),
        admin() {
            return !!this.data.relay_admin;
        },
        policy() {
            return this.data.relay_policy;
        },
        dialogTitle() {
            if (this.dialogType === "admin") {
                return this.langMap["relay_admin"];
            }
            if (this.dialogType === "policy") {
                return this.langMap["relay_policy"];
            }
            if (this.dialogType === "server_ip") {
                return this.langMap["add"] + this.langMap["server_ip"];
            }
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            policies: ["standard", "option60"],
            tableData: [],
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getPolicyList();
    },
    methods: {
        getPolicyList() {
            this.tableData = [];
            let form = "relay_standard";
            if (this.policy === 1) {
                form = "relay_option60";
            }
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_dhcp",
                    params: { form }
                }),
                method: "get"
            }).then(res => {
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        this.tableData = res.data.data;
                    }
                }
            });
        },
        deletePolicy(row) {
            let url, param;
            if (this.policy === 0) {
                url = this.$qs({
                    url: "/switch_dhcp",
                    params: { form: "relay_standard_del" }
                });
                param = {
                    vlan_id: row.vlan_id,
                    server_ip: row.server_ip
                };
            }
            if (this.policy === 1) {
                url = this.$qs({
                    url: "/switch_dhcp",
                    params: { form: "relay_option60_del" }
                });
                param = {
                    option60: row.option60,
                    server_ip: row.server_ip
                };
            }
            if (!url || !param) return;
            this.$confirm(
                this.langMap["if_sure"] + this.langMap["delete"] + " ?"
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url,
                        method: "set",
                        param
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete"] +
                                        this.langMap["st_success"]
                                );
                                this.$emit("refreshData");
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog(type) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                const node = this.$refs["dhcp-relay-form"];
                node.reset();
                node.init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const ACTIONS = {
                        admin(data) {
                            if (data.relay_admin === this.data.relay_admin) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=relay_admin",
                                method: "set",
                                param: {
                                    relay_admin: data.relay_admin
                                }
                            };
                        },
                        policy(data) {
                            if (data.relay_policy === this.data.relay_policy) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=relay_policy",
                                method: "set",
                                param: {
                                    relay_policy: data.relay_policy
                                }
                            };
                        },
                        server_ip(data) {
                            let url, param;
                            if (this.data.relay_policy === 0) {
                                url = "/switch_dhcp?form=relay_standard_add";
                                param = {
                                    vlan_id: data.vlan_id,
                                    server_ip: data.server_ip
                                };
                            }
                            if (this.data.relay_policy === 1) {
                                url = "/switch_dhcp?form=relay_option60_add";
                                param = {
                                    option60: data.option60,
                                    server_ip: data.server_ip
                                };
                            }
                            return {
                                method: "set",
                                param,
                                url
                            };
                        }
                    };
                    if (typeof ACTIONS[this.dialogType] === "function") {
                        const data = ACTIONS[this.dialogType].call(this, valid);
                        if (data) {
                            this.sendData(data);
                        }
                    }
                }
            });
        },
        sendData(data) {
            this.$devProxy(Object.assign({ devicelist: [this.dev_ip] }, data))
                .then(res => {
                    if (res.data.code === 1) {
                        if (this.dialogType === "server_ip") {
                            this.$message.success(
                                this.langMap["add"] + this.langMap["st_success"]
                            );
                            this.getPolicyList();
                        } else {
                            this.$message.success(this.langMap["set_success"]);
                            this.$emit("refreshData");
                        }
                    } else {
                        this.$message.error(res.data.message);
                    }
                    this.closeDialog();
                })
                .catch(err => {});
        },
        closeDialog() {
            this.dialogVisible = false;
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-relay {
    margin: 10px;
    span {
        margin-right: 20px;
    }
}
</style>