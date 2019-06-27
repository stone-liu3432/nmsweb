<template>
    <el-form label-width="140px" :model="formData" ref="port-config-form" :rules="formRules">
        <el-form-item :label="langMap['port_id']">
            <span style="margin-left: 16px;">{{ port_name[info.port_id] }}</span>
        </el-form-item>
        <template v-if="flag === 'basic'">
            <el-form-item :label="langMap['admin_status']" key="admin_status">
                <el-select v-model="formData.admin_status" :disabled="info.port_id <= ponports">
                    <el-option :value="0" :label="langMap['disable']"></el-option>
                    <el-option :value="1" :label="langMap['enable']"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['auto_neg']" key="auto_neg">
                <el-select v-model="formData.auto_neg">
                    <el-option :value="0" :label="langMap['disable']"></el-option>
                    <el-option :value="1" :label="langMap['enable']"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['speed']" key="speed">
                <el-select v-model="formData.speed" :disabled="info.port_id <= ponports">
                    <el-option value="Auto"></el-option>
                    <el-option value="10M" v-if="info.port_id <= geports"></el-option>
                    <el-option value="100M" v-if="info.port_id <= geports"></el-option>
                    <el-option value="1000M"></el-option>
                    <el-option value="10000M" v-if="info.port_id > geports"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['duplex']" key="duplex">
                <el-select v-model="formData.duplex" :disabled="info.port_id <= ponports">
                    <el-option :value="0" :label="langMap['half']"></el-option>
                    <el-option :value="1" :label="langMap['full']"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['flow_ctrl']" key="flow_ctrl">
                <el-select v-model="formData.flow_ctrl">
                    <el-option :value="0" :label="langMap['disable']"></el-option>
                    <el-option :value="1" :label="langMap['enable']"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['mtu']" prop="mtu" key="mtu">
                <el-input v-model.number="formData.mtu"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['erate']" prop="erate" key="erate">
                <el-input v-model.number="formData.erate"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['irate']" prop="irate" key="irate">
                <el-input v-model.number="formData.irate"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['pvid']" prop="pvid" key="pvid">
                <el-input v-model.number="formData.pvid"></el-input>
            </el-form-item>
        </template>
        <template v-if="flag === 'storm'">
            <el-form-item :label="langMap['broadcast']" prop="broadcast" key="broadcast">
                <el-input v-model.number="formData.broadcast"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['multicast']" prop="multicast" key="multicast">
                <el-input v-model.number="formData.multicast"></el-input>
            </el-form-item>
            <el-form-item :label="langMap['unicast']" prop="unicast" key="unicast">
                <el-input v-model.number="formData.unicast"></el-input>
            </el-form-item>
        </template>
        <template v-if="flag === 'mirror'">
            <el-form-item :label="langMap['dst_port']" key="dst_port">
                <el-select v-model.number="formData.dst_port">
                    <el-option :value="0" label=" - "></el-option>
                    <template v-for="(item, key) in port_name" v-if="key > ponports">
                        <el-option :value="Number(key)" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['type']" key="type">
                <el-select v-model="formData.type">
                    <el-option :value="0" label=" - "></el-option>
                    <el-option :value="1" label="ingress"></el-option>
                    <el-option :value="2" label="egress"></el-option>
                    <el-option :value="3" label="all"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorVlan } from '@/utils/validator';
export default {
    name: "portCfgForm",
    props: {
        info: {
            type: Object,
            default: _ => {
                return {};
            }
        },
        flag: {
            type: String,
            default: "basic"
        }
    },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", 'basicInfo']),
        ponports(){
            return this.basicInfo.ponports;
        },
        geports(){
            return this.basicInfo.ponports + this.basicInfo.geports;
        },
        xgeports(){
            return this.basicInfo.xgeports ? (this.ponports + this.geports + this.basicInfo.xgeports) : 0;
        }
    },
    data() {
        return {
            formData: {
                admin_status: 1,
                auto_neg: 0,
                speed: "",
                duplex: 1,
                flow_ctrl: 0,
                mtu: 0,
                erate: 0,
                irate: 0,
                pvid: 1,
                broadcast: 0,
                multicast: 0,
                unicast: 0,
                dst_port: 0,
                type: 0
            },
            formRules: {
                mtu: [
                    { validator: this.validMtu, trigger: ['change', 'blur'] }
                ],
                erate: [
                    { validator: this.validRate, trigger: ['change', 'blur'] }
                ],
                irate: [
                    { validator: this.validRate, trigger: ['change', 'blur'] }
                ],
                pvid: [
                    { validator: validatorVlan, trigger: ['change', 'blur'] }
                ],
                broadcast: [
                    { validator: this.validStorm, trigger: ['change', 'blur'] }
                ],
                multicast: [
                    { validator: this.validStorm, trigger: ['change', 'blur'] }
                ],
                unicast: [
                    { validator: this.validStorm, trigger: ['change', 'blur'] }
                ]
            }
        };
    },
    created() {},
    methods: {
        validForm() {
            var flag = false;
            this.$refs["port-config-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        validMtu(rule, value, callback) {
            if (this.flag !== "basic") {
                return callback();
            }
            if (value < 128 || value > 2000 || isNaN(value)) {
                return callback(new Error("Range: 128 - 2000"));
            }
            callback();
        },
        validRate(rule, value, callback) {
            if (this.flag !== "basic") {
                return callback();
            }
            if (value < 64 || value > 1024000 || isNaN(value)) {
                return callback(new Error("Range: 64 - 1024000 Kbps"));
            }
            callback();
        },
        validStorm(rule, value, callback) {
            if (this.flag !== "storm") {
                return callback();
            }
            if (value < 1 || value > 1488100 || isNaN(value)) {
                return callback(new Error("Range: 1 - 1488100 pps"));
            }
            callback();
        }
    },
    watch: {
        info() {
            Object.keys(this.info).forEach(item => {
                this.formData[item] = this.info[item];
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
