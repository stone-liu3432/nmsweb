<template>
    <div>
        <el-form
            inline
            size="small"
            :model="networkData"
            :rules="rules"
            ref="networkData"
            status-icon
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['protocol']" label-width="150px" prop="protocol">
                        <el-select v-model="networkData.protocol" :placeholder="langMap['protocol']">
                            <el-option value="http"></el-option>
                            <el-option value="snmp"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="langMap['port']" label-width="150px" prop="httpport">
                        <el-input
                            v-model.number="networkData.httpport"
                            :placeholder="langMap['port']"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['sipaddr']" label-width="150px" prop="sipaddr">
                        <el-input v-model="networkData.sipaddr" :placeholder="langMap['sipaddr']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="langMap['eipaddr']" label-width="150px" prop="eipaddr">
                        <el-input v-model="networkData.eipaddr" :placeholder="langMap['eipaddr']"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['ipmask']" label-width="150px" prop="ipmask">
                        <el-input v-model="networkData.ipmask" :placeholder="langMap['ipmask']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="langMap['groupname']" label-width="150px" prop="groupname">
                        <el-select
                            v-model="networkData.groupname"
                            :placeholder="langMap['groupname']"
                        >
                            <el-option
                                v-for="(item, index) in groups"
                                :key="index"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="networkData.protocol === 'snmp'">
                <el-col :span="8">
                    <el-form-item
                        :label="langMap['snmpversion']"
                        label-width="150px"
                        prop="snmpversion"
                    >
                        <el-select
                            v-model="networkData.snmpversion"
                            :placeholder="langMap['snmpversion']"
                        >
                            <el-option value="v1"></el-option>
                            <el-option value="v2c"></el-option>
                            <el-option value="v3" disabled></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                        :label="langMap['snmpcommunity']"
                        label-width="150px"
                        prop="snmpcommunity"
                    >
                        <el-input
                            v-model="networkData.snmpcommunity"
                            :placeholder="langMap['snmpcommunity']"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item size="small">
                        <el-button
                            type="primary"
                            style="width: 200px;"
                            @click="submitForm('networkData')"
                        >{{ langMap['add'] }}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { mapState } from "vuex";
import validator from "@/utils/validator";
function validatorPort(rule, value, callback) {
    var val = ~~value;
    if (val !== 80 && val !== 443 && (val < 10000 || val > 50000)) {
        return callback(new Error("80, 443, 10000-50000"));
    }
    callback();
}
function validatorSNMP(rule, value, callback) {
    var reg = /^\w{3,17}$/;
    if (!reg.test(value)) {
        return callback(new Error(" "));
    }
    callback();
}
export default {
    name: "discover-network",
    computed: mapState(["langMap"]),
    data() {
        return {
            groups: [],
            networkData: {
                sipaddr: "",
                eipaddr: "",
                groupname: "",
                snmpversion: "v2c",
                snmpcommunity: "",
                httpport: "",
                protocol: "http",
                ipmask: ""
            },
            rules: {
                sipaddr: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                eipaddr: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                ipmask: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                httpport: [
                    { validator: validatorPort, trigger: ["change", "blur"] }
                ],
                snmpcommunity: [
                    { validator: validatorSNMP, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getGroup();
    },
    methods: {
        getGroup() {
            this.$http
                .get("/api/server/group")
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.groups = res.data.data;
                            this.networkData.groupname = this.groups[0].name;
                        } else {
                            this.groups = [];
                        }
                    } else {
                        this.groups = [];
                    }
                })
                .catch(err => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (!this.groups.length) {
                        this.$message.error("no groups");
                        return;
                    }
                    var data = {
                        method: "add",
                        param: {
                            protocol: this.networkData.protocol,
                            sipaddr: this.networkData.sipaddr,
                            eipaddr: this.networkData.eipaddr,
                            ipmask: this.networkData.ipmask,
                            groupname: this.networkData.groupname,
                            httpport: this.networkData.httpport
                        }
                    };
                    if (this.networkData.protocol === "snmp") {
                        data.param.snmpversion = this.networkData.snmpversion;
                        data.param.snmpcommunity = this.networkData.snmpcommunity;
                    }
                    this.$http
                        .post("/api/device/discovery", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.langMap[data.method + '_success']);
                                this.$refs[formName].resetFields();
                                this.networkData.groupname = this.groups[0].name;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
