<template>
    <el-form
        :model="formData"
        :rules="formRules"
        label-width="150px"
        ref="onu-multi-vlan-set-form"
        size="small"
    >
        <template v-if="formFlag === 'tag-mode' || formFlag === 'add-mv-translate'">
            <el-form-item :label="langMap['tag_mode']" prop="tag_mode" key="tag-mode">
                <el-select v-model="formData.tag_mode" :disabled="formFlag === 'add-mv-translate'">
                    <template v-for="(item, index) in tagModes">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="formData.tag_mode === 2">
                <el-form-item label="svlan" prop="svlan" key="svlan">
                    <el-input v-model.number="formData.svlan"></el-input>
                </el-form-item>
                <el-form-item label="cvlan" prop="cvlan" key="cvlan">
                    <el-input v-model.number="formData.cvlan"></el-input>
                </el-form-item>
            </template>
        </template>
        <template v-if="formFlag === 'add-mvlan'">
            <el-form-item :label="langMap['mvlan']" prop="mvlan" key="mvlan">
                <el-input v-model.number="formData.mvlan"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorVlan } from "@/utils/validator";
export default {
    name: "onuMvlanForm",
    computed: {
        ...mapState(["langMap"])
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    props: {
        formFlag: { type: String, required: true }
    },
    data() {
        return {
            tagModes: ["tag", "untag", "translate"],
            formData: {
                tag_mode: 0,
                svlan: "",
                cvlan: "",
                mvlan: ''
            },
            formRules: {
                svlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                cvlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                mvlan: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {},
    methods: {
        validForm() {
            var flag = false;
            this.$refs["onu-multi-vlan-set-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        resetForm() {
            this.$refs["onu-multi-vlan-set-form"].resetFields();
        }
    },
    watch: {
        formFlag(){
            if(this.formFlag === 'add-mv-translate'){
                this.$nextTick(_ =>{
                    this.formData.tag_mode = 2;
                })
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
