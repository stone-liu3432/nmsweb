<template>
    <div>
        <h3>{{ langMap['pon_info'] }}</h3>
        <el-row :gutter="10" class="pon-status">
            <template v-for="(item,index) in ponInfo">
                <el-col :span="3" class="pon-show-detail">
                    <el-popover placement="bottom" trigger="hover" :key="'pon-info' + index">
                        <div class="pon-info-item">
                            <span>{{ langMap['registered_onu'] }}:</span>
                            <span>{{ item.online + item.offline }}</span>
                        </div>
                        <div class="pon-info-item">
                            <span>{{ langMap['online'] }}:</span>
                            <span>{{ item.online }}</span>
                        </div>
                        <div class="pon-info-item">
                            <span>{{ langMap['offline'] }}:</span>
                            <span>{{ item.offline }}</span>
                        </div>
                        <div slot="reference">
                            <img :src="generateSrc('pon', item)">
                            <div style="padding: 3px 0;">
                                <span>{{ port_name[item.port_id] }}</span>
                                <span>{{ item.status ? langMap['online'] : langMap['offline'] }}</span>
                            </div>
                        </div>
                    </el-popover>
                </el-col>
            </template>
        </el-row>
        <h3>{{ langMap['ge_port_info'] }}</h3>
        <el-row :gutter="10" class="pon-status">
            <template v-for="(item,index) in portInfo" v-if="index >= basicInfo.ponports">
                <el-col :span="3" class="pon-show-detail">
                    <el-popover
                        placement="bottom"
                        width="200"
                        trigger="hover"
                        :key="'ge-xge-info' + index"
                    >
                        <div class="pon-info-item">
                            <span>{{ langMap['admin_status'] }}:</span>
                            <span>{{ item.admin_status ? langMap['enable'] : langMap['disable'] }}</span>
                        </div>
                        <div class="pon-info-item">
                            <span>{{ langMap['link_status'] }}:</span>
                            <span>{{ item.link_status ? langMap['link_up'] : langMap['link_down'] }}</span>
                        </div>
                        <div slot="reference">
                            <img :src="generateSrc('ge', item)">
                            <div style="padding: 3px 0;">
                                <span>{{ port_name[item.port_id] }}</span>
                                <span>{{ (item.admin_status && item.link_status) ? langMap['online'] : langMap['offline'] }}</span>
                            </div>
                        </div>
                    </el-popover>
                </el-col>
            </template>
        </el-row>
        <h3>{{ langMap['hw_status'] }}</h3>
        <el-row>
            <el-col :span="8">
                <el-row
                    v-for="(item, key) in basicInfo"
                    :key="key"
                    class="text-line"
                    v-if="key !== 'bl_ver' && key !== 'vendor'"
                >
                    <el-col :span="10">{{ langMap[key] }}</el-col>
                    <el-col :span="14">{{ item }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <pie-charts :pie-data="cpuInfo" :id="cpu_id" v-if="cpuInfo.series"></pie-charts>
                    </el-col>
                    <el-col :span="12">
                        <pie-charts :pie-data="memoryInfo" :id="memory_id" v-if="cpuInfo.series"></pie-charts>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import pieCharts from "@/components/echarts/pie";
import { initPieData, initLineData } from "@/utils/common";
export default {
    name: "runningStatus",
    components: { pieCharts },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", "basicInfo"])
    },
    data() {
        return {
            cpuInfo: {},
            memoryInfo: {},
            cpu_id: "olt-cpu-usde",
            memory_id: "olt-memory-used",
            ponInfo: "",
            portInfo: ""
        };
    },
    created() {
        this.getCpu();
        this.getPon();
        this.getPort();
    },
    methods: {
        ...mapMutations({
            updateLoading: "changeLoadingState"
        }),
        getCpu() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/board", params: { info: "cpu" } }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            var data = res.data.data;
                            this.cpuInfo = initPieData({
                                name: this.langMap["cpu"],
                                data: [
                                    {
                                        value: data.cpu_usage,
                                        name: this.langMap["in_use"]
                                    },
                                    {
                                        value: 100 - data.cpu_usage,
                                        name: this.langMap["idle"]
                                    }
                                ]
                            });
                            this.memoryInfo = initPieData({
                                name: this.langMap["memory"],
                                data: [
                                    {
                                        value: data.memory_usage,
                                        name: this.langMap["memory_used"]
                                    },
                                    {
                                        value: 100 - data.memory_usage,
                                        name: this.langMap["idle"]
                                    }
                                ]
                            });
                            this.$nextTick(_ =>{
                                this.updateLoading(false);
                            })
                        }
                    }
                })
                .catch(err => {});
        },
        getPon() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/board", params: { info: "pon" } }),
                method: "get"
            })
                .then(res => {
                    this.ponInfo = "";
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.ponInfo = res.data.data;
                            this.$nextTick(_ =>{
                                this.updateLoading(false);
                            })
                        }
                    }
                })
                .catch(err => {});
        },
        getPort() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "portlist_info" }
                }),
                method: "get"
            })
                .then(res => {
                    this.portInfo = "";
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.portInfo = res.data.data;
                            this.$nextTick(_ =>{
                                this.updateLoading(false);
                            })
                        }
                    }
                })
                .catch(err => {
                    this.updateLoading(false);
                    this.$message.error(this.langMap['get_data_fail']);
                });
        },
        generateSrc(type, item) {
            if (type === "pon") {
                return (
                    "/static" +
                    (item.status ? "/pon_online.png" : "/pon_offline.png")
                );
            }
            if (type === "ge") {
                if (item.media === "fiber") {
                    return (
                        "/static" +
                        (item.admin_status
                            ? item.link_status
                                ? "/uplink-fiber-blue.png"
                                : "/uplink-fiber-black.png"
                            : "/uplink-fiber-black-disable.png")
                    );
                }
                if (item.media === "copper") {
                    return (
                        "/static" +
                        (item.admin_status
                            ? item.link_status
                                ? "/uplink-rj45-blue.png"
                                : "/uplink-rj45-black.png"
                            : "/uplink-rj45-disable.png")
                    );
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
.text-line {
    padding: 8px;
}
img {
    width: 32px;
    height: 32px;
}
.pon-status {
    margin: 30px 0;
}
.pon-show-detail {
    text-align: center;
}
.pon-info-item {
    padding: 3px 0;
    > span {
        display: inline-block;
        &:first-child {
            width: 60%;
            text-align: center;
        }
    }
}
</style>
