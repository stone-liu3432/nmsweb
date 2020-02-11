<template>
    <el-form :model="formData" label-width="140px" :rules="rules" ref="dhcp-relay-form">
        <template v-if="type === 'admin'">
            <el-form-item :label="langMap['relay_admin']" prop="relay_admin">
                <el-select v-model.number="formData.relay_admin">
                    <el-option :value="0" :label="langMap['disable']"></el-option>
                    <el-option :value="1" :label="langMap['enable']"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'policy'">
            <el-form-item :label="langMap['relay_policy']" prop="relay_policy">
                <el-select v-model.number="formData.relay_policy">
                    <el-option :value="0" :label="langMap['standard']"></el-option>
                    <el-option :value="1" :label="langMap['option60']"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'server_ip'">
            <template v-if="policyType === 0">
                <el-form-item :label="langMap['vlan_id']" prop="vlan_id">
                    <el-input v-model.number="formData.vlan_id"></el-input>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label="langMap['option60']" prop="option60">
                    <el-input v-model="formData.option60"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="langMap['server_ip']" prop="server_ip">
                <el-input v-model="formData.server_ip"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorIpAddr, validatorVlan } from "@/utils/validator";
export default {
    name: "dhcpRelayForm",
    computed: {
        ...mapState(["langMap"]),
        policyType() {
            return this.data.relay_policy;
        }
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
                relay_admin: 0,
                relay_policy: 0,
                vlan_id: "",
                option60: "",
                server_ip: ""
            },
            rules: {
                vlan_id: [
                    {
                        validator: this.validVlan,
                        trigger: ["change", "blur"]
                    }
                ],
                option60: [
                    {
                        validator: this.validOption60,
                        trigger: ["change", "blur"]
                    }
                ],
                server_ip: [
                    {
                        validator: validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            if (this.type === "admin") {
                this.formData.relay_admin = this.data.relay_admin;
            }
            if (this.type === "policy") {
                this.formData.relay_policy = this.data.relay_policy;
            }
            this.formData.vlan_id = "";
            this.formData.option60 = "";
            this.formData.server_ip = "";
        },
        validVlan(rule, value, cb) {
            if (this.policyType === 1) {
                return cb();
            }
            return validatorVlan(rule, value, cb);
        },
        validOption60(rule, value, cb) {
            if (this.policyType === 0) {
                return cb();
            }
            const reg = /^\w{1,64}$/;
            if (!reg.test(this.formData.option60)) {
                return cb(new Error(this.langMap.composeRange(1, 64)));
            }
            cb();
        },
        validIp(rule, value, cb) {
            return validatorIpAddr(rule, value, cb);
        },
        validate(fn) {
            this.$refs["dhcp-relay-form"].validate(valid => {
                if (valid) {
                    return fn(this.formData);
                }
                fn(valid);
            });
        },
        reset() {
            this.$refs["dhcp-relay-form"].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>