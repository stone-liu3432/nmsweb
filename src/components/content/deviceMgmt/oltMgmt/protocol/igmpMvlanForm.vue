<template>
    <el-form
        :model="mvForm"
        :rules="mvRules"
        size="small"
        ref="igmp-mvlan-config-form"
        label-width="190px"
    >
        <el-form-item :label="langMap['vlan_id']" prop="mvlan">
            <el-input v-model.number="mvForm.mvlan" v-if="formFlag === 'create'"></el-input>
            <span v-else>{{ mvlan }}</span>
        </el-form-item>
        <el-form-item
            :label="langMap['mvlan_desc']"
            prop="mvlan_desc"
            v-if="formFlag === 'create' || formFlag === 'config-desc'"
        >
            <el-input type="textarea" v-model="mvForm.mvlan_desc" maxlength="64" show-word-limit></el-input>
        </el-form-item>
        <el-form-item
            :label="langMap['router_portlist']"
            prop="router_portlist"
            v-if="formFlag === 'config-router-list' || formFlag === 'delete-router-port'"
        >
            <el-checkbox-group v-model="mvForm.checkList">
                <template v-for="(item, key) in port_name" v-if="key > basicInfo.ponports">
                    <el-checkbox
                        :label="Number(key)"
                        :disabled="(formFlag === 'delete-router-port' && analysisPortList(formInfo.router_portlist).indexOf(Number(key)) === -1) ||
                         (formFlag === 'config-router-list' && analysisPortList(formInfo.router_portlist).indexOf(Number(key)) > -1)"
                    >{{ item }}</el-checkbox>
                </template>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item
            :label="langMap['mc_unknown_policy']"
            prop="mc_unknown_policy"
            v-if="formFlag === 'config-mc-policy'"
        >
            <el-select v-model.number="mvForm.mc_unknown_policy">
                <el-option :value="0" :label="langMap['transparent']"></el-option>
                <el-option :value="1" :label="langMap['discard']"></el-option>
            </el-select>
        </el-form-item>
        <el-row>
            <el-col :span="16">
                <el-form-item
                    :label="langMap['program']"
                    prop="program_s"
                    v-if="formFlag === 'config-program'"
                >
                    <el-input v-model="mvForm.program_s" style="width: 200px;"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="program_e" label-width="0" v-if="formFlag === 'config-program'">
                    <el-input v-model="mvForm.program_e" style="width: 200px;"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item
            :label="langMap['program_desc']"
            prop="program_desc"
            v-if="formFlag === 'config-program'"
        >
            <el-input type="textarea" v-model="mvForm.program_desc" maxlength="64" show-word-limit></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { analysisPortList } from "@/utils/common";
import { validatorIpAddr, validatorVlan } from "@/utils/validator";
export default {
    name: "igmpMvlanForm",
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"])
    },
    props: {
        formInfo: {
            type: Object,
            default: _ => {}
        },
        formFlag: {
            type: String,
            default: ""
        },
        mvlan: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            mvForm: {
                mvlan: "",
                mvlan_desc: "",
                checkList: [],
                mc_unknown_policy: 0,
                program_s: "",
                program_e: "",
                program_desc: ""
            },
            mvRules: {
                mvlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                program_s: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                program_e: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                mvlan_desc: [
                    { validator: this.validDesc, trigger: ["change", "blur"] }
                ],
                program_desc: [
                    { validator: this.validDesc, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        analysisPortList,
        validForm() {
            var flag = false;
            this.$refs["igmp-mvlan-config-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        validDesc(rule, value, cb) {
            var reg = /^.{0,64}$/;
            if (!reg.test(value)) {
                return cb(new Error(this.langMap["validatorRegion"]));
            }
            cb();
        },
        resetForm() {
            this.$refs["igmp-mvlan-config-form"].resetFields();
        }
    },
    watch: {
        formInfo() {
            if (this.formFlag === "create") {
                this.mvForm.mvlan = "";
                this.mvForm.mvlan_desc = "";
                return;
            }
            this.mvForm.mvlan = this.formInfo.mvlan || this.mvlan;
            if (this.formFlag === "config-desc") {
                this.mvForm.mvlan_desc = this.formInfo.mvlan_desc;
            }
            if (
                this.formFlag === "config-router-list" ||
                this.formFlag === "delete-router-port"
            ) {
                this.mvForm.checkList = analysisPortList(
                    this.formInfo.router_portlist
                );
            }
            if (this.formFlag === "config-mc-policy") {
                this.mvForm.mc_unknown_policy = this.formInfo.mc_unknown_policy;
            }
            // if (this.formFlag === "config-program") {
            //     this.mvForm.program_s = this.formInfo.program_s;
            //     this.mvForm.program_e = this.formInfo.program_e;
            //     this.mvForm.program_desc = this.formInfo.program_desc;
            // }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
