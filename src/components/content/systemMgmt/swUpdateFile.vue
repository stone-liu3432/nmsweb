<template>
    <div>
        <el-form :model="fData" :rules="rules">
            <el-form-item label="名称" :label-width="labelWidth" prop="name">
                <el-input v-model="fData.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="标签" :label-width="labelWidth">
                <el-input v-model="fData.label" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="上传文件" :label-width="labelWidth">
                <el-upload
                    ref="uploadSW"
                    style="display: inline-block;margin-left: 10px;"
                    :show-file-list="false"
                    action="placeholder"
                    :http-request="uploadFile"
                >
                    <el-button slot="trigger" size="small" type="primary">{{ filename }}</el-button>
                    <el-button size="small" type="danger" @click="resetForm">Reset</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { validatorName } from '@/utils/validator'
export default {
    name: 'swUpdateFile',
    data(){
        return {
            fData: {
                name: '',
                label: '',
                file: ''
            },
            labelWidth: '100px',
            filename: '选择文件',
            rules: {
                name: [
                    { validator: validatorName, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        uploadFile(item){
            var file = new FormData();
            file.append('file', item.file);
            this.fData.file = file;
            this.filename = item.file.name;
        },
        resetForm(){
            this.$refs.uploadSW.clearFiles();
            this.filename = '选择文件';
        }
    }
}
</script>

<style lang="less" scoped>
</style>
