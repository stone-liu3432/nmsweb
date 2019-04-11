<template>
    <div id="login">
        <div>
            <h1 style="margin: 10px;">login</h1>
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm" 
                label-width="100px"
            >
                <el-form-item prop="uname" label="user">
                    <el-input v-model.number="ruleForm.uname"
                    placeholder="user name"></el-input>
                </el-form-item>
                <el-form-item prop="pass" label="password">
                    <el-input type="password" v-model="ruleForm.pass" auto-complete="off"
                    placeholder="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "login",
    data() {
        var checkName = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error("请输入用户名"));
            }
            if(!/^\w{4,16}$/.test(value)){
                return callback(new Error('用户名格式不正确'));
            }
            callback();
        };
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            }
            if(value.length < 4 || value.length > 32){
                return callback(new Error('密码格式不正确'));
            }
            callback();
        };
        return {
            ruleForm: {
                pass: "",
                uname: ""
            },
            rules: {
                pass: [{ validator: validatePass, trigger: "blur" }],
                uname: [{ validator: checkName, trigger: "blur" }]
            }
        };
    },
    created() {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // sucess  to do
                } else {
                    //  error
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
#login {
    height: 100%;
    min-width: 1280px;
    min-height: 768px;
    > div {
        width: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -100%);
        padding: 20px;
        border: 1px solid #ddd;
    }
}
</style>
