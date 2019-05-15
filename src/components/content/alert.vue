<template>
    <div>
        <el-table
            :data="alertTable"
            border
            style="width: 100%; margin-top: 20px;"
            :row-class-name="tableRowClassName"
        >
            <el-table-column
                prop="alarm_id"
                :formatter="formatHex"
                :label="langMap['alarm_id']"
                width="100"
            ></el-table-column>
            <el-table-column prop="source" :label="langMap['source']"></el-table-column>
            <el-table-column prop="macaddr" :label="langMap['macaddr']"></el-table-column>
            <el-table-column
                prop="type"
                :formatter="formatType"
                :label="langMap['type']"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="level"
                :formatter="formatLevel"
                :label="langMap['level']"
                width="80"
            ></el-table-column>
            <el-table-column prop="location" :label="langMap['location']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column prop="timestamp" :formatter="formatTime" :label="langMap['timestamp']"></el-table-column>
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
            :total="alert.length"
            v-if="alertTable.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
import { ALARM_TYPE, ALARM_LEVEL } from "@/utils/common-data";
import { formatDate } from "@/utils/common";
export default {
    name: "alert",
    computed: mapState(["langMap"]),
    data() {
        return {
            alert: [],
            alertTable: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes
        };
    },
    created() {
        this.getData();
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            var level = ALARM_LEVEL[row.level];
            return level ? `${level}-row` : '';
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            var pre = this.pageSize * (this.currentPage - 1);
            if (pre + this.pageSize > this.alert.length) {
                this.alertTable = this.alert.slice(pre);
            } else {
                this.alertTable = this.alert.slice(pre, this.pageSize);
            }
        },
        getData() {
            this.$http
                .get("/api/alarm")
                .then(res => {
                    if (res.data.code === 1) {
                        this.alert = res.data.data;
                        this.currentPage = 1;
                        if (this.alert && this.alert.length) {
                            if (this.alert.length > this.pageSize) {
                                this.alertTable = this.alert.slice(
                                    this.currentPage - 1,
                                    this.pageSize * this.currentPage
                                );
                            } else {
                                this.alertTable = this.alert;
                            }
                        }
                    } else {
                        this.alert = [];
                        this.alertTable = [];
                    }
                })
                .catch(err => {});
        },
        formatType(row, column) {
            return ALARM_TYPE[row[column.property]];
        },
        formatLevel(row, column) {
            return ALARM_LEVEL[row[column.property]];
        },
        formatTime(row, column) {
            return formatDate(Number(row[column.property]));
        },
        formatHex(row, column) {
            var id = row[column.property].toString(16);
            return `0x${id}`;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
