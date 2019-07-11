<template>
    <el-form
        :model="formData"
        :rules="formRules"
        label-width="170px"
        ref="onu-set-port-vlan-form"
        size="small"
    >
        <el-form-item :label="langMap['op_id']">
            <el-select v-model.number="formData.op_id">
                <template v-for="item in formInfo">
                    <el-option :value="item.op_id"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['op_vlan_mode']">
            <el-select v-model.number="formData.op_vlan_mode">
                <template v-for="(item, index) in opVlanMode">
                    <el-option :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <template v-if="formData.op_vlan_mode !== 0">
            <el-form-item :label="langMap['def_vlan_id']" prop="def_vlan_id">
                <el-input v-model.number="formData.def_vlan_id"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['def_vlan_pri']" prop="dev_vlan_pri">
                <el-select v-model.number="formData.def_vlan_pri">
                    <el-option :value="0"></el-option>
                    <template v-for="item in 7">
                        <el-option :value="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "onuSetPortVlan",
    computed: {
        ...mapState(["langMap", "port_name"])
    },
    props: {
        formInfo: { type: Array }
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    data() {
        return {
            formData: {
                op_id: "",
                op_vlan_mode: "",
                def_vlan_pri: 0,
                def_vlan_id: ""
            },
            formRules: {
                def_vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            },
            opVlanMode: [
                "transparent",
                "tag",
                "translate",
                "aggregation",
                "trunk"
            ]
        };
    },
    created() {
        this.formData.op_id = this.formInfo[0].op_id;
    },
    methods: {
        validForm() {
            var flag = false;
            this.$refs["onu-set-port-vlan-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        resetForm() {
            this.$refs["onu-set-port-vlan-form"].resetFields();
        }
    },
    watch: {
        "formData.op_id"() {
            this.formInfo.forEach(item => {
                if (item.op_id === this.formData.op_id) {
                    Object.keys(this.formData).forEach(_item => {
                        this.formData[_item] = item[_item];
                    });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
