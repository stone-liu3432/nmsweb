<template>
    <div>
        <h3>{{ langMap['onu_perf_info'] }}</h3>
        <el-row style="height: 40px; line-height: 40px;">
            <el-col :span="3">
                <span>{{ langMap['op_id'] }}</span>
            </el-col>
            <el-col :span="3">
                <el-select v-model="op_id" size="small">
                    <!-- op id 为0时，表示onu的 PON 口 -->
                    <el-option :value="0" label="PON"></el-option>
                    <template v-for="item in opInfo">
                        <el-option :value="item.op_id"></el-option>
                    </template>
                </el-select>
            </el-col>
            <el-col :span="16">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="refreshData"
                    :disabled="loadData"
                >{{ langMap['refresh'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="clearPerf"
                >{{ langMap['clear_perf'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    v-if="pageFlag === 'history'"
                    @click="changeType('current')"
                    :disabled="loading"
                >{{ langMap['curr_perf'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    v-if="pageFlag === 'current'"
                    @click="changeType('history')"
                    :disabled="loading"
                >{{ langMap['history_perf'] }}</el-button>
            </el-col>
        </el-row>
        <div style="height: 1px;"></div>
        <el-row style="height: 40px; line-height: 40px; margin: 16px 0;">
            <el-col :span="14">
                <el-row>
                    <el-col :span="12">
                        <span>{{ langMap['onu_perf_status'] }}:</span>
                        <span
                            style="margin-left: 8px;"
                        >{{ perfStatus.status === 2 ? langMap['enable'] : langMap['disable'] }}</span>
                    </el-col>
                    <el-col :span="12">
                        <span>{{ langMap['onu_perf_period'] }}:</span>
                        <span style="margin-left: 8px;">{{ perfStatus.period }}</span>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="10">
                <el-button type="primary" size="small" @click="openDialog">{{ langMap['config'] }}</el-button>
            </el-col>
        </el-row>
        <el-row>
            <template v-for="(item, index) in Object.keys(perfInfo)">
                <el-col
                    :span="8"
                    class="op-perf-item"
                    :style="setStyle(index, 'prefix')"
                >{{ langMap[item] }}</el-col>
                <el-col
                    :span="4"
                    class="op-perf-item"
                    :style="setStyle(index, 'suffix')"
                >{{ perfInfo[item] }}</el-col>
            </template>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ langMap['config'] }}</span>
            <el-form
                :model="statusForm"
                :rules="statusRules"
                size="small"
                label-width="200px"
                ref="onu-perf-status-config"
            >
                <el-form-item :label="langMap['op_id']">
                    <span style="margin-left: 16px;">{{ this.op_id }}</span>
                </el-form-item>
                <el-form-item :label="langMap['onu_perf_status']" prop="status">
                    <el-select v-model.number="statusForm.status">
                        <el-option :value="1" :label="langMap['disable']"></el-option>
                        <el-option :value="2" :label="langMap['enable']"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['onu_perf_period']" prop="period">
                    <el-input v-model.number="statusForm.period"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('onu-perf-status-config')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
export default {
    name: "onuPerfInfo",
    computed: {
        ...mapState(["langMap"])
    },
    inject: ["dev_ip", "port_id", "onu_id"],
    data() {
        return {
            op_id: "",
            opInfo: [],
            pageFlag: "current",
            perfInfo: {},
            perfStatus: {},
            loading: false,
            loadData: false,
            dialogVisible: false,
            statusForm: {
                status: 0,
                period: ""
            },
            statusRules: {
                period: [
                    { validator: this.validRange, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getPort();
    },
    methods: {
        getPort() {
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
                            if (this.op_id === "") {
                                this.op_id = this.opInfo[0].op_id;
                            } else {
                                this.getPerf(this.op_id);
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getPerf(op_id) {
            var data;
            if (this.pageFlag === "current") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/onumgmt",
                        params: {
                            form: "perf_current",
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id
                        }
                    }),
                    method: "get"
                };
            }
            if (this.pageFlag === "history") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/onumgmt",
                        params: {
                            form: "perf_history",
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id
                        }
                    }),
                    method: "get"
                };
            }
            this.$devProxy(data).then(res => {
                this.perfInfo = {};
                if (res.data.code === 1) {
                    if (res.data.data) {
                        this.perfInfo = res.data.data;
                    }
                }
            });
        },
        getPerfStatus(op_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "perf_status",
                        port_id: this.port_id,
                        onu_id: this.onu_id,
                        op_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    this.perfStatus = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.perfStatus = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        changeType(flag) {
            this.pageFlag = flag;
            this.loading = true;
            setTimeout(_ => {
                this.loading = false;
            }, 1000);
        },
        refreshData() {
            if (this.loadData) {
                return;
            }
            this.loadData = true;
            this.getPerf(this.op_id);
            setTimeout(_ => {
                this.loadData = false;
            }, 1000);
        },
        setStyle(index, flag) {
            var len = Object.keys(this.perfInfo).length;
            return {
                "border-right":
                    (index !== 0 && index % 2 !== 0 && flag === "suffix") ||
                    (index === len - 1 && flag === "suffix")
                        ? "1px solid #ddd"
                        : "",
                "border-bottom":
                    index === len - 1 || index === len - 2
                        ? "1px solid #ddd"
                        : ""
            };
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "performance"
                            }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id: this.op_id,
                            status: this.statusForm.status,
                            period: this.statusForm.period
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getPerfStatus(this.op_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        validRange(rule, value, cb) {
            if (value < 0 || value > 1024000 || isNaN(value)) {
                return cb(new Error("Range: 0 - 1024000"));
            }
            cb();
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.statusForm.status = this.perfStatus.status || 0;
                this.statusForm.period = this.perfStatus.period;
            });
        },
        clearPerf() {
            this.$confirm(this.langMap["clear_perf"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "performance"
                            }
                        }),
                        method: "clear",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id: this.op_id,
                            status: this.statusForm.status,
                            period: this.statusForm.period
                        }
                    }).then(res => {
                        if(res.data.code === 1){
                            this.$message.success(this.langMap['clear_success']);
                            this.getPerf(this.op_id);
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err =>{})
                })
                .catch(_ => {});
        }
    },
    watch: {
        op_id() {
            this.getPerf(this.op_id);
            this.getPerfStatus(this.op_id);
        },
        pageFlag() {
            this.getPerf(this.op_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
