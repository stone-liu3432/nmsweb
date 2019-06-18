<template>
    <el-form
        :model="rstpGlobal"
        label-width="150px"
        size="small"
        :rules="globalRules"
        ref="rstp-global-config-form"
    >
        <el-form-item :label="langMap['status']" prop="status">
            <el-select v-model.number="rstpGlobal.status">
                <el-option :value="0" :label="langMap['disable']"></el-option>
                <el-option :value="1" :label="langMap['enable']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['rstp_mode']" prop="rstp_mode">
            <el-select v-model.number="rstpGlobal.rstp_mode">
                <template v-for="(item,index) in rstpModes" v-if="!!item">
                    <el-option :value="index" :label="item" :disabled="index == 3"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['rb_priority']" prop="rb_priority">
            <el-select v-model.number="rstpGlobal.rb_priority">
                <template v-for="item in rbPris">
                    <el-option :value="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['max_age']" prop="max_age">
            <el-input v-model.number="rstpGlobal.max_age"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['hello_time']" prop="hello_time">
            <el-input v-model.number="rstpGlobal.hello_time"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['forward_delay']" prop="forward_delay">
            <el-input v-model.number="rstpGlobal.forward_delay"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['transmit_hold_count']" prop="transmit_hold_count">
            <el-input v-model.number="rstpGlobal.transmit_hold_count"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "rstpGlobalCfg",
    computed: {
        ...mapState(["langMap"])
    },
    props: {
        globalInfo: {
            type: Object,
            default: _ => {}
        }
    },
    data() {
        return {
            rstpModes: ["stp", "", "rstp", "mstp"],
            rbPris: [],
            rstpGlobal: {
                status: 0,
                rstp_mode: 0,
                rb_priority: 0,
                max_age: 0,
                hello_time: 0,
                forward_delay: 0,
                transmit_hold_count: 0
            },
            globalRules: {
                max_age: [
                    {
                        validator: this.validRange(6, 40),
                        trigger: ["change", "blur"]
                    }
                ],
                hello_time: [
                    {
                        validator: this.validRange(1, 10),
                        trigger: ["change", "blur"]
                    }
                ],
                forward_delay: [
                    {
                        validator: this.validRange(4, 30),
                        trigger: ["change", "blur"]
                    }
                ],
                transmit_hold_count: [
                    {
                        validator: this.validRange(1, 255),
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        //  rb_priority 范围为 0-61440，且必须为 4096 的倍数
        (ctx => {
            var n = 4096,
                i = 0,
                max = 61440;
            while (n * i <= max) {
                ctx.rbPris.push(n * i);
                i++;
            }
        })(this);
    },
    methods: {
        validRange(min, max) {
            return (rule, value, cb) => {
                if (value < min || value > max || isNaN(value)) {
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            };
        },
        validForm(formName) {
            var flag = false;
            this.$refs["rstp-global-config-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        }
    },
    watch: {
        globalInfo() {
            if (this.globalInfo) {
                Object.keys(this.rstpGlobal).forEach(item => {
                    this.rstpGlobal[item] = this.globalInfo[item];
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>

