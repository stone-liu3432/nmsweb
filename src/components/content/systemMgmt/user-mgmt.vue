<template>
    <div slot="label">
        <el-row>
            <el-col :span="8">
                <span class="user-mgmt-title">{{ langMap['user_mgmt'] }}</span>
            </el-col>
            <el-col :offset="8" :span="8" class="user-cfg">
                <el-button size="small" type="primary" @click="addUser">{{ langMap['add_user'] }}</el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="delUserBatch"
                >{{ langMap['del_select_user'] }}</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="userInfo"
            border
            stripe
            style="margin-top: 20px;"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item :label="langMap['username']">
                            <span>{{ props.row.username }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['rolename']">
                            <span>{{ props.row.rolename }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['label']">
                            <span>{{ props.row.label }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['phone']">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['status']">
                            <span>{{ props.row.status ? langMap['online'] : langMap['offline'] }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['timestamp']">
                            <span>{{ props.row.timestamp }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['description']">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                        <el-form-item :label="langMap['lastlogintime']">
                            <span>{{ props.row.lastlogintime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" :label="langMap['username']"></el-table-column>
            <el-table-column prop="status" :formatter="formatStatus" :label="langMap['status']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        @click="delUser(scope.row)"
                        type="text"
                        size="small"
                    >{{ langMap['delete'] }}</el-button>
                    <el-button
                        @click="modifyUser(scope.row)"
                        type="text"
                        size="small"
                    >{{ langMap['config'] }}</el-button>
                    <el-button
                        @click="modifyPass(scope.row)"
                        type="text"
                        size="small"
                    >{{ langMap['change_pwd'] }}</el-button>
                </template>
            </el-table-column>
            <div slot="empty">{{ langMap['empty'] }}</div>
        </el-table>
        <el-pagination
            style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="user.length"
            v-if="user.length > pageSize"
        ></el-pagination>
        <el-dialog :title="title" :visible.sync="userCfgModal" @closed="clearData">
            <el-form
                :model="form"
                :rules="addRules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'add'"
                key="addUser"
            >
                <el-form-item :label="langMap['username']" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['password']" prop="pass1">
                    <el-input v-model="form.pass1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['re_enter_pass']" prop="pass2">
                    <el-input v-model="form.pass2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['rolename']" prop="role">
                    <el-select v-model="form.rolename">
                        <el-option :value="item" v-for="(item, index) in roles" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['label']" prop="label">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['phone']" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['description']" prop="description">
                    <el-input v-model="form.description" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                :model="form"
                :rules="modifyInfoRules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'modifyInfo'"
                key="modifyUserInfo"
            >
                <el-form-item :label="langMap['username']" prop="name">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="langMap['label']" prop="label">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['phone']" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['description']" prop="description">
                    <el-input v-model="form.description" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                :model="form"
                :rules="modifyPassRules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'modifyPass'"
                key="modifyPassword"
            >
                <el-form-item :label="langMap['username']" prop="name">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="langMap['old_pass']" prop="pass">
                    <el-input type="password" v-model="form.pass"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['new_pass']" prop="pass1">
                    <el-input type="password" v-model="form.pass1"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['re_enter_pass']" prop="pass2">
                    <el-input type="password" v-model="form.pass2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeModal">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm('userInfo')">{{ langMap['apply'] }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { pageSizes } from "@/utils/common-data";
import validator from "@/utils/validator";
import md5 from "md5";
export default {
    name: "userMgmt",
    computed: {
        ...mapState(["langMap"]),
        title() {
            return this.modalType === "add"
                ? this.langMap["add_user"]
                : this.modalType === "modifyInfo"
                ? this.langMap["modify_user_info"]
                : this.modalType === "modifyPass"
                ? this.langMap["change_pwd"]
                : "";
        }
    },
    data() {
        var validatorPhone = (rule, value, callback) => {
            var reg = /^[\d\+\-]{5,24}$/;
            if (!reg.test(value)) {
                return callback(new Error(this.langMap["validatorPhone"]));
            }
            callback();
        };
        return {
            user: [],
            userInfo: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            multipleSelection: [],
            userCfgModal: false,
            modalType: "",
            roles: [],
            form: {
                pass: "",
                username: "",
                pass1: "",
                pass2: "",
                rolename: "",
                label: "",
                phone: "",
                description: ""
            },
            addRules: {
                username: [
                    {
                        validator: validator.validatorName,
                        trigger: ["change", "blur"]
                    }
                ],
                pass1: [
                    {
                        validator: validator.validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pass2: [
                    {
                        validator: this.validEnterPass,
                        trigger: ["change", "blur"]
                    }
                ],
                label: [
                    {
                        validator: this.validLabel,
                        trigger: ["change", "blur"]
                    }
                ],
                phone: [
                    { validator: this.validPhone, trigger: ["change", "blur"] }
                ],
                description: [
                    {
                        validator: this.validDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            modifyInfoRules: {
                label: [
                    {
                        validator: validator.validatorName,
                        trigger: ["change", "blur"]
                    }
                ],
                phone: [
                    { validator: validatorPhone, trigger: ["change", "blur"] }
                ],
                description: [
                    {
                        validator: validator.validatorDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            modifyPassRules: {
                pass: [
                    {
                        validator: validator.validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pass1: [
                    {
                        validator: validator.validatorPassword,
                        trigger: ["change", "blur"]
                    }
                ],
                pass2: [
                    {
                        validator: this.validEnterPass,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getData();
        this.getRoles();
    },
    methods: {
        getData() {
            this.$http
                .get("/api/server/user")
                .then(res => {
                    this.user = [];
                    this.userInfo = [];
                    if (res.data.code === 1) {
                        this.user = res.data.data;
                        this.currentPage = 1;
                        if (this.user && this.user.length) {
                            if (this.user.length > this.pageSize) {
                                this.userInfo = this.user.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.userInfo = this.user;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getRoles() {
            this.$http
                .get("/api/server/role")
                .then(res => {
                    this.roles = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.roles.push(item.rolename);
                            });
                            this.form.rolename = this.roles[0];
                        }
                    }
                })
                .catch(err => {});
        },
        addUser() {
            this.userCfgModal = true;
            this.modalType = "add";
        },
        delUserBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    type: "warning",
                    message: this.langMap["no_user_select"]
                });
                return;
            }
            var data = {
                method: "delete",
                param: []
            };
            this.multipleSelection.forEach(item => {
                data.param.push(item.username);
            });
            this.$http
                .post("/api/server/user?batch=true", data)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(
                            this.langMap[data.method + "_success"]
                        );
                        this.getData();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
        },
        delUser(user) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                type: "warning"
            })
                .then(() => {
                    var data = {
                        method: "delete",
                        param: {
                            username: user.username
                        }
                    };
                    this.$http
                        .post("/api/server/user", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(() => {});
        },
        modifyUser(data) {
            this.userCfgModal = true;
            this.modalType = "modifyInfo";
            Object.keys(data).forEach(item => {
                this.form[item] = data[item];
            });
        },
        modifyPass(data) {
            this.userCfgModal = true;
            this.modalType = "modifyPass";
            this.form.username = data.username;
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = (val - 1) * this.pageSize;
            if (start + this.pageSize > this.user.length) {
                this.userInfo = this.user.slice(start);
            } else {
                this.userInfo = this.user.slice(start, start + this.pageSize);
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.modalType === "add") {
                        data = {
                            method: "add",
                            param: {
                                username: this.form.username,
                                key: md5(
                                    `${this.form.username}:${this.form.pass1}`
                                ),
                                rolename: this.form.rolename,
                                label: this.form.label,
                                phone: this.form.phone,
                                description: this.form.description
                            }
                        };
                    }
                    if (this.modalType === "modifyInfo") {
                        data = {
                            method: "set",
                            param: {
                                username: this.form.username,
                                label: this.form.label,
                                phone: this.form.phone,
                                description: this.form.description
                            }
                        };
                    }
                    if (this.modalType === "modifyPass") {
                        data = {
                            method: "modify",
                            param: {
                                username: this.form.username,
                                key: md5(
                                    `${this.form.username}:${this.form.pass1}`
                                ),
                                key1: md5(
                                    `${this.form.username}:${this.form.pass}`
                                )
                            }
                        };
                    }
                    this.$http
                        .post("/api/server/user", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                if (
                                    this.form.username ===
                                    sessionStorage.getItem("user")
                                ) {
                                    sessionStorage.removeItem("user");
                                    sessionStorage.removeItem("x-token");
                                    this.$router.push("/login");
                                    return;
                                }
                                this.getData();
                                this.closeModal();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                } else {
                    return false;
                }
            });
        },
        closeModal() {
            this.userCfgModal = false;
        },
        formatStatus(row, column) {
            return row[column.property]
                ? this.langMap["online"]
                : this.langMap["offline"];
        },
        clearData() {
            Object.keys(this.form).forEach(item => {
                this.form[item] = "";
            });
            if (this.roles.length) {
                this.form.rolename = this.roles[0];
            }
            this.modalType = "";
        },
        validPhone(rule, value, callback) {
            var reg = /^.{6,24}$/;
            if (value !== "" && !reg.test(value)) {
                return callback(new Error(this.langMap["validatorPhone"]));
            }
            callback();
        },
        validLabel(rule, value, callback) {
            var reg = /^.{4,33}$/;
            if (value !== "" && !reg.test(value)) {
                return callback(new Error(this.langMap["validator_name_tips"]));
            }
            callback();
        },
        validDesc(rule, value, callback) {
            var reg = /^.{4,256}$/;
            if (value !== "" && !reg.test(value)) {
                return callback(new Error(this.langMap["validator_desc_tips"]));
            }
            callback();
        },
        validEnterPass(rule, value, callback) {
            var reg = /^.{4,33}$/;
            if (!reg.test(value)) {
                return callback(new Error(this.langMap["validator_pass_tips"]));
            }
            if (value !== this.form.pass1) {
                return callback(new Error(this.langMap["pwd_not_match"]));
            }
            callback();
        }
    }
};
</script>

<style lang="less" scoped>
.user-mgmt-title {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 1.17em;
    font-weight: bold;
}
.table-expand {
    font-size: 0;
}
.table-expand label {
    width: 90px;
    color: #99a9bf;
}
.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
}
</style>
