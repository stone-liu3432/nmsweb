<template>
    <div slot="label">
        <el-row>
            <el-col :span="8">
                <span class="user-mgmt-title">用户列表</span>
            </el-col>
            <el-col :offset="8" :span="8" class="user-cfg">
                <el-button size="small" type="primary" @click="addUser">添加用户</el-button>
                <el-button size="small" type="danger" @click="delUserBatch">删除选中用户</el-button>
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
                        <el-form-item :label="lanMap['username']">
                            <span>{{ props.row.username }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['role']">
                            <span>{{ props.row.role }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['label']">
                            <span>{{ props.row.label }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['phone']">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['status']">
                            <span>{{ props.row.status }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['timestamp']">
                            <span>{{ props.row.timestamp }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['desctiption']">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                        <el-form-item :label="lanMap['lastlogintime']">
                            <span>{{ props.row.lastlogintime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" :label="lanMap['username']"></el-table-column>
            <el-table-column prop="status" :label="lanMap['status']"></el-table-column>
            <el-table-column prop="description" :label="lanMap['description']"></el-table-column>
            <el-table-column :label="lanMap['config']">
                <template slot-scope="scope">
                    <el-button @click="delUser(scope.row)" type="text" size="small">{{ lanMap['delete'] }}</el-button>
                    <el-button @click="modifyUser(scope.row)" type="text" size="small">修改用户信息</el-button>
                    <el-button @click="modifyPass(scope.row)" type="text" size="small">修改密码</el-button>
                </template>
            </el-table-column>
            <div slot="empty">{{ lanMap['empty'] }}</div>
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
        <el-dialog title="增加用户" :visible.sync="userCfgModal" center :before-close="clearData">
            <el-form
                :model="form"
                :rules="rules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'add'"
            >
                <el-form-item :label="lanMap['username']" prop="name">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['password']" prop="pass1">
                    <el-input v-model="form.pass1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['re_enter_pass']" prop="pass2">
                    <el-input v-model="form.pass2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['role']" prop="role">
                    <el-input v-model="form.role"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['label']" prop="label">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['phone']" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['description']" prop="description">
                    <el-input v-model="form.description" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                :model="form"
                :rules="rules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'modifyInfo'"
            >
                <el-form-item :label="lanMap['username']" prop="name">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['label']" prop="label">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['phone']" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['description']" prop="description">
                    <el-input v-model="form.description" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                :model="form"
                :rules="rules"
                label-width="120px"
                ref="userInfo"
                v-if="modalType === 'modifyPass'"
            >
                <el-form-item :label="lanMap['username']" prop="name">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['old_pass']" prop="pass">
                    <el-input v-model="form.pass"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['new_pass']" prop="pass1">
                    <el-input v-model="form.pass1"></el-input>
                </el-form-item>
                <el-form-item :label="lanMap['re_enter_pass']" prop="pass2">
                    <el-input v-model="form.pass2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal">{{ lanMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm('userInfo')">{{ lanMap['apply'] }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
export default {
    name: "userMgmt",
    computed: mapState(["lanMap"]),
    data() {
        return {
            user: [],
            userInfo: [
                {
                    username: "100",
                    role: "admin",
                    label: "123",
                    status: 1,
                    phone: "+86 1234567890",
                    description: "123",
                    timestamp: "2019/04/01 12:12:12",
                    lastlogintime: "2019/04/01 12:12:12"
                }
            ],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            multipleSelection: [],
            userCfgModal: false,
            modalType: "",
            form: {
                pass: "",
                username: "",
                pass1: "",
                pass2: "",
                role: "",
                label: "",
                phone: "",
                description: ""
            },
            rules: {}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http
                .get("/api/server/user")
                .then(res => {
                    if (res.data.code === 1) {
                        this.user = res.data.data;
                        this.currentPage = 1;
                        if(this.user && this.user.length){
                            if(this.user.length > this.pageSize){
                                this.userInfo = this.user.slice(0, this.pageSize);
                            }else{
                                this.userInfo = this.user;
                            }
                        }else{
                            this.user = [];
                            this.userInfo = [];
                        }
                    } else {
                        this.user = [];
                        this.userInfo = [];
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
                    type: "info",
                    message: "未选中任何用户"
                });
                return;
            }
            console.log("del batch");
        },
        delUser(user) {
            this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                this.lanMap["tips"],
                {
                    confirmButtonText: this.lanMap["apply"],
                    cancelButtonText: this.lanMap["cancel"],
                    type: "warning",
                    center: true
                }
            )
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
                            } else {
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
            if(start + this.pageSize > this.user.length){
                this.userInfo = this.user.slice(start);
            }else{
                this.userInfo = this.user.slice(start, this.pageSize);
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log("submit!");
                    //  to do
                    this.closeModal();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        closeModal() {
            this.userCfgModal = false;
            this.modalType = "";
            Object.keys(this.form).forEach(item => {
                this.form[item] = "";
            });
        },
        clearData(done) {
            Object.keys(this.form).forEach(item => {
                this.form[item] = "";
            });
            done();
        }
    }
};
</script>

<style lang="less" scoped>
.user-mgmt-title {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    margin: 0 0 0 20px;
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
