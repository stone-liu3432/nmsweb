<template>
    <div id="login">
        <div>
            <h1 style="margin: 10px;">{{ lanMap['login'] }}</h1>
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                :status-icon="true"
            >
                <el-form-item prop="uname" label="user">
                    <el-input v-model.number="ruleForm.uname" placeholder="user name"></el-input>
                </el-form-item>
                <el-form-item prop="pass" label="password">
                    <el-input
                        type="password"
                        v-model="ruleForm.pass"
                        auto-complete="off"
                        placeholder="password"
                        @keydown.native.enter="submitForm('ruleForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm('ruleForm')"
                        style="width: 100%;"
                    >{{ lanMap['login'] }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { validatorName, validatorPassword } from "@/utils/validator";
import md5 from "md5";
export default {
    name: "login",
    computed: mapState(["language", "lanMap"]),
    data() {
        return {
            ruleForm: {
                pass: "",
                uname: ""
            },
            rules: {
                pass: [{ validator: validatorPassword, trigger: "blur" }],
                uname: [{ validator: validatorName, trigger: "blur" }]
            }
        };
    },
    created() {},
    methods: {
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
