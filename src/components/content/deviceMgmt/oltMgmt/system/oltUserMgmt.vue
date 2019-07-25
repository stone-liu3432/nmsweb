<template>
    <div>
        <h3>{{ langMap['user_mgmt'] }}</h3>
        <h3>
            {{ langMap['current_user_list'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 48px;"
                @click="openDialog(null, 'add')"
            >{{ langMap['add'] }}</el-button>
        </h3>
        <el-table :data="userlist" border style="width: 100%">
            <el-table-column prop="name" :label="langMap['user_name']"></el-table-column>
            <el-table-column
                prop="status"
                :formatter="formatStatus"
                :label="langMap['status']"
                width="80"
            ></el-table-column>
            <el-table-column
                prop="level"
                :formatter="formatLevel"
                :label="langMap['user_level']"
                width="120"
            ></el-table-column>
            <el-table-column prop="reenter" :label="langMap['user_reenter']"></el-table-column>
            <el-table-column prop="info" :label="langMap['info']"></el-table-column>
            <el-table-column :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog(scope.row, 'modify')"
                    >{{ langMap['change_pwd'] }}</el-button>
                    <el-button type="text" @click="deleteUser(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body @closed="closeModal">
            <span slot="title">
                <span v-if="dialogFlag === 'add'">{{ langMap['add'] }}</span>
                <span v-if="dialogFlag === 'modify'">{{ langMap['change_pwd'] }}</span>
            </span>
            <el-form
                label-width="140px"
                :model="userForm"
                :rules="addRules"
                ref="add-user-form"
                v-if="dialogFlag === 'add'"
            >
                <el-form-item :label="langMap['user_name']" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['password']" prop="pwd1">
                    <el-input v-model="userForm.pwd1" type="password"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['re_enter_pass']" prop="pwd2">
                    <el-input v-model="userForm.pwd2" type="password"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['user_level']" prop="level">
                    <el-select v-model="userForm.level">
                        <el-option
                            :value="index"
                            :label="item"
                            v-for="(item,index) in user_level"
                            v-if="index > 2"
                            :key="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['user_reenter']" prop="reenter">
                    <el-input v-model.number="userForm.reenter"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['info']" prop="info">
                    <el-input v-model="userForm.info"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                label-width="140px"
                :model="userForm"
                :rules="setRules"
                ref="set-user-form"
                v-if="dialogFlag === 'modify'"
            >
                <el-form-item :label="langMap['user_name']">
                    <span>{{ userForm.username }}</span>
                </el-form-item>
                <el-form-item :label="langMap['current_pwd']" prop="o_pwd">
                    <el-input v-model="userForm.o_pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['password']" prop="pwd1">
                    <el-input v-model="userForm.pwd1" type="password"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['re_enter_pass']" prop="pwd2">
                    <el-input v-model="userForm.pwd2" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'modify'"
                    @click="submitUserForm('set-user-form')"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'add'"
                    @click="submitUserForm('add-user-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { USER_LEVEL } from "@/utils/common-data";
import { validatorName, validatorPassword } from "@/utils/validator";
import md5 from "md5";
export default {
    name: "oltNameMgmt",
    computed: {
        ...mapState(["langMap", "dev_ip", 'timestamp'])
    },
    data() {
        return {
            user_level: USER_LEVEL,
            userlist: [],
            dialogVisible: false,
            dialogFlag: "",
            userForm: {
                username: "",
                o_pwd: "",
                pwd1: "",
                pwd2: "",
                level: 4,
                reenter: "",
                info: ""
            },
            addRules: {
                username: [
                    { validator: this.validUser, trigger: ["change", "blur"] }
                ],
                pwd1: [
                    {
                        validator: validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pwd2: [
                    { validator: this.validPass, trigger: ["change", "blur"] }
                ],
                reenter: [
                    {
                        validator: this.validReenter,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            setRules: {
                o_pwd: [
                    {
                        validator: validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pwd1: [
                    {
                        validator: validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pwd2: [
                    { validator: this.validPass, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/usermgmt",
                    params: { form: "userlist" }
                }),
                method: "get"
            })
                .then(res => {
                    this.userlist = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.userlist = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatStatus(row, column) {
            return row[column.property]
                ? this.langMap["online"]
                : this.langMap["offline"];
        },
        formatLevel(row, column) {
            return USER_LEVEL[row[column.property]];
        },
        deleteUser(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/usermgmt",
                            params: { form: "userlist" }
                        }),
                        method: "delete",
                        param: {
                            name: node.name
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
            if (data) {
                this.userForm["username"] = data["name"];
            }
        },
        closeModal() {
            this.dialogFlag === "add" &&
                this.$refs["add-user-form"].resetFields();
            this.dialogFlag === "modify" &&
                this.$refs["set-user-form"].resetFields();
            this.dialogFlag = "";
        },
        submitUserForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.dialogFlag === "add") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/usermgmt",
                                params: { form: "userlist" }
                            }),
                            method: "add",
                            param: {
                                name: this.userForm.username,
                                key: md5(
                                    `${this.userForm.username}:${this.userForm.pwd1}`
                                ),
                                level: this.userForm.level,
                                reenter: this.userForm.reenter,
                                info:
                                    this.userForm.info.length > 33
                                        ? this.userForm.info.substring(0, 33)
                                        : this.userForm.info
                            }
                        };
                    }
                    if (this.dialogFlag === "modify") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/usermgmt",
                                params: { form: "modifyps" }
                            }),
                            method: "set",
                            param: {
                                name: this.userForm.username,
                                key: md5(
                                    `${this.userForm.username}:${this.userForm.o_pwd}`
                                ), // 原密码  md5("uName:password")
                                key1: md5(
                                    `${this.userForm.username}:${this.userForm.pwd1}`
                                ) // 新密码
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[this.dialogFlag + "_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                    this.dialogVisible = false;
                }
            });
        },
        validPass(rule, value, callback) {
            var reg = /^.{4,33}$/;
            if (!reg.test(value)) {
                return callback(new Error(this.langMap["validator_pass_tips"]));
            }
            if (value !== this.userForm.pwd1) {
                return callback(new Error(this.langMap["pwd_not_match"]));
            }
            callback();
        },
        validReenter(rule, value, callback) {
            if (!value || value < 1 || value > 4 || isNaN(value)) {
                return callback(new Error(" 1 - 4 "));
            }
            callback();
        },
        //  添加一组特殊用户名排除
        validUser(rule, value, cb) {
            const exclude = ["manu", "devol", "root", "diag"];
            if(exclude.includes(value.toLowerCase())){
                return cb(new Error(this.langMap['illegal_username']));
            }
            return validatorName(rule, value, cb);
        }
    },
    watch: {
        timestamp(){
            this.getData();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
