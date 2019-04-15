<template>
    <div>
        <!-- 
            "protocol":"http",
            "sipaddr":"192.168.100.171",
            "eipaddr":"192.168.100.199",
            "ipmask":"255.255.255.0",
            "groupname":"group1",
            "snmpversion":"v2c",
            "snmpcommunity":"public",
            "httpport":80
         -->
        <el-form inline size="small" :model="networkData" :rules="rules" ref="networkData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="protocol" label-width="120px" prop="protocol">
                        <el-input v-model="networkData.protocol" placeholder="protocol"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="httpport" label-width="120px" prop="httpport">
                        <el-input v-model="networkData.httpport" placeholder="httpport"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="start ipaddr" label-width="120px" prop="sipaddr">
                        <el-input v-model="networkData.sipaddr" placeholder="start ip addr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="end ip addr" label-width="120px" prop="eipaddr">
                        <el-input v-model="networkData.eipaddr" placeholder="end ip address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="ip mask" label-width="120px" prop="ipmask">
                        <el-input v-model="networkData.ipmask" placeholder="ipmask"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="snmpversion" label-width="120px" prop="snmpversion">
                        <el-select v-model="networkData.snmpversion">
                            <el-option value="v2"></el-option>
                            <el-option value="v3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="snmpcommunity" label-width="120px" prop="snmpcommunity">
                        <el-input v-model="networkData.snmpcommunity" placeholder="snmpcommunity"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="group name" label-width="120px" prop="groupname">
                        <el-input v-model="networkData.groupname" placeholder="group name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item size="small">
                        <el-button type="primary" style="width: 200px;" @click="submitForm('networkData')">添加</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import validator from '@/utils/validator'
export default {
    name: 'discover-network',
    data(){
        return {
            networkData: {
                sipaddr: '',
                eipaddr: '',
                groupname: '',
                snmpversion: '',
                snmpcommunity: '',
                httpport: '',
                protocol: '',
                ipmask: '',
            },
            rules: {
                sipaddr: [
                    { validator: validator.validatorIpAddr, trigger: 'blur' }
                ],
                eipaddr: [
                    { validator: validator.validatorIpAddr, trigger: 'blur' }
                ],
                groupname: [
                    { validator: validator.validatorGroupName, trigger: 'blur' }
                ],
                snmpcommunity: [
                    { validator: validator.validatorCommunity, trigger: 'blur' }
                ],
                ipmask: [
                    { validator: validator.validatorIpMask, trigger: 'blur' }
                ],
                httpport: [
                    { validator: validator.validatorPort, trigger: 'blur' }
                ],
                protocol: [
                    { validator: validator.validatorProtocol, trigger: 'blur' }
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
