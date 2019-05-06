<template>
    <el-row :gutter="20">
        <el-col :span="20">
            <el-row :gutter="20">
                <el-col :span="12">
                    <pie-charts :pie-data="cpuInfo" :id="cpuID" v-if="cpuInfo.series"></pie-charts>
                </el-col>
                <el-col :span="12">
                    <pie-charts :pie-data="memoryInfo" :id="memoryID" v-if="memoryInfo.series"></pie-charts>
                </el-col>
                <el-col :span="12">
                    <pie-charts :pie-data="devInfo" :id="devID" v-if="devInfo.series"></pie-charts>
                </el-col>
                <el-col :span="12">
                    <pie-charts :pie-data="onuInfo" :id="onuID" v-if="onuInfo.series"></pie-charts>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="4">
            <div></div>
        </el-col>
    </el-row>
</template>

<script>
import pieCharts from '../echarts/pie'
import lineCharts from '../echarts/line'
import { initPieData, initLineData } from '@/utils/common'
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'home',
    computed: mapState(['charts', 'lanMap']),
    data(){
        return {
            debounced: true,
            cpuInfo: {},
            memoryInfo: {},
            cpuID: 'cpu-used',
            memoryID: 'memory-used',
            devInfo: {},
            devID: 'device-info',
            onuInfo: {},
            onuID: 'all-onu-info'
        }
    },
    components: { pieCharts, lineCharts },
    created(){

    },
    mounted(){
        var _this = this;
        document.body.onresize = function(){
            if(_this.debounced){
                _this.debounced = false;
                _this.charts.forEach(item =>{
                    if(typeof item.resize === 'function'){
                        item.resize();
                    }
                })
                setTimeout(() =>{
                    _this.debounced = true;
                }, 300)
            }
        }
        this.$nextTick(() =>{
            this.getSysInfo();
            this.getDevInfo();
            this.getOnuInfo();
        })
    },
    methods: {
        getSysInfo(){
            this.$http.get('/api/server').then(res =>{
                if(res.data.code === 1){
                    var data = res.data.data;
                    this.cpuInfo = initPieData({
                        name: this.lanMap['cpu'],
                        data: [
                            { value: data.cpu, name: this.lanMap['in_use'] },
                            { value: 100 - data.cpu, name: this.lanMap['idle']}
                        ]
                    })
                    this.memoryInfo = initPieData({
                        name: this.lanMap['memory'],
                        data: [
                            { value: data.memory_used, name: this.lanMap['memory_used']},
                            { value: data.memory_total - data.memory_used, name: this.lanMap['idle']}
                        ]
                    })
                }else{
                    this.cpuInfo = {};
                    this.memoryInfo = {};
                }
            }).catch(err =>{

            })
        },
        getDevInfo(){
            this.$http.get('/api/server?device=eponolt').then(res =>{
                if(res.data.code === 1){
                    var data = res.data.data;
                    this.devInfo = initPieData({
                        name: 'EPON/GPON',
                        data: [
                            { value: data.error, name: this.lanMap['error']},
                            { value: data.offline, name: this.lanMap['offline']},
                            { value: data.online, name: this.lanMap['online']},
                        ]
                    })
                }else{
                    this.devInfo = {};
                }
            }).catch(err => {

            })
        },
        getOnuInfo(){
            this.$http.get('/api/server?device=epononu').then(res =>{
                if(res.data.code === 1){
                    var data = res.data.data;
                    this.onuInfo = initPieData({
                        name: 'ONU',
                        data: [
                            { value: data.offline, name: this.lanMap['offline']},
                            { value: data.register, name: this.lanMap['register']},
                            { value: data.initial, name: this.lanMap['initial']},
                            { value: data.authorized, name: this.lanMap['authorized']},
                            { value: data.unauth, name: this.lanMap['unauth'] }
                        ]
                    })
                }else{
                    this.onuInfo = {};
                }
            }).catch(err=>{

            })
        }
    },
    beforeDestroy(){
        document.body.onresize = null;
    },
    watch: {
        lanMap(){
            this.cpuInfo = {};
            this.memoryInfo = {};
            this.devInfo = {};
            this.onuInfo = {};
            this.getSysInfo();
            this.getDevInfo();
            this.getOnuInfo();
        }
    }
}
</script>

<style lang="less" scoped>
</style>
