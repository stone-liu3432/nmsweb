<template>
    <div>
        <h3 style="margin-left: 10px;">{{ langMap['pon_info'] }}</h3>
        <el-row :gutter="10" class="pon-status">
            <template v-for="(item,index) in ponInfo">
                <el-col :span="3" class="pon-show-detail">
                    <div>
                        <img :src="generateSrc('pon', item.status)"></img>
                    </div>
                    <div>
                        <span>{{ port_name[item.port_id] }}</span>
                        <span>online</span>
                    </div>
                    <!-- <div>
                        <span>registed</span>
                        <span>12</span>
                    </div>
                    <div>
                        <span>online</span>
                        <span>11</span>
                    </div>
                    <div>
                        <span>offline</span>
                        <span>1</span>
                    </div> -->
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-row
                    v-for="(item, key) in basicInfo"
                    :key="key"
                    class="text-line"
                    v-if="key !== 'bl_ver' && key !== 'vendor'"
                >
                    <el-col :span="8">{{ langMap[key] }}</el-col>
                    <el-col :span="8">{{ item }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
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
import { mapState } from "Vuex";
import pieCharts from "@/components/echarts/pie";
import { initPieData, initLineData } from "@/utils/common";
export default {
    name: "runningStatus",
    components: { pieCharts },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", 'basicInfo']),
    },
    data() {
        return {
            cpuInfo: {},
            memoryInfo: {},
            cpu_id: 'olt-cpu-usde',
            memory_id: 'olt-memory-used',
            ponInfo: '',
            portInfo: ''
        };
    },
    created() {
        this.getCpu();
        this.getPon();
        this.getPort();
    },
    methods: {
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
                        }
                    }
                })
                .catch(err => {});
        },
        getPon(){
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/board", params: { info: "pon" } }),
                method: "get"
            })
                .then(res => {
                    this.ponInfo = '';
                    if(res.data.code === 1){
                        if(res.data.data && res.data.data.length){
                            this.ponInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getPort(){
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/switch_port", params: { form: "portlist_info" } }),
                method: "get"
            })
                .then(res => {
                    this.portInfo = '';
                    if(res.data.code === 1){
                        if(res.data.data && res.data.data.length){
                            this.portInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        generateSrc(type, status, adminstatus){
            if(type === 'pon'){
                if(status){
                    return '/static/pon_online.png';
                }
                return '/static/pon_offline.png';
            }
        }
    }
};
</script>

<style lang="less" scoped>
.text-line {
    padding: 8px;
}
img{
    width: 32px;
    height: 32px;
}
.pon-status{
    margin: 30px 0;
}
.pon-show-detail{
    text-align: center;
    >div{
        padding: 3px 0;
        vertical-align: middle;
    }
}
</style>
