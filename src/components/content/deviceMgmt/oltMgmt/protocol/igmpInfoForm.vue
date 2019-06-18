<template>
    <el-form :model="infoForm" :rules="infoRules" size="small" label-width="180px" ref="igmp-info-config-form">
        <el-form-item :label="langMap['mode']" prop="mode">
            <el-select v-model.number="infoForm.mode">
                <template v-for="(item,index) in modes">
                    <el-option :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="infoForm.mode !== 0">
            <el-form-item :label="langMap['fast_leave']" prop="fast_leave">
                <el-select v-model.number="infoForm.fast_leave">
                    <el-option :value="0" label="disable"></el-option>
                    <el-option :value="1" label="enable"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['protocol_policy']" prop="protocol_policy">
                <el-select v-model.number="infoForm.protocol_policy">
                    <el-option :value="0" label="pass"></el-option>
                    <el-option :value="1" label="discard"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['group_aging_time']" prop="group_aging_time" v-if="infoForm.mode !== 2">
                <el-input v-model.number="infoForm.group_aging_time">
                    <template slot="append">s</template>
                </el-input>
            </el-form-item>
            <template v-if="infoForm.mode === 2">
                <el-form-item :label="langMap['robustness']" prop="robustness">
                    <el-input v-model.number="infoForm.robustness"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['query_src_ip']" prop="query_src_ip">
                    <el-input v-model="infoForm.query_src_ip"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['query_src_mac']" prop="query_src_mac">
                    <el-input v-model="infoForm.query_src_mac"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['gen_response_time']" prop="gen_response_time">
                    <el-input v-model.number="infoForm.gen_response_time">
                        <template slot="append">s</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="langMap['gen_query_interval']" prop="gen_query_interval">
                    <el-input v-model.number="infoForm.gen_query_interval">
                        <template slot="append">s</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="langMap['sp_response_time']" prop="sp_response_time">
                    <el-input v-model.number="infoForm.sp_response_time">
                        <template slot="append">ms</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="langMap['sp_query_interval']" prop="sp_query_interval">
                    <el-input v-model.number="infoForm.sp_query_interval">
                        <template slot="append">ms</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="langMap['sp_query_number']" prop="sp_query_number">
                    <el-input v-model.number="infoForm.sp_query_number"></el-input>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorIpAddr, validatorMac } from "@/utils/validator";
export default {
    name: "igmpInfoForm",
    computed: {
        ...mapState(["langMap"])
    },
    props: {
        info: {
            type: Object,
            default: _ =>{}
        }
    },
    data() {
        return {
            modes: ["disable", "snooping", "proxy"],
            infoForm: {
                mode: 1,
                fast_leave: 0,
                protocol_policy: 0,
                group_aging_time: 0,
                robustness: 0,
                query_src_ip: "",
                query_src_mac: "",
                gen_response_time: 0,
                gen_query_interval: 0,
                sp_response_time: 0,
                sp_query_interval: 0,
                sp_query_number: 0
            },
            infoRules: {
                group_aging_time: [
                    {
                        validator: this.validRange(1, 3000),
                        trigger: ["change", "blur"]
                    }
                ],
                robustness: [
                    {
                        validator: this.validRange(1, 10),
                        trigger: ["change", "blur"]
                    }
                ],
                query_src_ip: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                query_src_mac: [
                    { validator: validatorMac, trigger: ["change", "blur"] }
                ],
                gen_response_time: [
                    {
                        validator: this.validRange(1, 25),
                        trigger: ["change", "blur"]
                    }
                ],
                gen_query_interval: [
                    {
                        validator: this.validRange(2, 3000),
                        trigger: ["change", "blur"]
                    }
                ],
                sp_response_time: [
                    {
                        validator: this.validRange(100, 10000),
                        trigger: ["change", "blur"]
                    }
                ],
                sp_query_interval: [
                    {
                        validator: this.validRange(100, 10000),
                        trigger: ["change", "blur"]
                    }
                ],
                sp_query_number: [
                    {
                        validator: this.validRange(1, 10),
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {},
    methods: {
        validRange(min, max) {
            return (rule, value, cb) => {
                if (value < min || value > max || isNaN(value)) {
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            };
        },
        validForm(){
            var flag = false;
            this.$refs['igmp-info-config-form'].validate(valid =>{
                flag = valid;
            })
            return flag;
        }
    },
    watch: {
        info(){
            Object.keys(this.infoForm).forEach(item => {
                this.infoForm[item] = this.info[item];
            })
        }
    }
};
</script>

<style lang="less" scoped>
</style>
