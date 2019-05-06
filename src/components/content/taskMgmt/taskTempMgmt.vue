<template>
    <div slot="label">
        <el-collapse>
            <el-collapse-item title="添加任务模板">
                <el-form label-width="100px" size="small" :model="taskData" class="collapse-margin">
                    <el-form-item :label="lanMap['type']">
                        <el-select v-model="taskData.type">
                            <el-option v-for="(item, index) in taskType" :key="index" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="lanMap['name']">
                        <el-input v-model="taskData.name" style="width: 215px;"></el-input>
                    </el-form-item>
                    <!-- param -->
                    <el-form-item :label="lanMap['description']">
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
                        @click="addTaskType"
                    >{{ lanMap['add'] }}</el-button>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>已有任务模板列表</h3>
        <el-table :data="taskTable" border>
            <el-table-column prop="name" :label="lanMap['name']"></el-table-column>
            <el-table-column prop="type" :label="lanMap['type']"></el-table-column>
            <el-table-column prop="user" :label="lanMap['creater']"></el-table-column>
            <el-table-column prop="timestamp" :label="lanMap['timestamp']"></el-table-column>
            <el-table-column prop="description" :label="lanMap['description']"></el-table-column>
            <el-table-column :label="lanMap['config']">
                <template slot-scope="scope">
                    <el-button
                        @click="delTaskTemp(scope.row)"
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
            :total="taskTemp.data && taskTemp.data.length"
            v-if="taskTemp.data && taskTemp.data.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
export default {
    name: "taskTempMgmt",
    computed: mapState(["lanMap"]),
    data() {
        return {
            taskTemp: {},
            taskData: {
                name: "",
                type: "",
                description: ""
            },
            taskType: [
                "upgradefirmware",
                "upgradesystem",
                "upgradefullversion"
            ],
            taskTable: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes
        };
    },
    created() {
        this.getData();
        this.getType();
    },
    methods: {
        delTaskTemp(data) {
            this.$confirm("是否确认删除？", this.lanMap["tips"], {
                type: "warning",
                confirmButtonText: this.lanMap["apply"],
                cancelButtonText: this.lanMap["cancel"]
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
            var start = val - 1;
            if (start + this.pageSize > this.taskTemp.data.length) {
                this.taskTable = this.taskTemp.data.slice(start);
            } else {
                this.taskTable = this.taskTemp.data.slice(start, pageSize);
            }
        },
        getData() {
            this.$http
                .get("/api/server/tasktemplate")
                .then(res => {
                    if (res.data.code === 1) {
                        this.taskTemp = res.data;
                        this.currentPage = 1;
                        if (res.data.data && res.data.data.length) {
                            var data = res.data.data;
                            if (data.length > this.pageSize) {
                                this.taskTable = data.slice(0, pageSize);
                            } else {
                                this.taskTable = data;
                            }
                        } else {
                            this.taskTemp = {};
                            this.taskTable = [];
                        }
                    } else {
                        this.taskTemp = {};
                        this.taskTable = [];
                    }
                })
                .catch(err => {});
        },
        getType() {
            this.$http
                .get("/api/server/tasktype")
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.taskType = res.data.data;
                        } else {
                            this.taskType = [];
                        }
                    } else {
                        this.taskType = [];
                    }
                })
                .catch(err => {});
        },
        addTaskType() {}
    }
};
</script>

<style lang="less" scoped>
hr {
    margin: 16px 0;
}
</style>
