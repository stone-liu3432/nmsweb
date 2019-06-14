<template>
    <div>
        <el-table :data="pvQinq" border>
            <el-table-column prop="cvlan" label="cvlan" width="180"></el-table-column>
            <el-table-column prop="cvlan_s" label="cvlan start" width="180"></el-table-column>
            <el-table-column prop="cvlan_e" label="cvlan end"></el-table-column>
            <el-table-column prop="svlan" label="svlan"></el-table-column>
            <el-table-column prop="svlan_pri" :label="langMap['svlan_pri']"></el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        @click="openDialog(scope.row, 'add')"
                    >{{ langMap['add'] }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog(scope.row, 'config')"
                    >{{ langMap['config'] }}</el-button>
                    <el-button type="text" @click="delQinq(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            @close="closeDialog('port-vlan-qinq-form')"
        >
            <span slot="title">{{ langMap[dialogFlag] }}</span>
            <el-form
                :model="qinqForm"
                label-width="120px"
                :rules="qinqRules"
                ref="port-vlan-qinq-form"
            >
                <el-form-item label="cvlan" prop="cvlan">
                    <el-input
                        v-model.number="qinqForm.cvlan"
                        :disabled="!!(qinqForm.cvlan_s || qinqForm.cvlan_e)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="cvlan start" prop="cvlan_s">
                    <el-input v-model.number="qinqForm.cvlan_s" :disabled="!!qinqForm.cvlan"></el-input>
                </el-form-item>
                <el-form-item label="cvlan end" prop="cvlan_e">
                    <el-input v-model.number="qinqForm.cvlan_e" :disabled="!!qinqForm.cvlan"></el-input>
                </el-form-item>
                <el-form-item label="svlan" prop="svlan">
                    <el-input v-model.number="qinqForm.svlan"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['svlan_pri']">
                    <el-select v-model.number="qinqForm.svlan_pri">
                        <el-option :value="255" label=" - "></el-option>
                        <el-option :value="0"></el-option>
                        <template v-for="item in 7">
                            <el-option :value="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-vlan-qinq-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "vlanQinq",
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
            pvQinq: [],
            dialogVisible: false,
            dialogFlag: "",
            cacheData: {},
            qinqForm: {
                cvlan: "",
                cvlan_s: "",
                cvlan_e: "",
                svlan: "",
                svlan_pri: 0
            },
            qinqRules: {
                cvlan: [
                    { validator: this.validCvlan, trigger: ["change", "blur"] }
                ],
                cvlan_s: [
                    {
                        validator: this.validCvlanRange,
                        trigger: ["change", "blur"]
                    }
                ],
                cvlan_e: [
                    {
                        validator: this.validCvlanRange,
                        trigger: ["change", "blur"]
                    }
                ],
                svlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getQinQ(this.port_id);
    },
    methods: {
        getQinQ(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/vlan_action",
                    params: { form: "qinq", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.pvQinq = [];
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.pvQinq = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.cacheData = data;
            this.dialogFlag = flag;
            if (flag === "config") {
                this.$nextTick(_ => {
                    Object.keys(this.qinqForm).forEach(item => {
                        this.qinqForm[item] = data[item];
                    });
                });
            }
        },
        closeDialog(formName) {
            this.$refs[formName].resetFields();
        },
        delQinq(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/vlan_action",
                            params: { form: "qinq" }
                        }),
                        method: "delete",
                        param: {
                            port_id: this.port_id,
                            cvlan: data.cvlan,
                            cvlan_s: data.cvlan_s,
                            cvlan_e: data.cvlan_e,
                            action: 1
                        }
                    }).then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap["delete_success"]
                            );
                            this.getQinQ(this.port_id);
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/vlan_action",
                            params: { form: "qinq" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            cvlan: this.qinqForm.cvlan,
                            cvlan_s: this.qinqForm.cvlan_s,
                            cvlan_e: this.qinqForm.cvlan_e,
                            svlan: this.qinqForm.svlan,
                            svlan_pri: this.qinqForm.svlan_pri,
                            action: 1
                        }
                    };
                    this.$devProxy(data).then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                            this.getQinQ(this.port_id);
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }
            });
        },
        //  cvlan 和 cvlan range不能共存，单个或者是范围二选一
        validCvlanRange(rule, value, callback) {
            if(!this.qinqForm.cvlan && !this.qinqForm.cvlan_s && !this.qinqForm.cvlan_e){
                return validatorVlan(rule, value, callback);
            }
            if (this.qinqForm.cvlan) {
                this.qinqForm.cvlan_s = 0;
                this.qinqForm.cvlan_e = 0;
                return callback();
            }
            this.$refs["port-vlan-qinq-form"].clearValidate("cvlan");
            return validatorVlan(rule, value, callback);
        },
        validCvlan(rule, value, callback) {
            if(!this.qinqForm.cvlan && !this.qinqForm.cvlan_s && !this.qinqForm.cvlan_e){
                return validatorVlan(rule, value, callback);
            }
            if (this.qinqForm.cvlan_s || this.qinqForm.cvlan_e) {
                this.qinqForm.cvlan = 0;
                return callback();
            }
            this.$refs["port-vlan-qinq-form"].clearValidate("cvlan_s");
            this.$refs["port-vlan-qinq-form"].clearValidate("cvlan_e");
            return validatorVlan(rule, value, callback);
        }
    },
    watch: {
        port_id() {
            this.getQinQ(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
