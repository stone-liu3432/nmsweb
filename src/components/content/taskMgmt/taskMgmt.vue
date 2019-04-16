<template>
    <div slot="label">
        <!-- 
            "name":"EPON-OLT-E04",
            "devicelist":["192.168.100.171"],
            "status":true,
            "template":"tasktemplate1",
            "mode":"manual",
            "concurrent":true,
            "stime":"2019/01/01 01:01:01",
            "etime":"2019/01/02 01:01:01",
            "description":"new task",
            "user":"admin",
            "timestamp":"2019/01/02 01:01:01"
        -->
        <el-collapse>
            <el-collapse-item title="添加任务">
                <el-form
                    :model="addTask"
                    :rules="rules"
                    ref="addTask"
                    size="small"
                    label-width="150px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="任务名称" prop="name">
                                <el-input v-model="addTask.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="任务类型" prop="mode">
                                <el-select v-model="addTask.mode">
                                    <el-option value="manual"></el-option>
                                    <el-option value="time"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="设备列表" prop="devicelist">
                        <el-transfer v-model="addTask.devicelist" :data="devlist" style="border: 1px solid #ddd;"></el-transfer>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="status">
                                <el-switch v-model="addTask.status"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否立即执行" prop="concurrent">
                                <el-switch v-model="addTask.concurrent"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="start time" prop="stime">
                                <el-date-picker
                                    type="datetime"
                                    placeholder="选择日期"
                                    v-model="addTask.stime"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="end time" prop="etime">
                                <el-time-picker
                                    type="datetime"
                                    placeholder="选择时间"
                                    v-model="addTask.etime"
                                    style="width: 100%;"
                                ></el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="模板" prop="template">
                        <el-select v-model="addTask.template">
                            <el-option label="test" value="test"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述信息" prop="description">
                        <el-input type="textarea" v-model="addTask.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('addTask')" style="width: 200px;">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>已有任务列表</h3>
        <el-table :data="taskTable" border style="margin-top: 20px;">
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="execstatus" label="执行状态" width="100"></el-table-column>
            <el-table-column prop="status" :formatter="formatStatus" label="使能状态" width="80"></el-table-column>
            <el-table-column prop="mode" label="任务类型" width="80"></el-table-column>
            <el-table-column prop="user" label="创建者"></el-table-column>
            <el-table-column prop="timestamp" label="创建时间"></el-table-column>
            <el-table-column prop="description" label="描述信息"></el-table-column>
            <el-table-column label="配置">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty">empty</div>
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
import { pageSizes } from "@/utils/common-data";
import { validatorTaskName, validatorDesc } from '@/utils/validator'
export default {
    name: "taskMgmt",
    data() {
        return {
            taskTable: [
                {
                    name: "name1",
                    description: "for upgrade olt firmware",
                    status: true,
                    execstatus: "stoped",
                    mode: "manual",
                    user: "admin",
                    timestamp: "2019/01/01 09:09:09"
                }
            ],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            devlist: [],
            addTask: {
                name: "",
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
                name: [
                    { validator: validatorTaskName, trigger: 'blur' }
                ],
                stime: [
                    { validator: '', trigger: 'blur' }
                ],
                etime: [
                    { validator: '', trigger: 'blur' }
                ],
                description: [
                    { validator: validatorDesc, trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        handleClick(data) {
            console.log(data);
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {},
        formatStatus(row, col) {
            return row[col.property] ? "Enable" : "disabled";
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(this.addTask);
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
