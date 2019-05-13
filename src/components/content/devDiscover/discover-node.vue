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
                        <el-select v-model="addData.class" :placeholder="langMap['mclass']">
                            <el-option value="EPON"></el-option>
                            <el-option value="GPON"></el-option>
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
import { mapState } from "vuex";
import validator from "@/utils/validator";
export default {
    name: "discover-node",
    computed: mapState(["langMap"]),
    data() {
        return {
            addData: {
                ipaddr: "",
                ipmask: "",
                //macaddr: "",
                model: "",
                class: "EPON",
                groupname: "",
                name: ""
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
                        validator: validator.validatorModel,
                        trigger: ["blur", "change"]
                    }
                ],
                ipmask: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            groups: [],
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
                            groupname: this.addData.groupname
                        }
                    };
                    this.$http
                        .post("/api/device/olt", data)
                        .then(res => {
                            if(res.data.code === 1){
                                this.$message.success(this.langMap[data.method + '_success']);
                                this.$refs[formName].resetFields();
                                this.addData.groupname = this.groups[0];
                            }else{
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
                .get("/api/server/group")
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.groups.push(item.name);
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
        }
        //  暂未支持
        // getDev(){
        //     this.$http.get('/api/device/olt?type=list').then(res =>{
        //         if(res.data.code === 1){

        //         }else{

        //         }
        //     }).catch(err =>{})
        // }
    }
};
</script>

<style lang="less" scoped>
</style>
