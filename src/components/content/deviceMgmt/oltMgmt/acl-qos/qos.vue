<template>
    <div>
        <h3>QoS</h3>
        <h3 style="margin: 26px 0;">
            <span>{{ langMap['mode'] }}:</span>
            <span style="margin-left: 20px;">{{ qos.cmode }}</span>
        </h3>
        <h3>
            {{ langMap['priority'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('priority')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <template v-for="(item, index) in qos.cosq">
            <el-row
                :style="{ 'padding': '8px 0', 'border-top': '1px solid #ddd', 'border-bottom': index === qos.cosq.length - 1 ? '1px solid #ddd' : '' }"
            >
                <el-col :span="4" style="margin-left: 8px;">
                    <span>{{ langMap['priority'] }}:</span>
                    <span style="margin-left: 12px;">{{ index }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['queue'] }}:</span>
                    <span style="margin-left: 12px;">{{ item }}</span>
                </el-col>
            </el-row>
        </template>
        <h3 style="margin-top: 26px;">
            {{ langMap['queue_scheduler'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('weight')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <template v-for="(item, index) in qos.queue">
            <el-row
                :style="{ 'padding': '8px 0', 'border-top': '1px solid #ddd', 'border-bottom': index === qos.cosq.length - 1 ? '1px solid #ddd' : '' }"
            >
                <el-col :span="4" style="margin-left: 8px;">
                    <span>{{ langMap['cos'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.cos }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['mode'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.mode }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['weight'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.weight }}</span>
                </el-col>
            </el-row>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ `${langMap['config']}${langMap[dialogFlag]}` }}</span>
            <el-form :model="formData" :rules="formRules" label-width="140px" ref="qos-mgmt-form">
                <el-form-item :label="langMap['mode']" v-if="dialogFlag === 'weight'">
                    <el-select v-model.number="formData.mode">
                        <el-option :value="1" label="strict-priority"></el-option>
                        <el-option :value="2" label="WRR"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="dialogFlag === 'priority'">
                    <el-form-item :label="langMap['priority']">
                        <span style="margin-left: 16px;">{{ langMap['queue'] }}</span>
                    </el-form-item>
                    <template v-for="item in basePri">
                        <el-form-item :label="String(item)">
                            <el-select v-model.number="formData['pri' + item]">
                                <el-option :value="0"></el-option>
                                <template v-for="o in 7">
                                    <el-option :value="o"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </template>
                </template>
                <template v-if="dialogFlag === 'weight' && formData.mode === 2">
                    <el-form-item :label="langMap['cos']">
                        <span style="margin-left: 16px;">{{ langMap['weight'] }}</span>
                    </el-form-item>
                    <template v-for="item in basePri">
                        <el-form-item :label="String(item)" :prop="'cos' + item">
                            <el-input v-model.number="formData['cos' + item]"></el-input>
                        </el-form-item>
                    </template>
                </template>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('qos-mgmt-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "qosMgmt",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"]),
        wrrs() {
            return [
                this.formData.cos0,
                this.formData.cos1,
                this.formData.cos2,
                this.formData.cos3,
                this.formData.cos4,
                this.formData.cos5,
                this.formData.cos6,
                this.formData.cos7
            ];
        },
        pris() {
            return [
                this.formData.pri0,
                this.formData.pri1,
                this.formData.pri2,
                this.formData.pri3,
                this.formData.pri4,
                this.formData.pri5,
                this.formData.pri6,
                this.formData.pri7
            ];
        }
    },
    data() {
        return {
            qos: {},
            basePri: [0, 1, 2, 3, 4, 5, 6, 7],
            dialogVisible: false,
            formData: {
                mode: 1,
                pri0: 0,
                pri1: 0,
                pri2: 0,
                pri3: 0,
                pri4: 0,
                pri5: 0,
                pri6: 0,
                pri7: 0,
                cos0: 0,
                cos1: 0,
                cos2: 0,
                cos3: 0,
                cos4: 0,
                cos5: 0,
                cos6: 0,
                cos7: 0
            },
            formRules: {
                cos0: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos1: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos2: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos3: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos4: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos5: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos6: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ],
                cos7: [
                    { validator: this.validWeight, trigger: ["change", "blur"] }
                ]
            },
            dialogFlag: ""
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
                    url: "/switch_qos",
                    params: { form: "qos" }
                }),
                method: "get"
            })
                .then(res => {
                    this.qos = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.qos = res.data.data;
                            this.qos.cosq.forEach((item, index) => {
                                this.formData["pri" + index] = item;
                            });
                            this.qos.queue.forEach((item, index) => {
                                this.formData["cos" + item.cos] = item.weight;
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(flag) {
            this.dialogFlag = flag;
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.dialogFlag === "priority") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_qos",
                                params: { form: "cosqmap" }
                            }),
                            method: "set",
                            param: {
                                priority: this.pris
                            }
                        };
                    }
                    if (this.dialogFlag === "weight") {
                        var weight = this.wrrs.reduce(
                            (initVal, item) => {
                                !item && (item = 0);
                                return initVal + item
                            }, 0
                        );
                        if (this.formData.mode === 2 && weight > 100) {
                            this.$message.error(
                                this.langMap["qos_weight_tips"]
                            );
                            return;
                        }
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_qos",
                                params: { form: "queue-scheduler" }
                            }),
                            method: "set",
                            param: {
                                flag: this.formData.mode,
                                wrr: [
                                    this.formData.cos0 || 0,
                                    this.formData.cos1 || 0,
                                    this.formData.cos2 || 0,
                                    this.formData.cos3 || 0,
                                    this.formData.cos4 || 0,
                                    this.formData.cos5 || 0,
                                    this.formData.cos6 || 0,
                                    this.formData.cos7 || 0
                                ]
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
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
        validWeight(rule, value, cb) {
            if(value === ''){
                value = 0;
            }
            if (value > 100 || isNaN(value)) {
                return cb(new Error("Range: 0 - 100"));
            }
            cb();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
