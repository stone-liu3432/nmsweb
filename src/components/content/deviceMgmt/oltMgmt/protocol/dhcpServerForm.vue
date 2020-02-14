<template>
    <el-form :model="formData" label-width="170px" :rules="rules" ref="dhcp-server-form">
        <template v-if="type === 'interface'">
            <el-form-item :label="langMap['interface']" prop="interface">
                <el-select v-model.number="formData.interface">
                    <template v-for="item in inbound">
                        <el-option :label="item.interface" :value="item.vlan_id"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'config'">
            <el-form-item :label="langMap['ipaddress_s']" prop="ipaddress_s">
                <el-input v-model="formData.ipaddress_s"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['ipaddress_e']" prop="ipaddress_e">
                <el-input v-model="formData.ipaddress_e"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['ipmask']" prop="ipmask">
                <el-input v-model="formData.ipmask"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['pridns']" prop="pridns">
                <el-input v-model="formData.pridns"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['secdns']" prop="secdns">
                <el-input v-model="formData.secdns"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['gateway']" prop="gateway">
                <el-input v-model="formData.gateway"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['lease_time']" prop="lease_time">
                <el-input v-model.number="formData.lease_time"></el-input>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorIpAddr } from "@/utils/validator";
export default {
    name: "dhcpServerForm",
    computed: {
        ...mapState(["langMap"])
    },
    props: {
        data: {
            type: Object
        },
        inbound: {
            type: Array
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            formData: {
                ipaddress_s: "",
                ipaddress_e: "",
                ipmask: "",
                interface: "",
                pridns: "",
                secdns: "",
                gateway: "",
                lease_time: ""
            },
            rules: {
                ipaddress_s: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                ipaddress_e: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                ipmask: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                pridns: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                secdns: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                gateway: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                lease_time: [
                    { validator: this.validTime, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$refs["dhcp-server-form"].resetFields();
            Object.keys(this.formData).forEach(key => {
                this.formData[key] = this.data[key];
            });
        },
        validIp(rule, val, cb) {
            // 备用dns地址可以为空
            if (rule && rule.field === "secdns") {
                if (val === "") {
                    return cb();
                }
            }
            return validatorIpAddr(rule, val, cb);
        },
        validTime(rule, val, cb) {
            if (val < 60 || val > 864000 || isNaN(val)) {
                return cb(new Error("Range: 60-864000"));
            }
            cb();
        },
        validate(fn) {
            this.$refs["dhcp-server-form"].validate(valid => {
                if (valid) {
                    if (typeof fn === "function") {
                        fn.call(this, this.formData);
                    }
                } else {
                    fn.call(this, valid);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>