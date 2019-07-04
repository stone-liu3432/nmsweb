<template>
    <el-form
        :model="formData"
        :rules="formRules"
        label-width="170px"
        ref="onu-basic-info-set-form"
        size="small"
    >
        <el-form-item prop="op_id" :label="langMap['op_id']">
            <el-select v-model.number="formData.op_id">
                <template v-for="item in formInfo">
                    <el-option :value="item.op_id"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item prop="auto_neg" :label="langMap['auto_neg']">
            <el-select v-model.number="formData.auto_neg">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="flow_ctrl" :label="langMap['flow_ctrl']">
            <el-select v-model.number="formData.flow_ctrl">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="loopdetect" :label="langMap['loopdetect']">
            <el-select v-model.number="formData.loopdetect">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="enable" :label="langMap['enable']">
            <el-select v-model.number="formData.enable">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="rlds_opt" :label="langMap['rlds_opt']">
            <el-select v-model.number="formData.rlds_opt">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="rl_cir" :label="langMap['rl_cir']">
            <el-input v-model.number="formData.rl_cir" :disabled="!formData.rlds_opt"></el-input>
        </el-form-item>
        <el-form-item prop="rl_pir" :label="langMap['rl_pir']">
            <el-input v-model.number="formData.rl_pir" :disabled="!formData.rlds_opt"></el-input>
        </el-form-item>
        <el-form-item prop="rlus_opt" :label="langMap['rlus_opt']">
            <el-select v-model.number="formData.rlus_opt">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="bandwidth" :label="langMap['bandwidth']">
            <el-input v-model.number="formData.bandwidth" :disabled="!formData.rlus_opt"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
export default {
    name: "onuBasicInfoForm",
    computed: {
        ...mapState(["langMap", "port_name"])
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    props: {
        formInfo: { type: Array, required: true }
    },
    data() {
        return {
            formData: {
                op_id: 0,
                auto_neg: 0,
                flow_ctrl: 0,
                loopdetect: 0,
                enable: 0,
                rlds_opt: 0,
                rl_cir: 0,
                rl_pir: 0,
                rlus_opt: 0,
                bandwidth: 0
            },
            formRules: {
                rl_cir: [
                    { validator: this.validRange, trigger: ["change", "blur"] }
                ],
                rl_pir: [
                    { validator: this.validRange, trigger: ["change", "blur"] }
                ],
                bandwidth: [
                    { validator: this.validRange, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.$nextTick(_ => {
            this.formData.op_id = this.formInfo[0].op_id;
        });
    },
    methods: {
        validForm() {
            var flag = false;
            this.$refs["onu-basic-info-set-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        validRange(rule, value, cb) {
            if (!this.formData.rlds_opt) {
                if (rule.field === "rl_cir" || rule.field === "rl_pir") {
                    return cb();
                }
            }
            if (!this.formData.rlus_opt) {
                if (rule.field === "bandwidth") {
                    return cb();
                }
            }
            if (value < 128 || value > 1024000 || isNaN(value)) {
                return cb(new Error("Range: 128 - 1024000"));
            }
            cb();
        },
        resetForm() {
            this.$refs["onu-basic-info-set-form"].resetFields();
        }
    },
    watch: {
        "formData.op_id"() {
            if (this.formData.op_id) {
                this.formInfo.forEach(item => {
                    if (item.op_id === this.formData.op_id) {
                        Object.keys(this.formData).forEach(_item => {
                            this.formData[_item] = item[_item];
                        });
                    }
                });
            }
        },
        "formData.rlds_opt"() {
            if (!this.formData.rlds_opt) {
                this.$refs["onu-basic-info-set-form"].clearValidate([
                    "rl_cir",
                    "rl_pir"
                ]);
            } else {
                this.$refs["onu-basic-info-set-form"].validateField([
                    "rl_cir",
                    "rl_pir"
                ]);
            }
        },
        "formData.rlus_opt"() {
            if (!this.formData.rlds_opt) {
                this.$refs["onu-basic-info-set-form"].clearValidate(
                    "bandwidth"
                );
            } else {
                this.$refs["onu-basic-info-set-form"].validateField(
                    "bandwidth"
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
