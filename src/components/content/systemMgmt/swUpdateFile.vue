<template>
    <el-form :model="fData" :rules="rules" label-width="120px" ref="uploadFileForm">
        <el-form-item :label="langMap['name']" prop="name">
            <el-input v-model="fData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['label']" prop="label">
            <el-input v-model="fData.label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['select_file']">
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
</template>

<script>
import { mapState } from "vuex";
import { validatorName } from '@/utils/validator'
export default {
    name: 'swUpdateFile',
    computed: mapState(['langMap']),
    data(){
        return {
            fData: {
                name: '',
                label: '',
                file: ''
            },
            labelWidth: '100px',
            filename: '',
            rules: {
                name: [
                    { validator: validatorName, trigger: ['blur', 'change'] }
                ],
                label: [
                    { validator: validatorName, trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    created(){
        this.filename = this.langMap['select_file'];
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
            this.filename = this.langMap['select_file'];
        },
        validatorForm(){
            var flag = false;
            this.$refs['uploadFileForm'].validate(valid =>{
                flag = valid;
            })
            return flag;
        }
    }
}
</script>

<style lang="less" scoped>
</style>
