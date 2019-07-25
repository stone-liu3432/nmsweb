<template>
    <div>
        <h3>
            {{ langMap['alarm'] }}
            <!-- <dbc-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="getData"
                :interval="1000"
            >{{ langMap['refresh'] }}</dbc-button> -->
        </h3>
        <ul>
            <li v-for="(item,index) in alarmTable" :key="index" style="padding: 6px 0;">{{ item }}</li>
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
        ...mapState(["langMap", "dev_ip", 'timestamp']),
        alarmTable() {
            let data;
            let start = this.pageSize * (this.currentPage - 1);
            if (start + this.pageSize > this.alarm.length) {
                data = this.alarm.slice(start);
            } else {
                data = this.alarm.slice(start, start + this.pageSize);
            }
            return data;
        }
    },
    data() {
        return {
            alarm: [],
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
                    this.alarm = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            if (
                                this.currentPage >
                                Math.ceil(res.data.data.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    res.data.data.length / this.pageSize
                                );
                            }
                            this.alarm = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        }
    },
    watch: {
        timestamp(){
            this.getData();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
