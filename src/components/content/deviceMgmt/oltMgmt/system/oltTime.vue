<template>
    <div>
        <h3>{{ langMap['time'] }}</h3>
        <el-row class="time-set-padding">
            <el-col :span="4">{{ langMap['current_time'] }}</el-col>
            <el-col :span="20">{{ currtTime }}</el-col>
        </el-row>
        <el-row class="time-set-padding">
            <el-col :span="4">{{ `${langMap['config']}${langMap['time_set']}` }}</el-col>
            <el-col :span="20">
                <el-radio v-model="set_time_type" :label="0">{{ langMap['ntp_gettime'] }}</el-radio>
                <el-radio v-model="set_time_type" :label="1">{{ langMap['manual_s'] }}</el-radio>
            </el-col>
        </el-row>
        <el-row class="time-set-padding" v-if="!!set_time_type">
            <el-col :span="4" style="height: 32px; line-height: 32px;">{{ langMap['time_set'] }}</el-col>
            <el-col :span="6">
                <el-date-picker size="small" v-model="set_time" type="datetime"></el-date-picker>
            </el-col>
        </el-row>
        <div v-else>
            <el-row class="time-set-padding">
                <el-col
                    :span="4"
                    style="height: 32px; line-height: 32px;"
                >{{ langMap['ntp_ipaddr1'] }}</el-col>
                <el-col :span="6">
                    <el-input size="small" v-model="preferred_ipaddr"></el-input>
                </el-col>
            </el-row>
            <el-row class="time-set-padding">
                <el-col
                    :span="4"
                    style="height: 32px; line-height: 32px;"
                >{{ langMap['ntp_ipaddr2'] }}</el-col>
                <el-col :span="6">
                    <el-input size="small" v-model="alternate_ipaddr"></el-input>
                </el-col>
            </el-row>
            <el-row class="time-set-padding">
                <el-col
                    :span="4"
                    style="height: 32px; line-height: 32px;"
                >{{ langMap['update_frequency'] }}</el-col>
                <el-col :span="6">
                    <el-input size="small" v-model.number="poll_interval_time"></el-input>
                </el-col>
            </el-row>
        </div>
        <el-row class="time-set-padding">
            <el-col :span="4" :offset="4">
                <el-button
                    size="small"
                    type="primary"
                    style="width: 160px;"
                    @click="submitTime"
                >{{ langMap['apply'] }}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { formatDate } from "@/utils/common";
import { mapState } from "Vuex";
export default {
    name: "oltTimeSet",
    computed: {
        ...mapState(["langMap", "dev_ip"]),
        currtTime() {
            return formatDate(this.current_time);
        }
    },
    data() {
        return {
            timeInfo: {},
            current_time: 0,
            interval: null,
            set_time_type: 1,
            set_time: "",
            ntpInfo: {},
            preferred_ipaddr: "",
            alternate_ipaddr: "",
            poll_interval_time: 0
        };
    },
    created() {
        this.getTime();
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/time", params: { form: "ntp" } }),
                method: "get"
            })
                .then(res => {
                    this.ntpInfo = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.ntpInfo = res.data.data;
                            this.set_time_type = this.ntpInfo.status;
                            if (res.data.data.ntp_srv_ip) {
                                this.preferred_ipaddr =
                                    res.data.data.ntp_srv_ip[0] || "";
                                this.alternate_ipaddr =
                                    res.data.data.ntp_srv_ip[1] || "";
                            }
                            this.poll_interval_time =
                                res.data.data.poll_interval_time;
                        }
                    }
                })
                .catch(err => {});
        },
        getTime() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/time", params: { form: "info" } }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.timeInfo = res.data.data;
                            var data = this.timeInfo.time_now;
                            data[1] -= 1;
                            this.current_time = new Date(...data).getTime();
                            this.set_time = this.current_time;
                            this.interval = setInterval(_ => {
                                this.current_time += 1000;
                            }, 1000);
                        }
                    }
                })
                .catch(err => {});
        },
        submitTime() {
            var data;
            if (this.set_time_type) {
                if(!this.set_time){
                    this.$message.error(`${this.langMap['param_error']}: ${this.langMap['time_set']}`);
                    return
                }
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({ url: "/time", params: { form: "info" } }),
                    method: "set",
                    param: {
                        time: [
                            this.set_time.getFullYear(),
                            this.set_time.getMonth() + 1,
                            this.set_time.getDate(),
                            this.set_time.getHours(),
                            this.set_time.getMinutes(),
                            this.set_time.getSeconds()
                        ],
                        time_zone: 1
                    }
                };
            } else {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({ url: "/time", params: { form: "ntp" } }),
                    method: "set",
                    param: {
                        status: 0,
                        ntp_srv_ip: [
                            this.preferred_ipaddr,
                            this.alternate_ipaddr
                        ],
                        poll_interval_time: this.poll_interval_time
                    }
                };
            }
            this.$devProxy(data)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.getTime();
                        this.getData();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .then(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
.time-set-padding {
    padding: 10px 0;
}
</style>
