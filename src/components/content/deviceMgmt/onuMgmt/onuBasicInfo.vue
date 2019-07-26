<template>
    <div>
        <h3>
            {{ langMap['onu_basic_info'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ langMap['config'] + langMap['onu_info'] }}</el-button>
            <el-button type="primary" size="small" @click="rebootOnu">{{ langMap['reboot_onu'] }}</el-button>
            <el-button
                type="primary"
                size="small"
                @click="deregisterOnu"
            >{{ langMap['deregister_onu'] }}</el-button>
            <el-button type="primary" size="small" @click="setFecMode">{{ langMap['set_fec_mode'] }}</el-button>
        </h3>
        <el-row :gutter="30">
            <el-col :span="12">
                <template v-for="(item, key) in baseInfo">
                    <el-row
                        v-if="key !== 'port_id' && key !== 'onu_id'"
                        style="padding: 8px 0; border-bottom: 1px solid #ddd;"
                    >
                        <el-col :span="8" style="padding-left: 10px;">{{ langMap[key] || key }}</el-col>
                        <el-col :span="16" style="padding: 0 6px;">{{ item }}</el-col>
                    </el-row>
                </template>
                <el-row style="padding: 8px 0; border-bottom: 1px solid #ddd;">
                    <el-col :span="8" style="padding-left: 10px;">fec mode</el-col>
                    <el-col
                        :span="16"
                        style="padding: 0 6px;"
                    >{{ fec_mode ? langMap['enable'] : langMap['disable'] }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <h3>
                    {{ langMap['onu_optical_diagnose'] }}
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px;"
                        :loading="loading"
                        @click="refreshOptical"
                    >{{ langMap['refresh'] }}</el-button>
                </h3>
                <template v-for="(item, key) in onuOptical">
                    <el-row
                        v-if="key !== 'port_id' && key !== 'onu_id'"
                        style="height: 32px; line-height: 32px; border-bottom: 1px solid #ddd;"
                    >
                        <el-col :span="8">{{ langMap[key] }}</el-col>
                        <el-col :span="8">{{ item }}</el-col>
                    </el-row>
                </template>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['config'] }}</span>
            <el-form
                ref="onu-config-form"
                :model="onuSetForm"
                :rules="onuFormRules"
                label-width="120px"
            >
                <el-form-item :label="langMap['onu_id']">
                    <span
                        style="margin-left: 16px;"
                    >{{ `ONU0${baseInfo.port_id}/${ baseInfo.onu_id < 10 ? '0' + baseInfo.onu_id : baseInfo.onu_id }` }}</span>
                </el-form-item>
                <el-form-item :label="langMap['onu_name']" prop="onu_name">
                    <el-input v-model="onuSetForm.onu_name"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['onu_desc']" prop="onu_desc">
                    <el-input v-model="onuSetForm.onu_desc" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('onu-config-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorName, validatorDesc } from "@/utils/validator";
export default {
    name: "onuBasicInfo",
    computed: {
        ...mapState(["langMap", "port_name", "timestamp"])
    },
    data() {
        return {
            baseInfo: {},
            fec_mode: 0,
            onuOptical: {},
            loading: false,
            dialogVisible: false,
            onuSetForm: {
                onu_name: "",
                onu_desc: ""
            },
            onuFormRules: {
                onu_name: [
                    { validator: validatorName, trigger: ["change", "blur"] }
                ],
                onu_desc: [
                    { validator: validatorDesc, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getData();
        this.getFecMode();
        this.getOptical();
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    methods: {
        ...mapMutations({
            updateLoading: "changeLoadingState"
        }),
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "base-info",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.baseInfo = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.baseInfo = res.data.data;
                            this.updateLoading(false);
                        }
                    }
                })
                .catch(err => {
                    this.updateLoading(false);
                    this.$message.error(this.langMap["get_data_fail"]);
                });
        },
        getFecMode() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "config",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.fec_mode = 0;
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.fec_mode = res.data.data.fec_mode;
                        }
                    }
                })
                .catch(err => {});
        },
        getOptical() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "optical-diagnose",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.onuOptical = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.onuOptical = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog() {
            this.dialogVisible = true;
            this.onuSetForm.onu_name = this.baseInfo.onu_name || "";
            this.onuSetForm.onu_desc = this.baseInfo.onu_desc || "";
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: { form: "config" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            flags: 0x8,
                            onu_name: this.onuSetForm.onu_name,
                            onu_desc: this.onuSetForm.onu_desc
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
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        rebootOnu() {
            this.$confirm(
                this.langMap["confirm_reboot_onu"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: { form: "config" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            flags: 0x1
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["reboot_onu"] +
                                        this.langMap["st_success"]
                                );
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        deregisterOnu() {
            this.$confirm(
                this.langMap["confirm_deresgester"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: { form: "config" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            flags: 0x2
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        setFecMode() {
            this.$confirm(this.fec_tips(this.fec_mode), this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: { form: "config" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            flags: 0x4,
                            fec_mode: Number(!this.fec_mode)
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getFecMode();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        fec_tips(mode) {
            if (mode) {
                return `${this.langMap["confirm_change_fecmode"]}${
                    this.langMap["off"]
                }`;
            }
            return `${this.langMap["confirm_change_fecmode"]}${
                this.langMap["on"]
            }`;
        },
        refreshOptical() {
            this.loading = true;
            this.getOptical();
            setTimeout(_ => {
                this.loading = false;
            }, 1000);
        },
        closeDialog() {
            this.$refs["onu-config-form"].resetFields();
        }
    },
    watch: {
        timestamp() {
            this.getData();
            this.getFecMode();
            this.getOptical();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
