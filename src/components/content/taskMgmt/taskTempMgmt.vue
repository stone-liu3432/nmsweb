<template>
    <div slot="label">
         <el-collapse>
            <el-collapse-item title="添加任务模板">
                <el-form label-width="100px" size="small" :model="taskData" class="collapse-margin">
                    <el-form-item label="类型">
                        <el-select v-model="taskData.type">
                            <el-option v-for="(item, index) in taskType" :key="index" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="taskData.name" style="width: 215px;"></el-input>
                    </el-form-item>
                    <!-- param -->
                    <el-form-item label="描述信息">
                        <el-input type="textarea" v-model="taskData.description" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-button type="primary" size="small" style="width: 200px;margin-left: 100px;">添加</el-button>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>已有任务模板列表</h3>
        <el-table :data="taskTable" border>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="user" label="创建者"></el-table-column>
            <el-table-column prop="timestamp" label="创建时间"></el-table-column>
            <el-table-column prop="description" label="描述信息"></el-table-column>
            <el-table-column label="配置">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty"> empty </div>
        </el-table>
        <el-pagination
            style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
        ></el-pagination>
    </div>
</template>

<script>
import { pageSizes } from '@/utils/common-data'
export default {
    name: "taskTempMgmt",
    data() {
        return {
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
            taskTable: [
                {
                    name: "template1",
                    type: "upgradefirmware",
                    user: "admin",
                    timestamp: "2019/04/04 09:09:09",
                    description: "for upgrade olt firmware"
                }
            ],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
        };
    },
    methods: {
        handleClick(data){
            console.log(data);
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
        }
    }
};
</script>

<style lang="less" scoped>
hr {
    margin: 16px 0;
}
</style>
