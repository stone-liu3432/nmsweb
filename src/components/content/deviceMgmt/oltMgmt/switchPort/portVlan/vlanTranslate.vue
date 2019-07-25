<template>
    <div>
        <el-table :data="pvTranslate" border>
            <el-table-column prop="old_vlan" label="old vlan" width="180"></el-table-column>
            <el-table-column prop="new_vlan" label="new vlan" width="180"></el-table-column>
            <el-table-column prop="new_vlan_pri" :label="langMap['new_vlan_pri']"></el-table-column>
            <el-table-column fixed="right" :label="langMap['config']">
                <template slot="header" slot-scope="scope">
                    <el-button
                        type="primary"
                        size="small"
                        @click="openDialog(scope.row, 'add')"
                    >{{ langMap['add'] }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog(scope.row, 'config')"
                    >{{ langMap['config'] }}</el-button>
                    <el-button type="text" @click="delTranslate(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap[dialogFlag] }}</span>
            <el-form
                label-width="120px"
                :model="translateForm"
                :rules="translateRules"
                ref="port-vlan-translate-form"
            >
                <el-form-item label="old vlan" prop="old_vlan">
                    <el-input v-model.number="translateForm.old_vlan"></el-input>
                </el-form-item>
                <el-form-item label="new vlan" prop="new_vlan">
                    <el-input v-model.number="translateForm.new_vlan"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['new_vlan_pri']">
                    <el-select v-model.number="translateForm.new_vlan_pri">
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
                    @click="submitForm('port-vlan-translate-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "vlanTranslate",
    props: {
        port_id: {
            type: Number,
            default: 1
        }
    },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", "timestamp"])
    },
    data() {
        return {
            pvTranslate: [],
            dialogVisible: false,
            dialogFlag: "",
            cacheData: {},
            translateForm: {
                old_vlan: 0,
                new_vlan: 0,
                new_vlan_pri: 0
            },
            translateRules: {
                old_vlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                new_vlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getTranslate(this.port_id);
    },
    methods: {
        getTranslate(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/vlan_action",
                    params: { form: "translate", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.pvTranslate = [];
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.pvTranslate = res.data.data;
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
                Object.keys(this.translateForm).forEach(item => {
                    this.translateForm[item] = data[item];
                });
            }
        },
        delTranslate(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/vlan_action",
                            params: { form: "translate" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            old_vlan: data.old_vlan,
                            action: 0
                        }
                    }).then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap["delete_success"]
                            );
                            this.getTranslate(this.port_id);
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
                    var data;
                    if (this.dialogFlag === "config") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/vlan_action",
                                params: { form: "translate" }
                            }),
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                old_vlan: this.translateForm.old_vlan,
                                new_vlan: this.translateForm.new_vlan,
                                new_vlan_pri: this.translateForm.new_vlan_pri,
                                action: 0
                            }
                        };
                    }
                    if (this.dialogFlag === "add") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/vlan_action",
                                params: { form: "translate" }
                            }),
                            method: "add",
                            param: {
                                port_id: this.port_id,
                                old_vlan: this.translateForm.old_vlan,
                                new_vlan: this.translateForm.new_vlan,
                                new_vlan_pri: this.translateForm.new_vlan_pri,
                                action: 0
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(data.method + "_success");
                                this.getTranslate(this.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        closeDialog() {
            this.$refs["port-vlan-translate-form"].resetFields();
        }
    },
    watch: {
        port_id() {
            this.getTranslate(this.port_id);
        },
        timestamp() {
            this.getTranslate(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
