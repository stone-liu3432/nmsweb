<template>
    <el-form :model="fData" :rules="rules" ref="addTypeForm" label-width="100px">
        <el-form-item :label="langMap['name']" prop="name">
            <el-input v-model="fData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['reason']" prop="reason">
            <el-input type="textarea" v-model="fData.reason" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState } from "Vuex";
import { validatorName, validatorDesc } from '@/utils/validator'
export default {
    name: 'addType',
    computed: mapState(['langMap']),
    data(){
        return {
            fData: {
                name: '',
                reason: ''
            },
            rules: {
                name: [
                    { validator: validatorName, trigger: ['change', 'blur'] }
                ],
                reason: [
                    { validator: validatorDesc, trigger: ['change', 'blur'] }
                ]
            }
        }
    },
    methods: {
        validatorForm(){
            var flag = false;
            this.$refs['addTypeForm'].validate(valid =>{
                flag = valid;
            })
            return flag;
        }
    }
}
</script>

<style lang="less" scoped>
</style>
