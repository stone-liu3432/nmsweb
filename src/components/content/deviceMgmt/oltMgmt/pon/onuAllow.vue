<template>
    <div>
        <port-nav @port-change="portChange">
            <template slot="title">{{ langMap['onu_allow'] }}</template>
        </port-nav>
        <el-table :data="onuTable" border stripe>
            <el-table-column :formatter="formatName" :label="langMap['onu_id']"></el-table-column>
            <el-table-column prop="macaddr" :label="langMap['macaddr']"></el-table-column>
            <el-table-column prop="status" :label="langMap['status']">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status.toLowerCase() === 'online' ? '' : 'danger'"
                    >{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="auth_state" :label="langMap['auth_state']">
                <template slot-scope="scope">
                    <span>{{ scope.row.auth_state ? 'true' : 'false' }}</span>
                    <i
                        :class="[ scope.row.auth_state ? 'authenticate' : 'unauthenticate' ]"
                        @click="changeAuthState(scope.row)"
                    ></i>
                </template>
            </el-table-column>
            <el-table-column prop="register_time" :label="langMap['register_time']"></el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-button type="text" @click="dialogVisible = true">{{ langMap['add'] }}ONU</el-button>
                </template>
                <template slot-scope="scope">
                    <i
                        class="el-icon-delete"
                        style="font-size: 22px;"
                        :title="langMap['del_onu']"
                        @click="delOnu(scope.row)"
                    ></i>
                    <i
                        class="el-icon-circle-close"
                        style="font-size: 22px;"
                        :title="langMap['add_to_deny']"
                        @click="addToDeny(scope.row)"
                    ></i>
                    <i
                        class="el-icon-refresh"
                        style="font-size: 22px;"
                        :title="langMap['reboot_onu']"
                        @click="rebootOnu(scope.row)"
                    ></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="onuList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['config'] }}</span>
            <el-form
                :model="addForm"
                :rules="formRules"
                label-width="140px"
                ref="onu-allow-add-form"
            >
                <el-form-item prop="onu_id" :label="langMap['onu_id']">
                    <el-input v-model.number="addForm.onu_id"></el-input>
                </el-form-item>
                <el-form-item prop="macaddr" :label="langMap['macaddr']">
                    <el-input v-model="addForm.macaddr"></el-input>
                </el-form-item>
                <el-form-item prop="auth_state" :label="langMap['auth_state']">
                    <el-select v-model.number="addForm.auth_state">
                        <el-option :value="0" label="false"></el-option>
                        <el-option :value="1" label="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="desc" :label="langMap['desc']">
                    <el-input v-model="addForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('onu-allow-add-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorMac, validatorDesc } from "@/utils/validator";
export default {
    name: "onuAllow",
    computed: {
        ...mapState(["langMap", "dev_ip"])
    },
    data() {
        return {
            port_id: 1,
            onuList: [],
            onuTable: [],
            currentPage: 1,
            pageSize: 20,
            dialogVisible: false,
            addForm: {
                onu_id: "",
                macaddr: "",
                auth_state: 0,
                desc: ""
            },
            formRules: {
                onu_id: [
                    { validator: this.validOnuid, trigger: ["change", "blur"] }
                ],
                macaddr: [
                    { validator: validatorMac, trigger: ["change", "blur"] }
                ],
                desc: [
                    { validator: validatorDesc, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
            this.getData(port_id);
        },
        getData(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onu_allow_list",
                    params: { port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.onuList = [];
                    this.onuTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.onuList = res.data.data;
                            if (
                                this.currentPage >
                                Math.ceil(this.onuList.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    this.onuList.length / this.pageSize
                                );
                            }
                            var start = this.pageSize * (this.currentPage - 1);
                            if (start + this.pageSize > this.onuList.length) {
                                this.onuTable = this.onuList.slice(start);
                            } else {
                                this.onuTable = this.onuList.slice(
                                    start,
                                    start + this.pageSize
                                );
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        currentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (this.currentPage - 1);
            if (start + this.pageSize > this.onuList.length) {
                this.onuTable = this.onuList.slice(start);
            } else {
                this.onuTable = this.onuList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        formatName(row, col) {
            return (
                row.onu_name ||
                `ONU${row.port_id < 10 ? "0" + row.port_id : row.port_id}/${
                    row.onu_id < 10 ? "0" + row.onu_id : row.onu_id
                }`
            );
        },
        delOnu(node) {
            this.$confirm(this.langMap["del_onu"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_allow_list"
                        }),
                        method: "delete",
                        param: {
                            port_id: node.port_id,
                            onu_id: node.onu_id,
                            macaddr: node.macaddr
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getData(node.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        addToDeny(node) {
            this.$confirm(this.langMap["add_to_deny"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_allow_list"
                        }),
                        method: "reject",
                        param: {
                            port_id: node.port_id,
                            onu_id: node.onu_id,
                            macaddr: node.macaddr
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData(node.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        rebootOnu(node) {
            this.$confirm(this.langMap["reboot_onu"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: { form: "config" }
                        }),
                        method: "set",
                        param: {
                            port_id: node.port_id,
                            onu_id: node.onu_id,
                            flags: 1,
                            fec_mode: 1
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData(node.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        validOnuid(rule, value, cb) {
            value === "" && (this.addForm.onu_id = 0);
            if (value < 0 || value > 64 || isNaN(value)) {
                return cb(new Error("Range: 0 - 64"));
            }
            cb();
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_allow_list"
                        }),
                        method: "add",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.addForm.onu_id,
                            macaddr: this.addForm.macaddr,
                            auth_state: this.addForm.auth_state,
                            onu_type: "",
                            onu_desc: this.addForm.desc
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["add_success"]
                                );
                                this.getData(this.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        closeDialog() {
            this.$refs["onu-allow-add-form"].resetFields();
        },
        changeAuthState(row) {
            this.$confirm(
                row.auth_state
                    ? this.langMap["tips_unauth_state"]
                    : this.langMap["tips_auth_state"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_allow_list"
                        }),
                        method: "set",
                        param: {
                            port_id: row.port_id,
                            onu_id: row.onu_id,
                            macaddr: row.macaddr,
                            auth_state: Number(!row.auth_state),
                            onu_type: '',
                            onu_desc: ''
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData(this.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
i {
    cursor: pointer;
}
i + i {
    margin-left: 12px;
}
i.unauthenticate {
    margin-left: 10px;
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url("../../../../../../static/unauthstatus-normal.png")
        no-repeat 0 -2px;
    vertical-align: middle;
}
i.authenticate {
    margin-left: 10px;
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url("../../../../../../static/authstatus-hover.png") no-repeat 0 -2px;
    vertical-align: middle;
}
</style>

