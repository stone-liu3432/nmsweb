<template>
    <el-form :model="formData" :rules="formRules" label-width="170px" size="small" ref="onu-add-port-vlan-form">
        <el-form-item :label="langMap['port_id']">
            <span style="margin-left: 16px;">{{ port_id }}</span>
        </el-form-item>
        <el-form-item :label="langMap['onu_id']">
            <span style="margin-left: 16px;">{{ onu_id }}</span>
        </el-form-item>
        <el-form-item :label="langMap['op_id']">
            <span style="margin-left: 16px;">{{ formInfo.op_id }}</span>
        </el-form-item>
        <el-form-item :label="langMap['op_vlan_mode']">
            <span style="margin-left: 16px;">{{ opVlanMode[formInfo.op_vlan_mode] }}</span>
        </el-form-item>
        <template v-if="formInfo.op_vlan_mode === 2">
            <el-form-item label="old vlan" prop="old_vlan_id">
                <el-input v-model.number="formData.old_vlan_id"></el-input>
            </el-form-item>
            <el-form-item label="new vlan" prop="new_vlan_id">
                <el-input v-model.number="formData.new_vlan_id"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['new_vlan_pri']" prop="new_vlan_pri">
                <el-select v-model.number="formData.new_vlan_pri">
                    <el-option :value="0"></el-option>
                    <template v-for="item in 7">
                        <el-option :value="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="formInfo.op_vlan_mode === 4">
            <el-form-item :label="langMap['start_vlan_id']" prop="start_vlan_id">
                <el-input v-model.number="formData.start_vlan_id"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['end_vlan_id']" prop="end_vlan_id">
                <el-input v-model.number="formData.end_vlan_id"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "onuAddPortVlan",
    computed: {
        ...mapState(["langMap"])
    },
    props: {
        formInfo: { type: Object }
    },
    inject: ["dev_ip", "port_id", "onu_id"],
    data() {
        return {
            formData: {
                old_vlan_id: "",
                new_vlan_id: "",
                new_vlan_pri: 0,
                start_vlan_id: "",
                end_vlan_id: ""
            },
            formRules: {
                old_vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                new_vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                start_vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                end_vlan_id: [
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
    created() {},
    methods: {
        validForm(){
            var flag = false;
            this.$refs['onu-add-port-vlan-form'].validate(valid => {
                flag = valid;
            })
            return flag;
        },
        resetForm(){
            this.$refs['onu-add-port-vlan-form'].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
