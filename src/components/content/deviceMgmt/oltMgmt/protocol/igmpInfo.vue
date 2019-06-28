<template>
    <div>
        <h3>
            IGMP{{ langMap['info'] }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <el-row style="margin: 20px 0 10px 10px;">
            <el-col :span="5">{{ langMap['mode'] }}</el-col>
            <el-col :span="5">{{ modes[info.mode] }}</el-col>
        </el-row>
        <template v-for="(item, key) in info" v-if="key !== 'mode'">
            <el-row
                style="margin: 10px 0 10px 10px;"
                v-if="(info.mode && (key === 'fast_leave' || key === 'protocol_policy')) || (info.mode !== 2 && key === 'group_aging_time')"
            >
                <el-col :span="5">{{ langMap[key] }}</el-col>
                <el-col :span="5">{{ formatData(item, key) }}</el-col>
            </el-row>
            <el-row
                style="margin: 10px 0 10px 10px;"
                v-if="info.mode === 2 && key !== 'fast_leave' && key !== 'protocol_policy' && key !== 'group_aging_time'"
            >
                <el-col :span="5">{{ langMap[key] }}</el-col>
                <el-col :span="5">{{ formatData(item, key) }}</el-col>
            </el-row>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ langMap['config'] }}</span>
            <igmp-info-form :info="infoData" ref="igmp-basic-info-config"></igmp-info-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('igmp-basic-info-config')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import igmpInfoForm from "./igmpInfoForm";
export default {
    name: "igmpInfo",
    components: { igmpInfoForm },
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"])
    },
    data() {
        return {
            info: {},
            modes: ["disable", "snooping", "proxy"],
            dialogVisible: false,
            infoData: {}
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
                    url: "/switch_igmp",
                    params: { form: "config" }
                }),
                method: "get"
            }).then(res => {
                this.info = {};
                if (res.data.code === 1) {
                    if (res.data.data) {
                        this.info = res.data.data;
                    }
                }
            });
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.infoData = Object.assign({}, this.info);
            });
        },
        formatData(item, key) {
            if (key === "fast_leave") {
                return item ? "enable" : "disable";
            }
            if (key === "protocol_policy") {
                return item ? "discard" : "pass";
            }
            if (
                key === "group_aging_time" ||
                key === "gen_response_time" ||
                key === "gen_query_interval"
            ) {
                return `${item} s`;
            }
            if (key === "sp_response_time" || key === "sp_query_interval") {
                return `${item} ms`;
            }
            return item;
        },
        submitForm(formName) {
            this.setMode(formName)
                .then(_ => {
                    var valid = this.$refs[formName].validForm();
                    if (valid) {
                        var form = this.$refs[formName].infoForm;
                        var flags = {
                            protocol_policy: 0x02,
                            fast_leave: 0x04,
                            group_aging_time: 0x08,
                            robustness: 0x10,
                            gen_response_time: 0x20,
                            gen_query_interval: 0x40,
                            query_src_ip: 0x80,
                            query_src_mac: 0x100,
                            sp_query_interval: 0x200,
                            sp_response_time: 0x400,
                            sp_query_number: 0x800
                        };
                        var flag = 0;
                        Object.keys(form).forEach(item => {
                            if (item !== "mode") {
                                if (form[item] !== this.info[item]) {
                                    flag |= flags[item];
                                }
                            }
                        });
                        if (!flag) {
                            if (
                                this.$refs[formName].infoForm.mode !==
                                this.info.mode
                            ) {
                                this.dialogVisible = false;
                                return this.$message.success(
                                    this.langMap["set_success"]
                                );
                            }
                            return this.$message.warning(
                                this.langMap["modify_tips"]
                            );
                        }
                        this.$devProxy({
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_igmp",
                                params: { form: "config" }
                            }),
                            method: "set",
                            param: {
                                flags: flag,
                                protocol_policy: form.protocol_policy,
                                fast_leave: form.fast_leave,
                                group_aging_time: form.group_aging_time,
                                robustness: form.robustness,
                                gen_response_time: form.gen_response_time,
                                gen_query_interval: form.gen_query_interval,
                                query_src_ip: form.query_src_ip,
                                query_src_mac: form.query_src_mac,
                                sp_query_interval: form.sp_query_interval,
                                sp_response_time: form.sp_response_time,
                                sp_query_number: form.sp_query_number
                            }
                        }).then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        }).catch(err =>{});
                    }
                })
                .catch(_ => {});
        },
        setMode(formName) {
            return new Promise((resolve, reject) => {
                if (this.$refs[formName].infoForm.mode === this.info.mode) {
                    return resolve();
                }
                this.$devProxy({
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "mode" }
                    }),
                    method: "set",
                    param: {
                        mode: this.$refs[formName].infoForm.mode
                    }
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            return resolve();
                        } else {
                            this.$message.error(res.data.message);
                            return reject();
                        }
                    })
                    .catch(err => {});
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
