<template>
    <div slot="label">
        <el-collapse>
            <el-collapse-item title="添加任务">
                <el-form
                    :model="addTask"
                    :rules="rules"
                    ref="addTask"
                    size="small"
                    label-width="150px"
                    class="collapse-margin"
                >
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['taskname']" prop="taskname">
                                <el-input v-model="addTask.taskname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['mode']">
                                <el-select v-model="addTask.mode">
                                    <el-option value="manual"></el-option>
                                    <el-option value="time"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="lanMap['devicelist']">
                        <el-transfer
                            v-model="addTask.devicelist"
                            :data="devlist"
                            style="border: 1px solid #ddd;"
                            :titles="['source', 'target']"
                        ></el-transfer>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['status']">
                                <el-switch v-model="addTask.status"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['concurrent']">
                                <el-switch v-model="addTask.concurrent"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['stime']">
                                <el-date-picker
                                    type="datetime"
                                    :placeholder="lanMap['select_date']"
                                    v-model="addTask.stime"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="lanMap['etime']">
                                <el-date-picker
                                    type="datetime"
                                    :placeholder="lanMap['select_date']"
                                    v-model="addTask.etime"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="lanMap['template']">
                        <el-select v-model="addTask.template">
                            <el-option label="test" value="test"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="lanMap['description']" prop="description">
                        <el-input type="textarea" v-model="addTask.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="submitForm('addTask')"
                            style="width: 200px;"
                        >{{ lanMap['add'] }}</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>已有任务列表</h3>
        <el-table :data="taskTable" border style="margin-top: 20px;">
            <el-table-column prop="taskname" :label="lanMap['taskname']"></el-table-column>
            <el-table-column prop="execstatus" :label="lanMap['execstatus']" width="100"></el-table-column>
            <el-table-column
                prop="status"
                :formatter="formatStatus"
                :label="lanMap['status']"
                width="80"
            ></el-table-column>
            <el-table-column prop="mode" :label="lanMap['mode']" width="80"></el-table-column>
            <el-table-column prop="user" :label="lanMap['user']"></el-table-column>
            <el-table-column prop="timestamp" :label="lanMap['timestamp']"></el-table-column>
            <el-table-column prop="description" :label="lanMap['description']"></el-table-column>
            <el-table-column :label="lanMap['config']">
                <template slot-scope="scope">
                    <el-button
                        @click="delTask(scope.row)"
                        type="text"
                        size="small"
                    >{{ lanMap['delete'] }}</el-button>
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
            :total="task.data && task.data.length"
            v-if="task.data && task.data.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
import { validatorName, validatorDesc } from "@/utils/validator";
export default {
    name: "taskMgmt",
    computed: mapState(["lanMap"]),
    data() {
        return {
            task: {},
            taskTable: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            devlist: [],
            addTask: {
                taskname: "",
                devicelist: [],
                status: true,
                template: "",
                mode: "",
                concurrent: true,
                stime: "",
                etime: "",
                description: ""
            },
            rules: {
                taskname: [{ validator: validatorName, trigger: "blur" }],
                description: [{ validator: validatorDesc, trigger: "blur" }]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        delTask(data) {
            this.$confirm("确认删除？", {
                type: "warning",
                confirmButtonText: this.lanMap["apply"],
                cancelButtonText: this.lanMap["cancel"]
            })
                .then(_ => {
                    var _data = {
                        method: "delete",
                        param: {
                            taskname: data.taskname
                        }
                    };
                    this.$http
                        .post("/api/server/task", _data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success("success");
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.task.data.length) {
                this.taskTable = this.task.data.slice(start, this.pageSize);
            } else {
                this.taskTable = this.task.data.slice(start);
            }
        },
        formatStatus(row, col) {
            return row[col.property] ? "Enable" : "Disabled";
        },
        submitForm(formName) {
            if (!this.addTask.devicelist.length) {
                this.$message.error("devicelist");
                return;
            }
            if (!this.addTask.template) {
                this.$message.error("template");
                return;
            }
            if (!this.addTask.mode) {
                this.$message.error("mode");
                return;
            }
            if (!this.addTask.stime) {
                this.$message.error("start time");
                return;
            }
            if (!this.addTask.etime) {
                this.$message.error("end time");
                return;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        method: "add",
                        param: {
                            name: this.addTask.taskname,
                            devicelist: this.addTask.devicelist,
                            status: this.addTask.status,
                            template: this.addTask.template,
                            mode: this.addTask.mode,
                            concurrent: this.addTask.concurrent,
                            stime: this.addTask.stime,
                            etime: this.addTask.etime,
                            description: this.addTask.description,
                            user: sessionStorage.getItem('user'),
                        }
                    };
                    this.$http.post('/api/server/task', data).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success(res.data.message);
                            this.getData();
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err =>{})
                } else {
                    return false;
                }
            });
        },
        getData() {
            this.$http
                .get("/api/server/task")
                .then(res => {
                    if (res.data.code === 1) {
                        this.task = res.data;
                        this.currentPage = 1;
                        if (this.task.data && this.task.data.length) {
                            if (this.task.data.length > this.pageSize) {
                                this.taskTable = this.task.data.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.taskTable = this.task.data;
                            }
                        } else {
                            this.task = {};
                            this.taskTable = [];
                        }
                    } else {
                        this.task = {};
                        this.taskTable = [];
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>
