<template>
    <el-form
        :model="formData"
        :rules="formRules"
        label-width="150px"
        ref="acl-mgmt-dialog-form"
        size="small"
    >
        <el-form-item label="ACL ID" prop="acl_id" v-if="formFlag === 'add-acl'" key="add-acl-id" style="margin-bottom: 30px;">
            <el-input v-model.number="formData.acl_id"></el-input>
        </el-form-item>
        <template v-if="formFlag === 'add-acl'">
            <el-form-item :label="langMap['type']" prop="type">
                <el-select v-model.number="formData.type">
                    <el-option :label="langMap['basic'] + 'ACL' + langMap['rule']" :value="1"></el-option>
                    <el-option :label="langMap['advanced'] + 'ACL' + langMap['rule']" :value="2"></el-option>
                    <el-option :label="langMap['link'] + 'ACL' + langMap['rule']" :value="3"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="formFlag === 'delete-acl'">
            <el-col :span="14">
                <el-form-item label="ACL ID" prop="acl_id" key="del-rule-id" style="margin-bottom: 50px;">
                    <el-input v-model.number="formData.acl_id"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 32px; text-align: center;">-</el-col>
            <el-col :span="9">
                <el-form-item label-width="0" prop="acl_id_e" key="del-acl-id-e" style="margin-bottom: 50px;">
                    <el-input v-model.number="formData.acl_id_e"></el-input>
                </el-form-item>
            </el-col>
        </template>
        <template v-if="formFlag === 'config' || formFlag === 'add-rule'">
            <el-form-item label="ACL ID">
                <span style="margin-left: 16px;">{{ formInfo.acl_id }}</span>
            </el-form-item>
            <el-form-item label="Rule ID" prop="rule_id" key="config-rule-id">
                <el-select v-if="formFlag === 'config'" v-model="formData.rule_id">
                    <template v-for="item in formInfo.rule">
                        <el-option :value="item.rule_id"></el-option>
                    </template>
                </el-select>
                <el-input v-model.number="formData.rule_id" v-else></el-input>
            </el-form-item>
            <el-form-item :label="langMap['action']" prop="action">
                <el-select v-model="formData.action">
                    <el-option label="deny" :value="1"></el-option>
                    <el-option label="permit" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="formType() === 1 || formType() === 2">
                <el-form-item
                    :label="langMap['protocol']"
                    prop="protocol"
                    v-if="formType() === 2"
                    key="acl-protocol"
                >
                    <el-input v-model="formData.protocol"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['src_ipaddr']" prop="src_ipaddr" key="acl-src_ipaddr">
                    <el-input v-model="formData.src_ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['src_ipmask']" prop="src_ipmask" key="acl-src_ipmask">
                    <el-input v-model="formData.src_ipmask"></el-input>
                </el-form-item>
                <template v-if="formType() === 2">
                    <el-form-item
                        :label="langMap['dst_ipaddr']"
                        prop="dst_ipaddr"
                        key="acl-dst_ipaddr"
                    >
                        <el-input v-model="formData.dst_ipaddr"></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="langMap['dst_ipmask']"
                        prop="dst_ipmask"
                        key="acl-dst_ipmask"
                    >
                        <el-input v-model="formData.dst_ipmask"></el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['src_port']" prop="src_port" key="acl-src_port">
                        <el-input v-model="formData.src_port"></el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['dst_port']" prop="dst_port" key="acl-dst_port">
                        <el-input v-model="formData.dst_port"></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="langMap['precedence']"
                        prop="precedence"
                        key="acl-precedence"
                    >
                        <el-input v-model="formData.precedence" :disabled="formData.dscp !== ''"></el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['dscp']" prop="dscp" key="acl-dscp">
                        <el-input v-model="formData.dscp" :disabled="formData.precedence !== ''"></el-input>
                    </el-form-item>
                </template>
            </template>
            <template v-if="formType() === 3">
                <el-form-item :label="langMap['eth_type']" prop="eth_type" key="acl-eth_type">
                    <el-input v-model="formData.eth_type"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['cos']" prop="cos" key="acl-cos">
                    <el-input v-model="formData.cos"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['inner_cos']" prop="inner_cos" key="acl-inner_cos">
                    <el-input v-model="formData.inner_cos"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['vlan_id']" prop="vlan_id" key="acl-vlan_id">
                    <el-input v-model="formData.vlan_id"></el-input>
                </el-form-item>
                <el-form-item
                    :label="langMap['inner_vlan_id']"
                    prop="inner_vlan_id"
                    key="acl-inner_vlan_id"
                >
                    <el-input v-model="formData.inner_vlan_id"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['src_mac']" prop="src_mac" key="acl-src_mac">
                    <el-input v-model="formData.src_mac"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['src_mask']" prop="src_mask" key="acl-src_mask">
                    <el-input v-model="formData.src_mask"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['dst_mac']" prop="dst_mac" key="acl-dst_mac">
                    <el-input v-model="formData.dst_mac"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['dst_mask']" prop="dst_mask" key="acl-dst_mask">
                    <el-input v-model="formData.dst_mask"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="langMap['timerange']" prop="timerange">
                <el-select v-model="formData.timerange">
                    <template v-for="item in timerange">
                        <el-option :value="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import {
    validatorMac,
    validatorIpAddr,
    validatorVlan
} from "@/utils/validator";
export default {
    name: "aclForm",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    props: {
        formInfo: {
            type: Object,
            default: _ => {}
        },
        formFlag: {
            type: String,
            default: "add-acl"
        }
    },
    data() {
        return {
            timerange: [],
            formData: {
                acl_id: "",
                acl_id_e: "",
                type: 1,
                rule_id: 0,
                action: 1,
                src_ipaddr: "",
                src_ipmask: "",
                timerange: "",
                protocol: "",
                dst_ipaddr: "",
                dst_ipmask: "",
                src_port: "",
                dst_port: "",
                precedence: "",
                dscp: "",
                eth_type: "",
                cos: "",
                inner_cos: "",
                vlan_id: "",
                inner_vlan_id: "",
                src_mac: "",
                src_mask: "",
                dst_mac: "",
                dst_mask: ""
            },
            formRules: {
                acl_id: [
                    { validator: this.validAcl, trigger: ["change", "blur"] }
                ],
                acl_id_e: [
                    { validator: this.validAcl, trigger: ["change", "blur"] }
                ],
                rule_id: [
                    {
                        validator: this.validRange(1, 16),
                        trigger: ["change", "blur"]
                    }
                ],
                src_ipaddr: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                src_ipmask: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                protocol: [
                    {
                        validator: this.validProtocol,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_ipaddr: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                dst_ipmask: [
                    { validator: this.validIp, trigger: ["change", "blur"] }
                ],
                src_port: [
                    {
                        validator: this.validRange(1, 65535),
                        trigger: ["change", "blur"]
                    }
                ],
                dst_port: [
                    {
                        validator: this.validRange(1, 65535),
                        trigger: ["change", "blur"]
                    }
                ],
                precedence: [
                    {
                        validator: this.validRange(0, 7),
                        trigger: ["change", "blur"]
                    }
                ],
                dscp: [
                    {
                        validator: this.validRange(0, 63),
                        trigger: ["change", "blur"]
                    }
                ],
                eth_type: [
                    {
                        validator: this.validRange(0, 0xffff),
                        trigger: ["change", "blur"]
                    }
                ],
                cos: [
                    {
                        validator: this.validRange(0, 7),
                        trigger: ["change", "blur"]
                    }
                ],
                inner_cos: [
                    {
                        validator: this.validRange(0, 7),
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_id: [
                    { validator: this.validVlan, trigger: ["change", "blur"] }
                ],
                inner_vlan_id: [
                    { validator: this.validVlan, trigger: ["change", "blur"] }
                ],
                src_mac: [
                    { validator: this.validMac, trigger: ["change", "blur"] }
                ],
                src_mask: [
                    {
                        validator: this.validMacmask,
                        trigger: ["change", "blur"]
                    }
                ],
                dst_mac: [
                    { validator: this.validMac, trigger: ["change", "blur"] }
                ],
                dst_mask: [
                    {
                        validator: this.validMacmask,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getTimerange();
    },
    methods: {
        getTimerange() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_acl",
                    params: { form: "time_range", name: "all" }
                }),
                method: "get"
            })
                .then(res => {
                    this.timerange = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.timerange.push(item.name);
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        validAcl(rule, value, cb) {
            if (this.formData.acl_id !== "" && value === "") {
                return cb();
            }
            if(this.formFlag === 'delete-acl'){
                if(value < 2000 || value > 5999 || isNaN(value)){
                    return cb(new Error('Range: 2000-5999'));
                }
                return cb();
            }
            //  基础ACL为2000-2999，高级ACL为3000-4999，链路ACL为5000-5999
            if (this.formData.type === 1 && (value < 2000 || value > 2999 || isNaN(value))) {
                return cb(new Error(this.langMap["acl_id_range_error"]));
            }
            if (this.formData.type === 2 && (value < 3000 || value > 4999 || isNaN(value))) {
                return cb(new Error(this.langMap["acl_id_range_error"]));
            }
            if (this.formData.type === 3 && (value < 5000 || value > 5999 || isNaN(value))) {
                return cb(new Error(this.langMap["acl_id_range_error"]));
            }
            cb();
        },
        validForm() {
            var flag = false;
            this.$refs["acl-mgmt-dialog-form"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        resetForm() {
            this.$refs["acl-mgmt-dialog-form"].resetFields();
        },
        formType() {
            var id = this.formInfo.acl_id;
            if (id >= 2000 && id < 3000) {
                return 1;
            }
            if (id >= 3000 && id < 5000) {
                return 2;
            }
            if (id >= 5000 && id <= 5999) {
                return 3;
            }
        },
        validRange(min, max) {
            return (rule, value, cb) => {
                if (value === "") {
                    return cb();
                }
                if (value < min || value > max || isNaN(value)) {
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            };
        },
        validProtocol(rule, value, cb) {
            var protocols = ["icmp", "udp", "tcp", "ip", "ipinip"];
            if (
                protocols.indexOf(value) < 0 &&
                (value < 0 || value > 255 || isNaN(value) || value === "")
            ) {
                return cb(
                    new Error(" icmp | udp | tcp | ip | ipinip | <0 - 255> ")
                );
            }
            cb();
        },
        validIp(rule, value, cb) {
            if (value === "") {
                return cb();
            }
            return validatorIpAddr(rule, value, cb);
        },
        validMac(rule, value, cb) {
            if (value === "") {
                return cb();
            }
            return validatorMac(rule, value, cb);
        },
        validVlan(rule, value, cb) {
            if (value === "") {
                return cb();
            }
            return validatorVlan(rule, value, cb);
        },
        validMacmask(rule, value, cb) {
            var reg = /^(([0-9a-fA-F]{4}\-)){2}[0-9a-fA-F]{4}$/;
            if (value !== "" && !reg.test(value)) {
                return cb(new Error("ex: xxxx-xxxx-xxxx"));
            }
            cb();
        }
    },
    watch: {
        formInfo() {
            this.formData.acl_id = this.formInfo.acl_id;
            if (this.formFlag === "config") {
                this.$nextTick(_ => {
                    this.formData.rule_id = this.formInfo.rule[0].rule_id;
                    this.formInfo.rule.forEach(item => {
                        if (item.rule_id === this.formData.rule_id) {
                            Object.keys(item).forEach(_item => {
                                this.formData[_item] = item[_item];
                            });
                        }
                    });
                });
            } else {
                this.resetForm();
            }
        },
        "formData.rule_id"() {
            if (this.formData.rule_id && this.formFlag === "config") {
                this.$nextTick(_ => {
                    this.formInfo.rule.forEach(item => {
                        if (item.rule_id === this.formData.rule_id) {
                            Object.keys(item).forEach(_item => {
                                this.formData[_item] = item[_item];
                            });
                            this.formData.precedence &&
                                (this.formData.dscp = "");
                            this.formData.dscp &&
                                (this.formData.precedence = "");
                        }
                    });
                });
            }
        },
        "formData.type"(){
            this.$refs['acl-mgmt-dialog-form'].validateField('acl_id');
        }
    }
};
</script>

<style lang="less" scoped>
</style>
