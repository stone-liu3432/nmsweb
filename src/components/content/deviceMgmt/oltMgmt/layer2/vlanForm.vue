<template>
    <el-form
        label-width="120px"
        :model="vlanForm"
        :rules="vlanRules"
        size="small"
        label-position="left"
    >
        <el-form-item :label="langMap['vlan_id']">
            <el-form
                inline
                size="small"
                :model="vlanForm"
                :rules="vlanRules"
                ref="vlan-id-range-form"
            >
                <template v-if="!vlanData.vlan_id">
                    <el-form-item prop="vlan_id_s">
                        <el-input style="width: 80px;" v-model.number="vlanForm.vlan_id_s"></el-input>
                    </el-form-item>
                    <span style="margin: 0 10px 0 0;">-</span>
                    <el-form-item prop="vlan_id_e">
                        <el-input style="width: 80px;" v-model.number="vlanForm.vlan_id_e"></el-input>
                    </el-form-item>
                    <span
                        style="font-size: 14px; color: #333;margin-left: 30px;color: #409EFF;"
                    >{{ langMap['vlanid_range_hit'] }}</span>
                </template>
                <span style="margin-left: 16px;" v-else>{{ vlanData.vlan_id }}</span>
            </el-form>
        </el-form-item>
        <el-form-item :label="langMap['tagged']">
            <el-checkbox-group v-model="taggedList" @change="taggedChange">
                <el-checkbox
                    style="width: 72px;"
                    v-for="(item, key) in port_name"
                    :label="Number(key)"
                    :key="item"
                    :disabled="disabledList.indexOf(Number(key)) > -1"
                >{{ item }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="langMap['untagged']">
            <el-checkbox-group v-model="untaggedList" @change="untaggedChange">
                <el-checkbox
                    style="width: 72px;"
                    v-for="(item, key) in port_name"
                    :label="Number(key)"
                    :key="item"
                    :disabled="disabledList.indexOf(Number(key)) > -1"
                >{{ item }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { analysisPortList } from "@/utils/common";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "vlanForm",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    props: {
        flag: {
            type: String,
            default: "create"
        },
        vlanData: {
            type: Object,
            default: _ => {}
        }
    },
    data() {
        return {
            vlanForm: {
                vlan_id_s: "",
                vlan_id_e: ""
            },
            vlanRules: {
                vlan_id_s: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                vlan_id_e: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            },
            disabledList: [],
            taggedList: [],
            untaggedList: []
        };
    },
    created() {},
    methods: {
        taggedChange(checked) {
            if (checked.length) {
                var val = checked[checked.length - 1];
                if (this.untaggedList.indexOf(val) > -1) {
                    this.untaggedList.splice(this.untaggedList.indexOf(val), 1);
                }
            }
        },
        untaggedChange(checked) {
            if (checked.length) {
                var val = checked[checked.length - 1];
                if (this.taggedList.indexOf(val) > -1) {
                    this.taggedList.splice(this.taggedList.indexOf(val), 1);
                }
            }
        },
        validForm() {
            var flag = false;
            this.$refs['vlan-id-range-form'].validate(valid =>{
                flag = valid;
            })
            return flag;
        },
        resetForm(){
            this.$refs['vlan-id-range-form'].resetFields();
        }
    },
    watch: {
        vlanData() {
            if (this.flag === "config") {
                this.disabledList = analysisPortList(
                    this.vlanData.default_vlan_portlist
                );
                this.taggedList = analysisPortList(
                    this.vlanData.tagged_portlist
                );
                this.untaggedList = analysisPortList(
                    this.vlanData.untagged_portlist
                );
            } else {
                this.disabledList = [];
                this.taggedList = [];
                this.untaggedList = [];
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
