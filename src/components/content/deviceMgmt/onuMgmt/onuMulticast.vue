<template>
    <div>
        <h3>{{ langMap['onu_multicast'] }}</h3>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="langMap['onu_multicast']" name="onu-multicast">
                <template v-if="activeName === 'onu-multicast'">
                    <h3>{{ langMap['onu_multicast'] + langMap['info'] }}</h3>
                    <el-row style="height: 36px; line-height: 36px;">
                        <el-col :span="3">{{ langMap['mc_mode'] }}</el-col>
                        <el-col :span="3">{{ onuMulti.mc_mode === 1 ? 'ctc' : 'igmp-snooping' }}</el-col>
                        <el-col :span="3">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="setOnuMulti"
                            >{{ langMap['config'] }}</el-button>
                        </el-col>
                    </el-row>
                    <el-row style="height: 36px; line-height: 36px;">
                        <el-col :span="3">{{ langMap['fast_leave'] }}</el-col>
                        <el-col
                            :span="3"
                        >{{ onuMulti.fast_leave === 2 ? langMap['enable'] : langMap['disable'] }}</el-col>
                        <el-col :span="3">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="setOnuMv"
                            >{{ langMap['config'] }}</el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-tab-pane>
            <el-tab-pane :label="langMap['mvlan']" name="onu-mvlan">
                <onu-mvlan v-if="activeName === 'onu-mvlan'"></onu-mvlan>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import onuMvlan from './onuMvlan';
export default {
    name: "onuMulticast",
    computed: {
        ...mapState(["langMap"])
    },
    components: { onuMvlan },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    data() {
        return {
            activeName: "onu-multicast",
            onuMulti: {},
            mc_mode: "",
            fast_leave: ""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        setMcMode(e) {
            this.mc_mode = Number(e.target.value);
        },
        setFastLeave(e) {
            this.fast_leave = Number(e.target.value);
        },
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_config",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.onuMulti = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.onuMulti = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        setOnuMulti() {
            this.mc_mode = this.onuMulti.mc_mode;
            this.$msgbox({
                title: this.langMap["config"],
                message: (
                    <el-form label-width="140px" size="small">
                        <el-form-item label={this.langMap["mc_mode"]}>
                            <select
                                value={this.mc_mode}
                                on-change={this.setMcMode}
                                style="width: 200px; padding: 6px 0; text-indent: 6px; border-radius: 3px; border-color: #DCDFE6; color: #606266;"
                                key="onu-mc-mode-set"
                            >
                                <option
                                    value={0}
                                    label="igmp-snooping"
                                ></option>
                                <option value={1} label="ctc"></option>
                            </select>
                        </el-form-item>
                    </el-form>
                ),
                showCancelButton: true,
                dangerouslyUseHTMLString: false,
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    if (this.mc_mode === this.onuMulti.mc_mode) {
                        return;
                    }
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "mc_mode"
                            }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            mc_mode: this.mc_mode
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
        },
        setOnuMv() {
            this.fast_leave = this.onuMulti.fast_leave;
            this.$msgbox({
                title: this.langMap["config"],
                message: (
                    <el-form label-width="140px" size="small">
                        <el-form-item label={this.langMap["fast_leave"]}>
                            <select
                                value={this.fast_leave}
                                on-change={this.setFastLeave}
                                style="width: 200px; padding: 6px 0; text-indent: 6px; border-radius: 3px; border-color: #DCDFE6; color: #606266;"
                                key="onu-fast-leave-set"
                            >
                                <option
                                    value={1}
                                    label={this.langMap["disable"]}
                                ></option>
                                <option
                                    value={2}
                                    label={this.langMap["enable"]}
                                ></option>
                            </select>
                        </el-form-item>
                    </el-form>
                ),
                showCancelButton: true,
                dangerouslyUseHTMLString: false,
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    if (this.fast_leave === this.onuMulti.fast_leave) {
                        return;
                    }
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "mc_fast_leave"
                            }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            fast_leave: this.fast_leave
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
    },
    watch: {
        activeName(){
            if(this.activeName === 'onu-multicast'){
                this.getData();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
