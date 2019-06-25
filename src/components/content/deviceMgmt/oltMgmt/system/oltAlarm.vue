<template>
    <div>
        <h3>
            {{ langMap['alarm'] }}
            <t-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="getData"
                :interval="1000"
            >{{ langMap['refresh'] }}</t-button>
        </h3>
        <ul>
            <li v-for="(item,index) in alarm" :key="index" style="padding: 6px 0;">{{ item }}</li>
        </ul>
        <el-pagination
            style="float: right;"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="alarm.length"
            v-if="alarm.length && alarm.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "Vuex";
export default {
    name: "oltAlarm",
    computed: {
        ...mapState(["langMap", "dev_ip"])
    },
    data() {
        return {
            alarm: "",
            alarmTable: [],
            currentPage: 1,
            pageSize: 50
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/alarm", params: { form: "info" } }),
                method: "get"
            })
                .then(res => {
                    this.alarm = "";
                    this.currentPage = 1;
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.alarm = res.data.data;
                            if (this.alarm.length > this.pageSize) {
                                this.alarmTable = this.alarm.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.alarmTable = this.alarm;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.alarm.length) {
                this.alarmTable = this.alarm.slice(start);
            } else {
                this.alarmTable = this.alarm.slice(
                    start,
                    start + this.pageSize
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
