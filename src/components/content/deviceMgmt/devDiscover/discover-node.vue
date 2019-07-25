<template>
    <div>
        <el-form size="small" :model="addData" :rules="rules" ref="devData" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['name']" prop="name">
                        <el-input v-model="addData.name" :placeholder="langMap['name']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                    <el-form-item :label="langMap['model']" prop="model">
                        <el-input v-model="addData.model" :placeholder="langMap['model']"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['protocol']" prop="protocol">
                        <el-select v-model="addData.protocol">
                            <el-option value="http"></el-option>
                            <el-option value="https"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                    <el-form-item :label="langMap['port']" prop="port">
                        <el-input v-model="addData.port"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['ipaddr']" prop="ipaddr">
                        <el-input v-model="addData.ipaddr" :placeholder="langMap['ipaddr']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                    <el-form-item :label="langMap['ipmask']" prop="ipmask">
                        <el-input v-model="addData.ipmask" :placeholder="langMap['ipmask']"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="langMap['mclass']" prop="class">
                        <el-select v-model.number="addData.class" :placeholder="langMap['mclass']">
                            <el-option :value="1" label="EPON">EPON</el-option>
                            <el-option :value="2" label="GPON">GPON</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                    <el-form-item :label="langMap['groupname']" prop="groupname">
                        <el-select v-model="addData.groupname" :placeholder="langMap['groupname']">
                            <el-option :value="item" v-for="(item, index) in groups" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item size="small">
                        <el-button
                            type="primary"
                            style="width: 200px;"
                            @click="submitForm('devData')"
                        >{{ langMap['add'] }}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import validator from "@/utils/validator";
export default {
    name: "discover-node",
    computed: mapState(["langMap"]),
    data() {
        return {
            addData: {
                ipaddr: "",
                ipmask: "255.255.255.0",
                //macaddr: "",
                model: "",
                class: 1,
                groupname: "",
                name: "",
                port: 80,
                protocol: "http"
            },
            rules: {
                name: [
                    {
                        validator: validator.validatorName,
                        trigger: ["blur", "change"]
                    }
                ],
                groupname: [
                    {
                        validator: validator.validatorName,
                        trigger: ["blur", "change"]
                    }
                ],
                ipaddr: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["blur", "change"]
                    }
                ],
                model: [
                    {
                        validator: this.validModel,
                        trigger: ["blur", "change"]
                    }
                ],
                ipmask: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                port: [
                    { validator: this.validRange, trigger: ["change", "blur"] }
                ]
            },
            groups: []
            //devList: []  暂未支持
        };
    },
    created() {
        this.getGroup();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        method: "add",
                        param: {
                            name: this.addData.name,
                            ipaddr: this.addData.ipaddr,
                            ipmask: this.addData.ipmask,
                            model: this.addData.model,
                            mclass: this.addData.class,
                            groupname: this.addData.groupname,
                            protocol: this.addData.protocol,
                            httpport: this.addData.port
                        }
                    };
                    this.$http
                        .post("/api/device/olt", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                this.$refs[formName].resetFields();
                                this.addData.groupname = this.groups[0];
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                } else {
                    return false;
                }
            });
        },
        getGroup() {
            this.$http
                .get("/api/device/group")
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.groups.push(item.groupname);
                            });
                            this.addData.groupname = this.groups[0];
                        } else {
                            this.groups = [];
                        }
                    } else {
                        this.groups = [];
                    }
                })
                .catch(err => {});
        },
        validRange(rule, value, cb) {
            if (value < 80 || value > 50000 || isNaN(value)) {
                return cb(new Error("Range: 80 - 50000"));
            }
            cb();
        },
        //  设备型号可以为空
        validModel(rule, value, cb) {
            if (value === "") {
                return cb();
            }
            return validator.validatorModel(rule, value, cb);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
