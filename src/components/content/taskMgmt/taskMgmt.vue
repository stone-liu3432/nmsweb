<template>
    <div slot="label">
        <el-collapse>
            <el-collapse-item :title="langMap['add_task']">
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
                            <el-form-item :label="langMap['taskname']" prop="taskname">
                                <el-input v-model="addTask.taskname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="langMap['mode']" prop="mode">
                                <el-select v-model="addTask.mode">
                                    <el-option value="manual" :label="langMap['manual_task']"></el-option>
                                    <el-option value="time" :label="langMap['time_task']"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="langMap['devicelist']" prop="devlist">
                        <el-transfer
                            v-model="addTask.devicelist"
                            :data="devlist"
                            style="border: 1px solid #ddd;"
                            :titles="['source', 'target']"
                            :props="{
                                key: 'ipaddr',
                                label: 'name'
                            }"
                        ></el-transfer>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="langMap['status']">
                                <el-switch v-model="addTask.status"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="langMap['concurrent']">
                                <el-switch v-model="addTask.concurrent"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="langMap['stime']" prop="stime">
                                <el-date-picker
                                    type="datetime"
                                    :placeholder="langMap['select_date']"
                                    v-model="addTask.stime"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="langMap['etime']" prop="etime">
                                <el-date-picker
                                    type="datetime"
                                    :placeholder="langMap['select_date']"
                                    v-model="addTask.etime"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="langMap['template']" prop="template">
                        <el-select v-model="addTask.template">
                            <el-option :value="item" v-for="(item, index) in taskTemp" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="langMap['description']" prop="description">
                        <el-input type="textarea" v-model="addTask.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="submitForm('addTask')"
                            style="width: 200px;"
                            :disabled="!taskTemp.length || !devlist.length"
                        >{{ langMap['add'] }}</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>{{ langMap['exist_task_list'] }}</h3>
        <el-table :data="taskTable" border style="margin-top: 20px;">
            <el-table-column prop="taskname" :label="langMap['taskname']"></el-table-column>
            <el-table-column prop="execstatus" :label="langMap['execstatus']" width="100"></el-table-column>
            <el-table-column
                prop="status"
                :formatter="formatStatus"
                :label="langMap['status']"
                width="80"
            ></el-table-column>
            <el-table-column prop="mode" :label="langMap['mode']" width="80"></el-table-column>
            <el-table-column prop="user" :label="langMap['user']"></el-table-column>
            <el-table-column prop="timestamp" :label="langMap['timestamp']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        @click="delTask(scope.row)"
                        type="text"
                        size="small"
                    >{{ langMap['delete'] }}</el-button>
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
            :total="task.data && task.data.length"
            v-if="task.data && task.data.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
import { validatorName, validatorDesc } from "@/utils/validator";
import store from '@/vuex/store'
const validsTime = (rule, value, callback) =>{
    if(!value){
        return callback(new Error(store.state.langMap['no_stime_tips']))
    }
    callback();
}
const valideTime = (rule, value, callback) =>{
    if(!value){
        return callback(new Error(store.state.langMap['no_etime_tips']))
    }
    callback();
}
const validDevList = (rule, value, callback) =>{
    if(!value){
        return callback(new Error(store.state.langMap['no_devlist_tips']))
    }
    callback();
}
const validTemp = (rule, value, callback) =>{
    if(!value){
        return callback(new Error(store.state.langMap['no_temp_tips']))
    }
    callback();
}
export default {
    name: "taskMgmt",
    computed: mapState(["langMap"]),
    data() {
        return {
            task: {},
            taskTable: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            devlist: [],
            taskTemp: [],
            addTask: {
                taskname: "",
                devicelist: [],
                status: true,
                template: "",
                mode: "manual",
                concurrent: true,
                stime: "",
                etime: "",
                description: ""
            },
            rules: {
                taskname: [{ validator: validatorName, trigger: ["blur", 'change'] }],
                description: [{ validator: validatorDesc, trigger: ["blur", 'change'] }],
                devlist: [{ validator: validDevList, trigger: 'blur' }],
                stime: [{ validator: validsTime, trigger: ['change', 'blur'] }],
                etime: [{ validator: valideTime, trigger: ['change', 'blur'] }],
                template: [{ validator: validTemp, trigger: ['change', 'blur'] }]
            }
        };
    },
    created() {
        this.getData();
        this.getTemp();
        this.getDev();
    },
    methods: {
        delTask(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning",
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
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
                                this.$message.success(
                                    this.langMap[_data.method + "_success"]
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
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.task.data.length) {
                this.taskTable = this.task.data.slice(start, start + this.pageSize);
            } else {
                this.taskTable = this.task.data.slice(start);
            }
        },
        formatStatus(row, col) {
            return row[col.property] ? "Enable" : "Disabled";
        },
        submitForm(formName) {
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
                            user: sessionStorage.getItem("user")
                        }
                    };
                    this.$http
                        .post("/api/server/task", data)
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
                } else {
                    return false;
                }
            });
        },
        getData() {
            this.$http
                .get("/api/server/task")
                .then(res => {
                    this.task = {};
                    this.taskTable = [];
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
                        }
                    }
                })
                .catch(err => {});
        },
        getTemp() {
            this.$http
                .get("/api/server/tasktemplate")
                .then(res => {
                    this.taskTemp = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.taskTemp.push(item.name);
                            });
                            this.addTask.template = this.taskTemp[0];
                        }
                    }
                })
                .catch(err => {});
        },
        getDev() {
            this.$http
                .get("/api/device/olt?type=list")
                .then(res => {
                    this.devlist = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.devlist = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>
