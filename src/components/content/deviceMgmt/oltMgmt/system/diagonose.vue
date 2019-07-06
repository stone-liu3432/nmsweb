<template>
    <div>
        <h3>{{ langMap['diagonose'] }}</h3>
        <el-form
            :model="formData"
            label-width="150px"
            size="small"
            label-position="left"
            :rules="formRules"
            ref="diagonose-form"
        >
            <el-form-item :label="langMap['diag_tools_type']">
                <span style="margin-left: 16px;">{{ langMap['diag_type'] }}</span>
            </el-form-item>
            <el-form-item :label="langMap['dest_ping_ip']" prop="ipaddr">
                <el-input v-model="formData.ipaddr" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['diag_ping_intf']">
                <el-select v-model="formData.interface" style="width: 200px;">
                    <template v-for="item in interfaces">
                        <el-option :value="item.interface"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['diag_ping_count']" prop="count">
                <el-input v-model.number="formData.count" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['diag_ping_pktsize']" prop="pktsize">
                <el-input v-model.number="formData.pktsize" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width: 200px;"
                    @click.prevent="submitForm('diagonose-form')"
                >{{ langMap['apply'] }}</el-button>
            </el-form-item>
        </el-form>
        <el-input type="textarea" v-model="result" rows="12" style="width: 800px;" readonly resize="none"></el-input>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { validatorIpAddr } from "@/utils/validator";
export default {
    name: "diagonose",
    computed: {
        ...mapState(["langMap", "dev_ip"])
    },
    data() {
        return {
            interfaces: [],
            formData: {
                ipaddr: "",
                count: 4,
                pktsize: 64,
                interface: "outbound"
            },
            formRules: {
                ipaddr: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                count: [
                    {
                        validator: this.validRange(1, 50),
                        trigger: ["change", "blur"]
                    }
                ],
                pktsize: [
                    {
                        validator: this.validRange(4, 1472),
                        trigger: ["change", "blur"]
                    }
                ]
            },
            result: ""
        };
    },
    created() {
        this.getInterface();
    },
    methods: {
        getInterface() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/system", params: { form: "outbound" } }),
                method: "get"
            })
                .then(res => {
                    this.interfaces = [];
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.interfaces.push(res.data.data);
                            this.$devProxy({
                                devicelist: [this.dev_ip],
                                url: this.$qs({
                                    url: "/system",
                                    params: { form: "inbound" }
                                }),
                                method: "get"
                            })
                                .then(res => {
                                    if (res.data.code === 1) {
                                        if (
                                            res.data.data &&
                                            res.data.data.length
                                        ) {
                                            this.interfaces = this.interfaces.concat(
                                                res.data.data
                                            );
                                        }
                                    }
                                })
                                .catch(err => {});
                        }
                    }
                })
                .catch(err => {});
        },
        validRange(min, max) {
            return (rule, value, cb) => {
                if (value < min || value > max || isNaN(value)) {
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            };
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/diagnose",
                            params: { form: "ping" }
                        }),
                        method: "set",
                        param: {
                            ipaddr: this.formData.ipaddr,
                            interface: this.formData.interface,
                            count: this.formData.count,
                            pktsize: this.formData.pktsize
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.getResult();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                }
            });
        },
        getResult() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/diagnose",
                    params: { form: "ping" }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.result = res.data.data.result;
                            if (res.data.data.finished === 0) {
                                setTimeout(_ =>{
                                    this.getResult();
                                }, 1000)
                            }else{
                                this.result += '\r\n Finished!';
                            }
                        }
                    }else{
                        this.$message.error(res.data.message);
                        this.result = 'The device is ready!';
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>
