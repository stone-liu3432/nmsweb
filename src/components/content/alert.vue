<template>
    <div>
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
export default {
    name: "alert",
    data() {
        return {
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

        }
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
        }
    },
};
</script>

<style lang="less" scoped>
</style>
