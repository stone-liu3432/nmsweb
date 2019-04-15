<template>
    <div>
        <!--  
            "name":"EPON-OLT-E04",
            "ipaddr":"192.168.100.171",
            "macaddr":"38:3a:21:20:00:01",
            "model":"HSGQ-E08",
            "class":"EPON",
            "groupname":"1",
            "creater":"admin",
            "timestamp":"2019/12/12 09:09:09"
        -->
        <el-form inline size="small" :model="addData" :rules="rules" ref="devData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="name" label-width="120px" prop="devname">
                        <el-input v-model="addData.name" placeholder="protocol"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="ip address" label-width="120px" prop="ipaddr">
                        <el-input v-model="addData.ipaddr" placeholder="ip address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="mac" label-width="120px" prop="mac">
                        <el-input v-model="addData.macaddr" placeholder="mac"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="model" label-width="120px" prop="model">
                        <el-input v-model="addData.model" placeholder="model"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="class" label-width="120px" prop="class">
                        <el-input v-model="addData.class" placeholder="class"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="group name" label-width="120px" prop="groupname">
                        <el-input v-model="addData.groupname" placeholder="group name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item size="small">
                        <el-button type="primary" style="width: 200px;" @click="submitForm('devData')">添加</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import validator from '@/utils/validator'
export default {
    name: 'discover-node',
    data(){
        return {
            addData: {
                ipaddr: '',
                macaddr: '',
                model: '',
                class: '',
                groupname: '',
                name: ''
            },
            rules: {
                devname: [
                    { validator: validator.validatorDevName, trigger: 'blur' }
                ],
                mac: [
                    { validator: validator.validatorMac, trigger: 'blur' }
                ],
                ipaddr: [
                    { validator: validator.validatorIpAddr, trigger: 'blur' }
                ],
                groupname: [
                    { validator: validator.validatorGroupName, trigger: 'blur' }
                ],
                class: [
                    { validator: validator.validatorClass, trigger: 'blur' }
                ],
                model: [
                    { validator: validator.validatorModel, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // to do
                    alert('submit success');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>

</style>
