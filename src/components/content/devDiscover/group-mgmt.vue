<template>
    <div>
        <el-collapse v-model="activeName">
            <el-collapse-item :title="langMap['add']" name="add">
                <el-form
                    size="small"
                    :model="addGroup"
                    style="margin: 12px 0 0 12px;"
                    :rules="groupRules"
                    status-icon
                    ref="addGroup"
                >
                    <el-form-item :label="langMap['groupname']" prop="groupname">
                        <el-input v-model="addGroup.groupname" :placeholder="langMap['groupname']"></el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['description']" prop="description">
                        <el-input
                            type="textarea"
                            :rows="2"
                            v-model="addGroup.description"
                            :placeholder="langMap['description']"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            style="width: 220px;"
                            @click="submitAdd('addGroup')"
                        >{{ langMap['apply'] }}</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <el-table :data="showGroups" border style="width: 100%; margin-top: 20px;">
            <el-table-column prop="groupname" :label="langMap['name']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column prop="creater" :label="langMap['creater']"></el-table-column>
            <el-table-column prop="timestamp" :label="langMap['timestamp']"></el-table-column>
            <el-table-column fixed="right" :label="langMap['config']" width="120">
                <template slot-scope="scope">
                    <el-button @click="deleteGroup(scope.row)" type="text">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="groups.length"
            v-if="groups.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import validator from "@/utils/validator";
export default {
    name: "groupMgmt",
    computed: mapState(["langMap"]),
    data() {
        return {
            groups: [],
            showGroups: [],
            currentPage: 1,
            pageSize: 20,
            activeName: "",
            addGroup: {
                groupname: "",
                description: ""
            },
            groupRules: {
                groupname: [
                    {
                        validator: validator.validatorName,
                        trigger: ["change", "blur"]
                    }
                ],
                description: [
                    {
                        validator: validator.validatorDesc,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http
                .get("/api/device/group")
                .then(res => {
                    this.groups = [];
                    this.showGroups = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.groups = res.data.data;
                            this.currentPage = 1;
                            if (this.groups.length > this.pageSize) {
                                this.showGroups = this.groups.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.showGroups = this.groups;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.groups.length) {
                this.showGroups = this.groups.slice(start, start + this.pageSize);
            } else {
                this.showGroups = this.groups.slice(start);
            }
        },
        deleteGroup(val) {
            this.$confirm(
                this.langMap['cfm_del_tips'],
                this.langMap["tips"],
                {
                    confirmButtonText: this.langMap["apply"],
                    cancelButtonText: this.langMap["cancel"],
                    type: "warning"
                }
            )
                .then(_ => {
                    var data = {
                        method: "delete",
                        param: {
                            groupname: val.name
                        }
                    };
                    this.$http
                        .post("/api/device/group", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.langMap[data.method + '_success']);
                                this.getData();
                            } else {
                                this.$message.error(res.data.code.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        submitAdd(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        method: "add",
                        param: {
                            groupname: this.addGroup.groupname,
                            description: this.addGroup.description
                        }
                    };
                    this.$http
                        .post('/api/device/group', data)
                        .then(res => {
                            if(res.data.code === 1){
                                this.$message.success(this.langMap[data.method + '_success']);
                                this.addGroup.groupname = '';
                                this.addGroup.description = '';
                                this.activeName = '';
                                this.getData();
                            }else{
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                } else {
                    return false;
                }
            });
        }
    },
};
</script>

<style lang="less" scoped>
</style>
