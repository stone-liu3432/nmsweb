<template>
    <el-form :model="fData" :rules="rules">
        <el-form-item label="名称" :label-width="labelWidth" prop="name">
            <el-input v-model="fData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签" :label-width="labelWidth">
            <el-input v-model="fData.reason" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { validatorName } from '@/utils/validator'
export default {
    name: 'addType',
    data(){
        return {
            fData: {
                name: '',
                reason: ''
            },
            labelWidth: '100px',
            rules: {
                name: [
                    { validator: validatorName, trigger: 'blur' }
                ]
            }
        }
    }
}
</script>

<style lang="less" scoped>
</style>
