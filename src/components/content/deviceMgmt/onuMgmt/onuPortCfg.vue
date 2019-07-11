<template>
    <div>
        <h3>
            {{ langMap['onu_port_cfg'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('basic-info')"
            >{{ langMap['onu_port_config'] }}</el-button>
        </h3>
        <el-table :data="opInfo" border stripe>
            <el-table-column prop="op_id" :label="langMap['op_id']"></el-table-column>
            <el-table-column :label="langMap['status']" width="100px">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status ? '' : 'danger'"
                    >{{ scope.row.status ? langMap['link_up'] : langMap['link_down'] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="autoneg" :formatter="formatState" :label="langMap['auto_neg']"></el-table-column>
            <el-table-column
                prop="flow_ctrl"
                :formatter="formatState"
                :label="langMap['flow_ctrl']"
            ></el-table-column>
            <el-table-column
                prop="loopdetect"
                :formatter="formatState"
                :label="langMap['loopdetect']"
            ></el-table-column>
            <el-table-column prop="enable" :formatter="formatState" :label="langMap['enable']"></el-table-column>
            <el-table-column
                prop="rlds_opt"
                :formatter="formatState"
                :label="langMap['rlds_opt']"
                width="100px"
            ></el-table-column>
            <el-table-column prop="rl_cir" :label="langMap['rl_cir']" width="80px"></el-table-column>
            <el-table-column prop="rl_pir" :label="langMap['rl_pir']" width="80px"></el-table-column>
            <el-table-column prop="rlus_opt" :formatter="formatState" :label="langMap['rlus_opt']"></el-table-column>
            <el-table-column prop="bandwidth" :label="langMap['bandwidth']"></el-table-column>
        </el-table>
        <h3 style="margin-top: 30px;">
            ONU{{ langMap['port_vlan'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('set-port-vlan')"
            >{{ langMap['onu_vlan_mode_cfg'] }}</el-button>
        </h3>
        <el-table :data="opVlan" border stripe :row-class-name="setRowClassName">
            <el-table-column type="expand">
                <template slot-scope="props" v-if="props.row.vlan_list">
                    <el-table
                        border
                        stripe
                        :data="props.row.vlan_list"
                        v-if="props.row.op_vlan_mode === 2"
                        key="onu-vlan-mode-translate"
                    >
                        <el-table-column label="old vlan" prop="old_vlan_id"></el-table-column>
                        <el-table-column label="new vlan" prop="new_vlan_id"></el-table-column>
                        <el-table-column :label="langMap['new_vlan_pri']" prop="new_vlan_pri"></el-table-column>
                        <el-table-column :label="langMap['config']" width="80px">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    @click="delopvlan(props.row, scope.row)"
                                >{{ langMap['delete'] }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        border
                        stripe
                        :data="props.row.vlan_list"
                        v-if="props.row.op_vlan_mode === 4"
                        key="onu-vlan-mode-trunk"
                    >
                        <el-table-column :label="langMap['start_vlan_id']" prop="start_vlan_id"></el-table-column>
                        <el-table-column :label="langMap['end_vlan_id']" prop="end_vlan_id"></el-table-column>
                        <el-table-column :label="langMap['config']" width="80px">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    @click="delopvlan(props.row, scope.row)"
                                >{{ langMap['delete'] }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column :label="langMap['op_id']" prop="op_id"></el-table-column>
            <el-table-column :label="langMap['op_vlan_mode']" prop="op_vlan_mode">
                <template slot-scope="scope">{{ opVlanMode[scope.row.op_vlan_mode] }}</template>
            </el-table-column>
            <el-table-column :label="langMap['def_vlan_id']" prop="def_vlan_id"></el-table-column>
            <el-table-column :label="langMap['def_vlan_pri']" prop="def_vlan_pri"></el-table-column>
            <el-table-column :label="langMap['config']" width="80px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        v-if="scope.row.op_vlan_mode === 2 || scope.row.op_vlan_mode === 4"
                        @click="addPortVlan(scope.row)"
                    >{{ langMap['add'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['config'] }}</span>
            <onu-basic-info-form
                :form-info="opInfo"
                ref="onu-set-basic-info"
                v-if="dialogFlag === 'basic-info'"
            ></onu-basic-info-form>
            <onu-add-port-vlan-form
                :form-info="subOp"
                v-if="dialogFlag === 'add-port-vlan'"
                ref="onu-add-port-vlan"
            ></onu-add-port-vlan-form>
            <onu-set-port-vlan
                :form-info="opVlan"
                v-if="dialogFlag === 'set-port-vlan'"
                ref="onu-set-port-vlan"
            ></onu-set-port-vlan>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'basic-info'"
                    @click="submitForm('onu-set-basic-info')"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'add-port-vlan'"
                    @click="submitForm('onu-add-port-vlan')"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'set-port-vlan'"
                    @click="submitForm('onu-set-port-vlan')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import onuBasicInfoForm from "./onuBasicInfoForm";
import onuAddPortVlanForm from "./onuAddPortVlan";
import onuSetPortVlan from "./onuSetPortVlan";
export default {
    name: "onuPortCfg",
    computed: {
        ...mapState(["langMap", "port_name"])
    },
    components: {
        onuBasicInfoForm,
        onuAddPortVlanForm,
        onuSetPortVlan
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    data() {
        return {
            opInfo: [],
            opVlan: [],
            subOp: {},
            dialogVisible: false,
            dialogFlag: "",
            opVlanMode: [
                "transparent",
                "tag",
                "translate",
                "aggregation",
                "trunk"
            ]
        };
    },
    created() {
        this.getPortCfg();
        this.getPortVlan();
    },
    methods: {
        getPortCfg() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "port_cfg",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.opInfo = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.opInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getPortVlan() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "port_vlan",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.opVlan = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.opVlan = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatState(row, col) {
            return row[col.property]
                ? this.langMap["enable"]
                : this.langMap["disable"];
        },
        formatStatus(row, col) {
            return row[col.property]
                ? this.langMap["link_up"]
                : this.langMap["link_down"];
        },
        openDialog(flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
        },
        submitForm(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var form = this.$refs[formName].formData;
                var data = this.composeData(form);
                this.$devProxy(data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                            if(this.dialogFlag === 'basic-info'){
                                this.getPortCfg();
                            }else{
                                this.getPortVlan();
                            }
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.dialogVisible = false;
                    })
                    .catch(err => {});
            }
        },
        composeData(form) {
            var data,
                flag = 0;
            if (this.dialogFlag === "basic-info") {
                var flags = {
                    auto_neg: 0x1,
                    flow_ctrl: 0x2,
                    loopdetect: 0x4,
                    enable: 0x8,
                    rlds_opt: 0x10,
                    rl_cir: 0x10,
                    rl_pir: 0x10,
                    rlus_opt: 0x10,
                    bandwidth: 0x10
                };
                this.opInfo.forEach(item => {
                    if (item.op_id === form.op_id) {
                        Object.keys(flags).forEach(_item => {
                            if (
                                item[_item] !== form[_item] &&
                                (flag & 0x10) !== 0x10
                            ) {
                                flag |= flags[_item];
                            }
                        });
                    }
                });
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/onumgmt",
                        params: {
                            form: "port_cfg"
                        }
                    }),
                    method: "set",
                    param: {
                        port_id: this.port_id,
                        onu_id: this.onu_id,
                        op_id: form.op_id,
                        flags: flag,
                        auto_neg: form.auto_neg,
                        flow_ctrl: form.flow_ctrl,
                        loopdetect: form.loopdetect,
                        enable: form.enable,
                        rlds_opt: form.rlds_opt,
                        rl_cir: form.rl_cir,
                        rl_pir: form.rl_pir,
                        rlus_opt: form.rlus_opt,
                        bandwidth: form.bandwidth
                    }
                };
            }
            if (this.dialogFlag === "add-port-vlan") {
                var param = {
                    port_id: this.port_id,
                    onu_id: this.onu_id,
                    op_id: this.subOp.op_id,
                    op_vlan_mode: this.subOp.op_vlan_mode
                };
                if (this.subOp.op_vlan_mode === 2) {
                    param.old_vlan_id = form.old_vlan_id;
                    param.new_vlan_id = form.new_vlan_id;
                    param.new_vlan_pri = form.new_vlan_pri;
                }
                if (this.subOp.op_vlan_mode === 4) {
                    param.start_vlan_id = form.start_vlan_id;
                    param.end_vlan_id = form.end_vlan_id;
                }
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/onumgmt",
                        params: {
                            form: "port_vlanlist"
                        }
                    }),
                    method: "add",
                    param
                };
            }
            if (this.dialogFlag === "set-port-vlan") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/onumgmt",
                        params: {
                            form: "port_vlan"
                        }
                    }),
                    method: "set",
                    param: {
                        port_id: this.port_id,
                        onu_id: this.onu_id,
                        op_id: form.op_id,
                        op_vlan_mode: form.op_vlan_mode,
                        def_vlan_id: form.def_vlan_id,
                        def_vlan_pri: form.def_vlan_pri
                    }
                };
            }
            return data;
        },
        setRowClassName({ row }) {
            if (!row.vlan_list) {
                return "row-expand-hidden";
            }
        },
        delopvlan(row, subrow) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    var param = {
                        port_id: this.port_id,
                        onu_id: this.onu_id,
                        op_id: row.op_id,
                        op_vlan_mode: row.op_vlan_mode
                    };
                    if (row.op_vlan_mode === 2) {
                        //  translate
                        param.new_vlan_id = subrow.new_vlan_id;
                        param.old_vlan_id = subrow.old_vlan_id;
                        param.new_vlan_pri = subrow.new_vlan_pri;
                    }
                    if (row.op_vlan_mode === 4) {
                        //  trunk
                        param.start_vlan_id = subrow.start_vlan_id;
                        param.end_vlan_id = subrow.end_vlan_id;
                    }
                    var data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "port_vlanlist"
                            }
                        }),
                        method: "delete",
                        param
                    };

                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getPortVlan();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        addPortVlan(row) {
            this.subOp = row;
            this.openDialog("add-port-vlan");
        },
        closeDialog() {
            if (this.dialogFlag === "basic-info") {
                this.$refs["onu-set-basic-info"].resetForm();
            }
            if (this.dialogFlag === "add-port-vlan") {
                this.$refs["onu-add-port-vlan"].resetForm();
            }
            if (this.dialogFlag === "set-port-vlan") {
                this.$refs["onu-set-port-vlan"].resetForm();
            }
            this.dialogFlag = "";
        }
    }
};
</script>

<style lang="less" scoped>
</style>
