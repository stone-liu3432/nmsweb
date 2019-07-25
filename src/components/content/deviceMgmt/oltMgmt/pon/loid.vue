<template>
    <div>
        <port-nav @port-change="portChange">
            <template slot="title">{{ langMap['loid_mgmt'] }}</template>
            <template slot="action">
                <dbc-button
                    style="margin-left: 20px;"
                    :interval="500"
                    @click="getData(port_id)"
                >{{ langMap['refresh'] }}</dbc-button>
            </template>
        </port-nav>
        <el-table :data="loidlist" border stripe>
            <el-table-column prop="loid" :label="langMap['loid']"></el-table-column>
            <el-table-column :formatter="formatUsed" :label="langMap['used']"></el-table-column>
            <el-table-column prop="password" :label="langMap['password']"></el-table-column>
            <el-table-column fixed="right" width="100">
                <template slot-scope="scope" slot="header">
                    <el-button type="text" @click="dialogVisible = true;">{{ langMap['add'] }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="delLoid(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" @close="dialogClose" append-to-body>
            <span slot="title">{{ langMap['add'] }}</span>
            <el-form label-width="120px" :model="addForm" ref="add-deny-form" :rules="addRules">
                <el-form-item :label="langMap['port_id']">
                    <span style="margin-left: 16px;">{{ port_name[port_id] }}</span>
                </el-form-item>
                <el-form-item :label="langMap['loid']" prop="loid">
                    <el-input v-model="addForm.loid"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['password']" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('add-deny-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "loidMgmt",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", "timestamp"])
    },
    data() {
        return {
            port_id: "",
            loidlist: [],
            dialogVisible: false,
            addForm: {
                loid: "",
                password: ""
            },
            addRules: {
                loid: [
                    { validator: this.validLoid, trigger: ["change", "blur"] }
                ],
                password: [
                    { validator: this.validPass, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.getData(port_id);
            this.port_id = port_id;
        },
        getData(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "loidlist", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.loidlist = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.loidlist = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        delLoid(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/ponmgmt",
                            params: { form: "loidlist" }
                        }),
                        method: "delete",
                        param: {
                            port_id: this.port_id,
                            loid: node.loid,
                            password: node.password
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getData(this.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        formatUsed(row, column) {
            return row.used ? row.mac : "False";
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/ponmgmt",
                            params: { form: "loidlist" }
                        }),
                        method: "add",
                        param: {
                            port_id: this.port_id,
                            loid: this.addForm.loid,
                            password: this.addForm.password
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
        dialogClose() {
            this.$refs["add-deny-form"].resetFields();
        },
        validLoid(rule, value, callback) {
            var reg = /^\w{1,24}$/;
            if (!reg.test(value)) {
                return callback(new Error("Range: 1-24 characters"));
            }
            callback();
        },
        validPass(rule, value, callback) {
            var reg = /^\w{0,12}$/;
            if (!reg.test(value)) {
                return callback(new Error("Range: 0-12 characters"));
            }
            callback();
        }
    },
    watch: {
        timestamp() {
            this.getData(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
