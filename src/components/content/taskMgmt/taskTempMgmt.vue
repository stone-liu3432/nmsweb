<template>
    <div slot="label">
        <el-collapse>
            <el-collapse-item :title="langMap['add_task_temp']">
                <el-form
                    label-width="100px"
                    size="small"
                    ref="addTaskTemp"
                    :rules="rules"
                    :model="taskData"
                    class="collapse-margin"
                >
                    <el-form-item :label="langMap['type']">
                        <el-select v-model="taskData.type">
                            <el-option v-for="(item, index) in taskType" :key="index" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="langMap['name']" prop="name">
                        <el-input v-model="taskData.name" style="width: 215px;"></el-input>
                    </el-form-item>
                    <el-form-item :label="langMap['upgradefile']">
                        <el-select v-model="taskData.upgradefile">
                            <el-option v-for="(item, index) in swName" :key="index" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="langMap['description']" prop="description">
                        <el-input
                            type="textarea"
                            v-model="taskData.description"
                            style="width: 500px;"
                        ></el-input>
                    </el-form-item>
                    <el-button
                        type="primary"
                        size="small"
                        style="width: 200px;margin-left: 100px;"
                        @click="addTaskType('addTaskTemp')"
                    >{{ langMap['add'] }}</el-button>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>{{ langMap['exist_task_temp_list'] }}</h3>
        <el-table :data="taskTable" border>
            <el-table-column prop="name" :label="langMap['name']"></el-table-column>
            <el-table-column prop="type" :label="langMap['type']"></el-table-column>
            <el-table-column prop="upgradefile" :label="langMap['upgradefile']"></el-table-column>
            <el-table-column prop="creater" :label="langMap['creater']"></el-table-column>
            <el-table-column prop="timestamp" :label="langMap['timestamp']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        @click="delTaskTemp(scope.row)"
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
            :total="taskTemp.data && taskTemp.data.length"
            v-if="taskTemp.data && taskTemp.data.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
import { validatorName, validatorDesc } from "@/utils/validator";
export default {
    name: "taskTempMgmt",
    computed: mapState(["langMap"]),
    data() {
        return {
            taskTemp: {},
            taskData: {
                name: "",
                type: "",
                upgradefile: '',
                description: ""
            },
            taskType: [],
            swName: [],
            taskTable: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            rules: {
                name: [
                    { validator: validatorName, trigger: ["change", "blur"] }
                ],
                description: [
                    { validator: validatorDesc, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getData();
        this.getType();
        this.getSw();
    },
    methods: {
        delTaskTemp(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning",
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    var _data = {
                        method: "delete",
                        param: {
                            name: data.name
                        }
                    };
                    this.$http
                        .post("/api/server/tasktemplate", _data)
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
            var start = val - 1;
            if (start + this.pageSize > this.taskTemp.data.length) {
                this.taskTable = this.taskTemp.data.slice(start);
            } else {
                this.taskTable = this.taskTemp.data.slice(start, start + this.pageSize);
            }
        },
        getData() {
            this.$http
                .get("/api/server/tasktemplate")
                .then(res => {
                    this.taskTemp = {};
                    this.taskTable = [];
                    if (res.data.code === 1) {
                        this.taskTemp = res.data;
                        this.currentPage = 1;
                        if (res.data.data && res.data.data.length) {
                            var data = res.data.data;
                            if (data.length > this.pageSize) {
                                this.taskTable = data.slice(0, this.pageSize);
                            } else {
                                this.taskTable = data;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getType() {
            this.$http
                .get("/api/server/tasktype")
                .then(res => {
                    this.taskType = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.taskType = res.data.data;
                            this.taskData.type = this.taskType[0];
                        }
                    }
                })
                .catch(err => {});
        },
        //  获取软件库列表
        getSw(){
            this.$http.get('/api/server/software').then(res =>{
                this.swName = [];
                if(res.data.code === 1){
                    if(res.data.data && res.data.data.length){
                        res.data.data.forEach(item =>{
                            this.swName.push(item.name);
                        })
                        this.taskData.upgradefile = this.swName[0];
                    }
                }
            }).catch(err =>{})
        },
        addTaskType(formName) {
            if (!this.taskType.length || !this.taskData.type) {
                return;
            }
            if(!this.swName.length || !this.taskData.upgradefile){
                return;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data = {
                        method: "add",
                        param: {
                            name: this.taskData.name,
                            type: this.taskData.type,
                            upgradefile: this.taskData.upgradefile,
                            description: this.taskData.description
                        }
                    };
                    this.$http.post('/api/server/tasktemplate', data).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success(this.langMap[data.method + '_success']);
                            this.getData();
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err =>{})
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
hr {
    margin: 16px 0;
}
</style>
