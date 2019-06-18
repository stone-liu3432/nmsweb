<template>
    <div>
        <h3>
            {{ langMap['rstp_b_info'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog(rstp, 'global')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <template v-for="(item,key) in rstp">
            <el-row style="margin: 10px 0;">
                <el-col :span="6">{{ langMap[key] }}</el-col>
                <el-col :span="6">{{ formatData(item, key) }}</el-col>
            </el-row>
        </template>
        <h3 style="margin-top: 30px;">
            {{ langMap['rstp_p_info'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog(null, 'port')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <el-table :data="rstpPort" border stripe>
            <el-table-column prop="port_id" :formatter="formatPort" :label="langMap['port_id']"></el-table-column>
            <el-table-column prop="port_priority" :label="langMap['port_priority']"></el-table-column>
            <el-table-column prop="port_path_cost" :label="langMap['port_path_cost']"></el-table-column>
            <el-table-column
                prop="edge_status"
                :formatter="formatEdge"
                :label="langMap['edge_status']"
            ></el-table-column>
            <el-table-column prop="admin_link_type" :label="langMap['admin_link_type']" width="150"></el-table-column>
            <el-table-column prop="oper_link_type" :label="langMap['oper_link_type']"></el-table-column>
            <el-table-column prop="port_role" :label="langMap['port_role']"></el-table-column>
            <el-table-column prop="port_state" :label="langMap['port_state']"></el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ langMap['config'] }}</span>
            <rstp-global-cfg
                :global-info="cacheData"
                v-if="dialogFlag === 'global'"
                ref="rstp-global-config"
            ></rstp-global-cfg>
            <rstp-port-cfg
                :port-info="Object.assign([], rstpPort)"
                v-if="dialogFlag === 'port'"
                ref="rstp-port-config"
            ></rstp-port-cfg>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitGlobal('rstp-global-config')"
                    v-if="dialogFlag === 'global'"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitPort('rstp-port-config')"
                    v-if="dialogFlag === 'port'"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import rstpGlobalCfg from "./rstpGlobalCfg";
import rstpPortCfg from "./rstpPortCfg";
export default {
    name: "rstp",
    components: { rstpGlobalCfg, rstpPortCfg },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            rstp: {},
            rstpPort: [],
            mode: ["stp", "", "rstp", "mstp"],
            dialogVisible: false,
            dialogFlag: "",
            cacheData: {}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_rstp",
                    params: { form: "bridge" }
                }),
                method: "get"
            })
                .then(res => {
                    this.rstp = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.rstp = res.data.data;
                            if (this.rstp.status) {
                                this.getPortData();
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getPortData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_rstp",
                    params: { form: "port" }
                }),
                method: "get"
            })
                .then(res => {
                    this.rstpPort = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.rstpPort = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatData(item, key) {
            if (key === "status") {
                return item ? this.langMap["enable"] : this.langMap["disable"];
            }
            if (key === "rstp_mode") {
                return this.mode[item] || "";
            }
            return item;
        },
        openDialog(data, flag) {
            this.dialogFlag = flag;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                data && (this.cacheData = Object.assign({}, data));
            });
        },
        submitGlobal(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var flags = {
                    status: 0x01,
                    mode: 0x20,
                    rb_priority: 0x02,
                    max_age: 0x04,
                    hello_time: 0x08,
                    forward_delay: 0x10,
                    transmit_hold_count: 0x100
                };
                var form = this.$refs[formName].rstpGlobal;
                var flag = 0;
                Object.keys(form).forEach(item => {
                    if (form[item] !== this.rstp[item]) {
                        flag |= flags[item];
                    }
                });
                this.$devProxy({
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_rstp",
                        params: { form: "bridge" }
                    }),
                    method: "set",
                    param: {
                        flags: flag,
                        status: form.status,
                        rstp_mode: form.rstp_mode,
                        rb_priority: form.rb_priority,
                        max_age: form.max_age,
                        hello_time: form.hello_time,
                        forward_delay: form.forward_delay,
                        transmit_hold_count: form.transmit_hold_count
                    }
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(this.langMap["set_success"]);
                            this.getData();
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.dialogVisible = false;
                    })
                    .catch(err => {});
            }
        },
        formatEdge(row, col) {
            return ["Nedge", "Edge"][row[col.property]];
        },
        formatPort(row, col) {
            return this.port_name[row[col.property]];
        },
        submitPort(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var flags = {
                    port_priority: 0x04,
                    port_path_cost: 0x02,
                    edge_status: 0x10,
                    admin_link_type: 0x08
                };
                var form = this.$refs[formName].portForm;
                var flag = 0;
                this.rstpPort.forEach(item => {
                    if (item.port_id === form.port_id) {
                        Object.keys(form).forEach(_item => {
                            if (form[_item] !== item[_item]) {
                                flag |= flags[_item];
                            }
                        });
                    }
                });
                if (!flag) {
                    return this.$message.error(this.langMap["modify_tips"]);
                }
                this.$devProxy({
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_rstp",
                        params: { form: "port" }
                    }),
                    method: "set",
                    param: {
                        flags: flag,
                        port_id: form.port_id,
                        port_priority: form.port_priority,
                        port_path_cost: form.port_path_cost,
                        edge_status: form.edge_status,
                        admin_link_type: form.admin_link_type
                    }
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(this.langMap["set_success"]);
                            this.getPortData();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {});
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
