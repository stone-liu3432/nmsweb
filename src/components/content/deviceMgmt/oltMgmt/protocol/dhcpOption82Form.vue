<template>
    <el-form :model="formData" label-width="140px" ref="dhcp-option82-form">
        <template v-if="type === 'admin'">
            <el-form-item :label="langMap['option82_admin']">
                <el-select v-model.number="formData.option82_admin">
                    <el-option :value="0" :label="langMap['disable']"></el-option>
                    <el-option :value="1" :label="langMap['enable']"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'policy'">
            <el-form-item :label="langMap['option82_policy']">
                <el-select v-model.number="formData.option82_policy">
                    <el-option :value="0" :label="langMap['reserve']"></el-option>
                    <el-option :value="1" :label="langMap['drop']"></el-option>
                    <el-option :value="2" :label="langMap['replace']"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
export default {
    name: "dhcpOption82Form",
    computed: {
        ...mapState(["langMap"])
    },
    props: {
        data: {
            type: Object
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            formData: {
                option82_admin: 0,
                option82_policy: 0
            }
        };
    },
    methods: {
        validate(fn) {
            if (typeof fn === "function") {
                fn.call(this, this.formData);
            }
        },
        init() {
            if (this.type === "admin") {
                this.formData.option82_admin = this.data.option82_admin;
            }
            if (this.type === "policy") {
                this.formData.option82_policy = this.data.option82_policy;
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>