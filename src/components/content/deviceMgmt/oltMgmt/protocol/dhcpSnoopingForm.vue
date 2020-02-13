<template>
    <el-form :model="formData" label-width="160px" ref="dhcp-snooping-form" :rules="rules">
        <template v-if="type === 'snooping_admin'">
            <el-form-item :label="langMap['snooping_admin']" prop="snooping_admin">
                <el-select v-model.number="formData.snooping_admin">
                    <el-option :label="langMap['disable']" :value="0"></el-option>
                    <el-option :label="langMap['enable']" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'chaddr_check'">
            <el-form-item :label="langMap['chaddr_check']" prop="chaddr_check">
                <el-select v-model.number="formData.chaddr_check">
                    <el-option :label="langMap['disable']" :value="0"></el-option>
                    <el-option :label="langMap['enable']" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="type === 'response_time'">
            <el-form-item :label="langMap['response_time']" prop="response_time">
                <el-input v-model.number="formData.response_time"></el-input>
            </el-form-item>
        </template>
        <template v-if="type === 'add' || type === 'delete'">
            <el-form-item :label="langMap['trust_portlist']" prop="trust_portlist">
                <el-checkbox-group v-model="formData.trust_portlist">
                    <template v-for="(item, key) in port_name">
                        <template v-if="(key >>> 0) > ponports">
                            <el-checkbox
                                :disabled="isDisabled(key >>> 0)"
                                :label="key >>> 0"
                            >{{ item }}</el-checkbox>
                        </template>
                    </template>
                </el-checkbox-group>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { analysisPortList } from "@/utils/common";
export default {
    name: "dhcpSnoopingForm",
    computed: {
        ...mapState(["langMap", "dev_ip", "port_name", "basicInfo"]),
        ponports() {
            return this.basicInfo.ponports;
        },
        plist() {
            return analysisPortList(this.data.trust_portlist);
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
                snooping_admin: 0,
                chaddr_check: 0,
                response_time: "",
                trust_portlist: []
            },
            rules: {
                response_time: [
                    { validator: this.validTime, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    methods: {
        init() {
            this.$refs["dhcp-snooping-form"].resetFields();
            if (this.type === "snooping_admin") {
                this.formData.snooping_admin = this.data.snooping_admin;
            }
            if (this.type === "chaddr_check") {
                this.formData.chaddr_check = this.data.chaddr_check;
            }
            if (this.type === "response_time") {
                this.formData.response_time = this.data.response_time;
            }
            if (this.type === "add" || this.type === "delete") {
                this.formData.trust_portlist = this.plist;
            }
        },
        isDisabled(port_id) {
            if (this.type === "add") {
                return this.plist.includes(port_id);
            } else {
                return !this.plist.includes(port_id);
            }
        },
        validate(fn) {
            this.$refs["dhcp-snooping-form"].validate(valid => {
                if (valid) {
                    fn.call(this, this.formData);
                } else {
                    fn.call(this, valid);
                }
            });
        },
        validTime(rule, value, cb) {
            if (this.type !== "response_time") {
                return cb();
            }
            if (value < 3 || value > 3600 || isNaN(value)) {
                return cb(new Error("Range: 3-3600"));
            }
            cb();
        }
    }
};
</script>

<style lang="less" scoped>
</style>