<template>
    <div slot="label">
        <el-collapse>
            <el-collapse-item title="搜索日志">
                <el-form inline size="small" :model="logSearch" :rules="rules" ref="logSearch">
                    <el-form-item label="ip address" label-width="120px" prop="ipaddr">
                        <el-input v-model="logSearch.ipaddr" placeholder="ip address"></el-input>
                    </el-form-item>
                    <el-form-item label="时间范围" label-width="120px" prop="ipaddr">
                        <el-date-picker v-model="logSearch.stime" type="datetime" placeholder="开始时间"></el-date-picker>-
                        <el-date-picker v-model="logSearch.etime" type="datetime" placeholder="结束时间"></el-date-picker>
                        <el-button type="primary" @click="submitData" style="margin-left: 20px;">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <h3>日志详情</h3>
        <el-table :data="alertTable" border style="width: 100%; margin-top: 20px;">
            <el-table-column prop="alarm_id" label="ID" width="80"></el-table-column>
            <el-table-column prop="source" label="告警源"></el-table-column>
            <el-table-column prop="macaddr" label="MAC地址"></el-table-column>
            <el-table-column prop="type" label="类型" width="80"></el-table-column>
            <el-table-column prop="level" label="告警级别" width="80"></el-table-column>
            <el-table-column prop="location" label="位置信息"></el-table-column>
            <el-table-column prop="description" label="描述信息"></el-table-column>
            <el-table-column prop="timestamp" label="时间"></el-table-column>
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
import { validatorIpAddr } from '@/utils/validator'
export default {
    name: "log-search",
    data() {
        return {
            logSearch: {
                ipaddr: "",
                stime: "",
                etime: ""
            },
            rules: {
                ipaddr: [
                    { validator: validatorIpAddr, trigger: 'blur' }
                ]
            },
            alertTable: [
                {
                    alarm_id: 0x1001,
                    source: "192.168.100.171",
                    macaddr: "38:3a:21:20:01:01",
                    type: 1,
                    level: 2,
                    location: 65792,
                    description: "ONU LINK UP",
                    timestamp: "2019/01/01 09:09:09"
                }
            ],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
        };
    },
    methods: {
        submitData() {
            console.log(this.logSearch);
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

</style>
