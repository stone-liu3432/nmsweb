<template>
    <div>
        <div class="dhcp-snooping">
            <span>{{ langMap['snooping_admin'] }}</span>
            <span>{{ admin === 1 ? langMap['enable'] : langMap['disable'] }}</span>
            <el-button
                type="primary"
                size="small"
                @click="openDialog('snooping_admin')"
            >{{ langMap['config'] }}</el-button>
        </div>
        <template v-if="admin">
            <div class="dhcp-snooping">
                <span>{{ langMap['chaddr_check'] }}</span>
                <span>{{ data.chaddr_check === 1 ? langMap['enable'] : langMap['disable'] }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('chaddr_check')"
                >{{ langMap['config'] }}</el-button>
            </div>
            <div class="dhcp-snooping">
                <span>{{ langMap['response_time'] }}</span>
                <span>{{ data.response_time }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('response_time')"
                >{{ langMap['config'] }}</el-button>
            </div>
            <div class="dhcp-snooping">
                <span>{{ langMap['trust_portlist'] }}</span>
                <span>{{ formatPortlist(data.trust_portlist) }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('add')"
                >{{ langMap['add'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('delete')"
                >{{ langMap['delete'] }}</el-button>
            </div>
            <h3>
                <span style="margin-right: 30px;">{{ langMap['snooping_table'] }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="clearSnoopingTable"
                >{{ langMap['clear'] }}</el-button>
                <el-button type="primary" size="small" @click="refresh">{{ langMap['refresh'] }}</el-button>
            </h3>
            <el-table :data="snoopingTable" border stripe>
                <el-table-column :label="langMap['ipaddr']" prop="ipaddr"></el-table-column>
                <el-table-column :label="langMap['macaddr']" prop="macaddr"></el-table-column>
                <el-table-column :label="langMap['port_id']">
                    <template slot-scope="scope">{{ port_name[scope.row.port_id] }}</template>
                </el-table-column>
                <el-table-column :label="langMap['vlan_id']" prop="vlan_id"></el-table-column>
                <el-table-column :label="langMap['lease_time']" prop="lease_time"></el-table-column>
                <el-table-column :label="langMap['entry_status']">
                    <template slot-scope="scope">{{ scope.row.entry_status ? 'Valid' : 'Invalid' }}</template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ dialogTitle }}</div>
            <dhcp-snooping-form :data="data" :type="dialogType" ref="dhcp-snooping-form"></dhcp-snooping-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-snooping-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { analysisPortList, generatorPortName, debounce } from "@/utils/common";
import dhcpSnoopingForm from "./dhcpSnoopingForm";
export default {
    name: "dhcpSnooping",
    components: { dhcpSnoopingForm },
    computed: {
        ...mapState(["langMap", "dev_ip", "port_name"]),
        admin() {
            return this.data.snooping_admin;
        },
        dialogTitle() {
            return this.langMap[this.dialogType];
        },
        plist() {
            return analysisPortList(this.data.trust_portlist);
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            snoopingTable: [],
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        formatPortlist(portlist) {
            return generatorPortName(
                analysisPortList(portlist),
                this.port_name
            );
        },
        getData() {
            this.snoopingTable = [];
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_dhcp",
                    params: { form: "snooping_table" }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.snoopingTable = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        refresh() {
            debounce(this.getData, 1000, this);
        },
        openDialog(type) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                this.$refs["dhcp-snooping-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const ACTIONS = {
                        snooping_admin(data) {
                            if (
                                data.snooping_admin === this.data.snooping_admin
                            ) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_admin",
                                param: {
                                    snooping_admin: data.snooping_admin
                                }
                            };
                        },
                        chaddr_check(data) {
                            if (data.chaddr_check === this.data.chaddr_check) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_chaddr",
                                param: {
                                    chaddr_check: data.chaddr_check
                                }
                            };
                        },
                        response_time(data) {
                            if (
                                data.response_time === this.data.response_time
                            ) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_response",
                                param: {
                                    response_time: data.response_time
                                }
                            };
                        },
                        add(data) {
                            if (
                                data.trust_portlist.length === this.plist.length
                            ) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_trust_add",
                                param: {
                                    trust_portlist: data.trust_portlist.toString()
                                }
                            };
                        },
                        delete(data) {
                            if (data.trust_portlist.length === 0) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_trust_del",
                                param: {
                                    trust_portlist: data.trust_portlist
                                }
                            };
                        }
                    };
                    if (typeof ACTIONS[this.dialogType] === "function") {
                        const data = ACTIONS[this.dialogType].call(
                            this,
                            formData
                        );
                        if (data) {
                            this.sendData(
                                Object.assign(
                                    {
                                        devicelist: [this.dev_ip],
                                        method: "set"
                                    },
                                    data
                                )
                            );
                        }
                    }
                }
            });
        },
        sendData(data) {
            this.$devProxy(data)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.$emit("refreshData");
                    } else {
                        this.$message.error(res.data.message);
                    }
                    this.dialogVisible = false;
                })
                .catch(err => {});
        },
        clearSnoopingTable() {
            this.$confirm(this.langMap["if_sure"] + this.langMap["clear"] + "?")
                .then(_ => {
                    const data = {
                        devicelist: [this.dev_ip],
                        method: "set",
                        url: "/switch_dhcp?form=snooping_flush",
                        param: {}
                    };
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["clear"] +
                                        this.langMap["st_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .then(_ => {})
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-snooping {
    margin: 20px 10px;
    span {
        &:first-child {
            display: inline-block;
            width: 150px;
        }
        & + span {
            margin-right: 30px;
            max-width: 60%;
            display: inline-block;
            word-break: break-all;
            word-wrap: break-word;
        }
    }
}
</style>