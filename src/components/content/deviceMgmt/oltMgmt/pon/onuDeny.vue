<template>
    <div>
        <port-nav @port-change="portChange">
            <template slot="title">{{ langMap['onu_deny'] }}</template>
        </port-nav>
        <el-table :data="onuTable" border style="width: 100%" stripe>
            <el-table-column :formatter="formatName" :label="langMap['onu_id']" width="180"></el-table-column>
            <el-table-column prop="macaddr" :label="langMap['macaddr']" width="180"></el-table-column>
            <el-table-column prop="retry" :label="langMap['retry']"></el-table-column>
            <el-table-column fixed="right" width="100">
                <template slot="header" slot-scope="scope">
                    <el-button type="text" size="small" @click="dialogVisible = true;">{{ langMap['add'] }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        @click="delDeny(scope.row)"
                        type="text"
                        size="small"
                    >{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="pageCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="onulist.length"
            v-if="onulist.length > pageSize"
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" @close="dialogClose" append-to-body>
            <span slot="title">{{ langMap['add'] }}</span>
            <el-form label-width="120px" :model="addForm" ref="add-deny-form" :rules="addRules">
                <el-form-item :label="langMap['macaddr']" prop="macaddr">
                    <el-input v-model="addForm.macaddr"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['desc']" prop="description">
                    <el-input v-model="addForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm('add-deny-form')">{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorMac, validatorDesc } from "@/utils/validator";
export default {
    name: "onuDeny",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            port_id: 1,
            onulist: [],
            onuTable: [],
            currentPage: 1,
            pageSize: 20,
            dialogVisible: false,
            addForm: {
                macaddr: "",
                description: ""
            },
            addRules: {
                macaddr: [
                    { validator: validatorMac, trigger: ['change', 'blur'] }
                ],
                description: [
                    { validator: validatorDesc, trigger: ['change', 'blur'] }
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
                    url: "/onu_deny_list",
                    params: { port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.onulist = [];
                    this.onuTable = [];
                    if (res.data.data && res.data.data.length) {
                        this.onulist = res.data.data;
                        if (this.pageSize > res.data.data.length) {
                            this.onuTable = this.onulist;
                        } else {
                            this.onuTable = this.onulist.slice(
                                0,
                                this.pageSize
                            );
                        }
                    }
                })
                .catch(err => {});
        },
        formatName(row, column) {
            return `ONU${row.port_id}/${
                row.onu_id < 10 ? "0" + row.onu_id : row.onu_id
            }`;
        },
        pageCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.onulist.length) {
                this.onuTable = this.onulist.slice(start);
            } else {
                this.onuTable = this.onulist.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        delDeny(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_deny_list"
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
        dialogClose() {
            this.$refs['add-deny-form'].resetFields();
        },
        submitForm(formName){
            this.$refs[formName].validate(valid =>{
                if(valid){
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_deny_list"
                        }),
                        method: "add",
                        param: {
                            port_id: this.port_id,
                            macaddr: this.addForm.macaddr,
                            onu_desc: this.addForm.description
                        }
                    }).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success(this.langMap['add_success']);
                            this.getData(this.port_id);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err =>{})
                }
            })
        }
    }
};
</script>

<style lang="less" scoped>
</style>
