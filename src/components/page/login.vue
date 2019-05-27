<template>
    <div id="login">
        <div>
            <h1 style="margin: 10px;">{{ langMap['login'] }}</h1>
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
            >
                <el-form-item prop="uname" :label="langMap['username']">
                    <el-input v-model.number="ruleForm.uname" :placeholder="langMap['username']"></el-input>
                </el-form-item>
                <el-form-item prop="pass" :label="langMap['password']">
                    <el-input
                        type="password"
                        v-model="ruleForm.pass"
                        auto-complete="off"
                        :placeholder="langMap['password']"
                        @keydown.native.enter="submitForm('ruleForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="langMap['language']">
                    <el-radio v-model="ruleForm.lang" label="zh">简体中文</el-radio>
                    <el-radio v-model="ruleForm.lang" label="en">English</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm('ruleForm')"
                        style="width: 100%;"
                    >{{ langMap['login'] }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorName, validatorPassword } from "@/utils/validator";
import md5 from "md5";
export default {
    name: "login",
    computed: mapState(["language", "langMap"]),
    data() {
        return {
            ruleForm: {
                pass: "",
                uname: "",
                lang: ''
            },
            rules: {
                pass: [{ validator: validatorPassword, trigger: "change" }],
                uname: [{ validator: validatorName, trigger: "change" }]
            }
        };
    },
    created() {
        this.ruleForm.lang = sessionStorage.getItem('lang') || 'en';
    },
    methods: {
        ...mapMutations({
            changeLang: "changeLang"
        }),
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        method: "login",
                        param: {
                            username: this.ruleForm.uname,
                            key: md5(
                                this.ruleForm.uname + ":" + this.ruleForm.pass
                            )
                        }
                    };
                    this.$http
                        .post("/login", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success("login success");
                                sessionStorage.setItem('user', this.ruleForm.uname);
                                sessionStorage.setItem('x-token', res.headers['x-token']);
                                this.$router.push("/main");
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                } else {
                    //  error
                    return false;
                }
            });
        }
    },
    watch: {
        'ruleForm.lang'(){
            sessionStorage.setItem('lang', this.ruleForm.lang);
            this.changeLang(this.ruleForm.lang);
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
        transform: translate(-50%, -50%);
        padding: 20px;
        border: 1px solid #ddd;
    }
}
</style>
