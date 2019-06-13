<template>
    <div>
        <el-row style="line-height: 32px;margin: 10px 0;">
            <el-col :span="3">{{ langMap['port_type'] }}</el-col>
            <el-col :span="3">{{ port_type[pvSet.port_type] }}</el-col>
            <el-col :span="3">
                <el-button
                    size="small"
                    type="primary"
                    @click="openDialog('port_type')"
                >{{ langMap['config'] }}</el-button>
            </el-col>
        </el-row>
        <el-row style="line-height: 32px;margin: 10px 0;">
            <el-col :span="3">{{ langMap['pvid'] }}</el-col>
            <el-col :span="3">{{ pvSet.pvid }}</el-col>
            <el-col :span="3">
                <el-button
                    size="small"
                    type="primary"
                    @click="openDialog('pvid')"
                >{{ langMap['config'] }}</el-button>
            </el-col>
        </el-row>
        <el-row style="line-height: 32px;margin: 10px 0;">
            <el-col :span="3">{{ langMap['tagged'] }}</el-col>
            <el-col :span="3">{{ pvSet.tagged_vlan }}</el-col>
        </el-row>
        <el-row style="line-height: 32px;margin: 10px 0;">
            <el-col :span="3">{{ langMap['untagged'] }}</el-col>
            <el-col :span="3">{{ pvSet.untagged_vlan }}</el-col>
        </el-row>
        <el-row>
            <el-col :offset="3">
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('add')"
                >{{ langMap['add_vlan_list'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('delete')"
                >{{ langMap['del_vlan_list'] }}</el-button>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ (dialogFlag === 'add' || dialogFlag === 'delete') ? langMap[dialogFlag] : langMap['config'] }}</span>
            <el-form :model="formData" :rules="pvRules" label-width="140px" ref="pv-config-form">
                <el-form-item :label="langMap['port_id']">
                    <span style="margin-left: 16px;">{{ port_name[port_id] }}</span>
                </el-form-item>
                <el-form-item
                    :label="langMap['port_type']"
                    v-if="dialogFlag === 'port_type'"
                    key="port-vlan-port-type"
                >
                    <el-select v-model.number="formData.port_type">
                        <el-option :value="1" label="access"></el-option>
                        <el-option :value="2" label="trunk"></el-option>
                        <el-option :value="3" label="hybrid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="langMap['def_vlan_id']"
                    prop="pvid"
                    v-if="dialogFlag === 'pvid'"
                    key="port-vlan-pvid"
                >
                    <el-input v-model.number="formData.pvid"></el-input>
                </el-form-item>
                <template v-if="dialogFlag === 'add' || dialogFlag === 'delete'">
                    <el-form-item :label="langMap['port_type']">
                        <span style="margin-left: 16px;">{{ port_type[pvSet.port_type] }}</span>
                    </el-form-item>
                    <el-form-item
                        :label="langMap['vlan_list']"
                        prop="vlan_list"
                        key="port-vlan-list"
                    >
                        <el-input v-model="formData.vlan_list" placeholder="ex: 100,200-400">
                            <template slot="suffix">
                                <el-popover
                                    placement="top-start"
                                    width="200"
                                    trigger="hover"
                                    :content="langMap['pv_vlist_tips']"
                                    style="margin-right: 10px;"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['vlan_mode']" key="port-vlan-mode">
                        <el-select v-model.number="formData.vlan_mode">
                            <el-option :value="1" :label="langMap['tagged']"></el-option>
                            <el-option :value="2" :label="langMap['untagged']"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('pv-config-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "vlanCfg",
    props: {
        port_id: {
            type: Number,
            default: 1
        }
    },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            port_type: { 1: "access", 2: "trunk", 3: "hybrid" },
            pvSet: {},
            dialogVisible: false,
            dialogFlag: "",
            formData: {
                port_type: 1,
                pvid: 1,
                vlan_list: "",
                vlan_mode: 1
            },
            pvRules: {
                pvid: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                vlan_list: [
                    {
                        validator: this.validVlanList,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getPv(this.port_id);
    },
    methods: {
        getPv(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "vlan", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.pvSet = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.pvSet = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
            flag === "port_type" &&
                (this.formData.port_type = this.pvSet.port_type);
            flag === "pvid" && (this.formData.pvid = this.pvSet.pvid);
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.dialogFlag === "port_type") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_port",
                                params: { form: "vlan_type" }
                            }),
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                port_type: this.formData.port_type
                            }
                        };
                    }
                    if (this.dialogFlag === "pvid") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_port",
                                params: { form: "defaultvlan" }
                            }),
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                pvid: this.formData.pvid
                            }
                        };
                    }
                    if (this.dialogFlag === "add") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_port",
                                params: { form: "vlan" }
                            }),
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                port_type: this.pvSet.port_type,
                                vlan_list: this.formData.vlan_list,
                                vlan_mode: this.formData.vlan_mode
                            }
                        };
                    }
                    if (this.dialogFlag === "delete") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_port",
                                params: { form: "vlan" }
                            }),
                            method: "delete",
                            param: {
                                port_id: this.port_id,
                                port_type: this.pvSet.port_type,
                                vlan_list: this.formData.vlan_list,
                                vlan_mode: this.formData.vlan_mode
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                this.getPv(this.port_id);
                                this.$refs[formName].resetFields();
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        validVlanList(rule, value, callback) {
            var reg = /^[\d\-,]{1,24}$/;
            if (!reg.test(value)) {
                return callback(new Error(`ex: 100,200-300`));
            }
            callback();
        }
    },
    watch: {
        port_id() {
            this.getPv(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
