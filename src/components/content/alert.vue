<template>
    <div>
        <el-form :model="filterData" :rules="filterRules" inline size="small" label-width="100px">
            <el-form-item :label="langMap['show_type']">
                <el-select v-model="filterData.type">
                    <el-option :value="0" :label="langMap['all']"></el-option>
                    <el-option :value="1" :label="langMap['level']"></el-option>
                    <el-option :value="2" :label="langMap['alarm_id']"></el-option>
                    <el-option :value="3" :label="langMap['source']"></el-option>
                    <el-option :value="4" :label="langMap['macaddr']"></el-option>
                    <el-option :value="5" :label="langMap['location']"></el-option>
                    <el-option :value="6" :label="langMap['time_set']"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="filterData.type === 1">
                <el-form-item :label="langMap['level']">
                    <el-select v-model.number="filterData.level">
                        <template v-for="(item, index) in alertLevels">
                            <el-option :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="filterData.type === 2">
                <el-form-item :label="langMap['alarm_id']">
                    <el-input v-model="filterData.alarm_id"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterData.type === 3">
                <el-form-item :label="langMap['source']">
                    <el-input v-model="filterData.source"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterData.type === 4">
                <el-form-item :label="langMap['macaddr']">
                    <el-input v-model="filterData.macaddr"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterData.type === 5">
                <el-form-item :label="langMap['location']">
                    <el-input v-model="filterData.location"></el-input>
                </el-form-item>
            </template>
            <template v-if="filterData.type === 6">
                <el-form-item :label="langMap['time_set']">
                    <el-date-picker
                        v-model="filterData.time"
                        type="daterange"
                        :start-placeholder="langMap['stime']"
                        :end-placeholder="langMap['etime']"
                        :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        :editable='false'
                    ></el-date-picker>
                </el-form-item>
            </template>
            <el-form-item>
                <dbc-button style="margin-left: 30px;" @click="refreshData">{{ langMap['refresh'] }}</dbc-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="alarmData"
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
            :total="alarmCount"
            hide-on-single-page
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { pageSizes } from "@/utils/common-data";
import { ALARM_TYPE, ALARM_LEVEL } from "@/utils/common-data";
import { formatDate } from "@/utils/common";
export default {
    name: "alert",
    computed: {
        ...mapState(["langMap"]),
        alarmData() {
            //  ['all', 'level', 'alarm_id', 'source', 'macaddr', 'location']
            let data = this.alert;
            if (this.filterData.type) {
                if (this.filterData.type === 1) {
                    data = this.alert.filter(
                        item => item.level === this.filterData.level
                    );
                }
                if (this.filterData.type === 2) {
                    data = this.alert.filter(
                        item =>
                            ("0x" + item.alarm_id.toString(16)).indexOf(
                                this.filterData.alarm_id
                            ) > -1
                    );
                }
                if (this.filterData.type === 3) {
                    if (this.filterData.source) {
                        data = this.alert.filter(
                            item =>
                                item.source.indexOf(this.filterData.source) > -1
                        );
                    }
                }
                if (this.filterData.type === 4) {
                    if (this.filterData.macaddr) {
                        data = this.alert.filter(
                            item =>
                                item.macaddr.indexOf(this.filterData.macaddr) >
                                -1
                        );
                    }
                }
                if (this.filterData.type === 5) {
                    if (this.filterData.location) {
                        data = this.alert.filter(
                            item =>
                                item.location.indexOf(
                                    this.filterData.location
                                ) > -1
                        );
                    }
                }
            }
            this.alarmCount = data.length;
            var start = this.pageSize * (this.currentPage - 1);
            if (start + this.pageSize > data.length) {
                return data.slice(start);
            } else {
                return data.slice(start, start + this.pageSize);
            }
        }
    },
    data() {
        return {
            alert: [],
            currentPage: 1,
            pageSize: 20,
            pageSizes,
            filterData: {
                type: 0,
                level: 0,
                alarm_id: "",
                source: "",
                macaddr: "",
                location: "",
                time: ""
            },
            filterRules: {},
            alertLevels: ALARM_LEVEL,
            alarmCount: 0,
            //  限制选择范围为一个月，并且不能超过当前时间
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = "";
                    }
                },
                disabledDate: time => {
                    if (!this.choiceDate) {
                        const now = new Date();
                        return (
                            time.getTime() > (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59))
                        );
                    }
                    if (!!this.choiceDate) {
                        let one = 30 * 24 * 3600 * 1000;
                        let minTime = this.choiceDate - one;
                        let maxTime = this.choiceDate + one;
                        if (new Date(maxTime) > new Date().getTime()) {
                            maxTime = new Date().getTime();
                        }
                        return (
                            time.getTime() < minTime || time.getTime() > maxTime
                        );
                    }
                }
            },
            choiceDate: ""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            var level = ALARM_LEVEL[row.level];
            return level ? `${level}-row` : "";
        },
        handleSizeChange(val) {
            this.pageSize = val;
            if (
                this.currentPage > Math.ceil(this.alert.length / this.pageSize)
            ) {
                this.currentPage = Math.ceil(this.alert.length / this.pageSize);
            }
        },
        handleCurrentChange(val) {
            if (val > Math.ceil(this.alert.length / this.pageSize)) {
                val = Math.ceil(this.alert.length / this.pageSize);
            }
            this.currentPage = val;
        },
        getData() {
            this.$http
                .get("/api/alarm")
                .then(res => {
                    this.alert = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.alert = res.data.data;
                        }
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
            return formatDate(row[column.property] * 1000);
        },
        formatHex(row, column) {
            var id = row[column.property].toString(16);
            return `0x${id}`;
        },
        getTimeFrame() {
            var start = Math.floor(
                    new Date(this.filterData.time[0]).getTime() / 1000
                ),
                end = Math.floor(
                    new Date(this.filterData.time[1]).getTime() / 1000
                );
            if (end > Math.floor(new Date().getTime() / 1000)) {
                end = Math.floor(new Date().getTime() / 1000);
            }
            this.$http
                .get("/api/alarm", { params: { start, end } })
                .then(res => {
                    this.alert = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.alert = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        refreshData() {
            if (this.filterData.type === 6 && !!this.filterData.time) {
                return this.getTimeFrame();
            }
            this.getData();
        }
    },
    watch: {
        "filterData.type"(newVal, oldVal) {
            if (oldVal === 6) {
                this.getData();
            }
            this.filterData.level = 0;
            this.filterData.alarm_id = "";
            this.filterData.source = "";
            this.filterData.macaddr = "";
            this.filterData.location = "";
            this.filterData.time = "";
        },
        "filterData.time"() {
            if (this.filterData.time) {
                this.getTimeFrame();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
