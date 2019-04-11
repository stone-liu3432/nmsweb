<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="20">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <pie :data="data" :id="id" v-if="data"></pie>
                    </el-col>
                    <el-col :span="12">
                        <line-charts :data="data1" :id="id1"></line-charts>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="4">
                <div style="width: 100%;height: 1280px;background: #ccc;margin-top: 20px;">test</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import pie from '../echarts/pie'
import lineCharts from '../echarts/line'
import { initPieData, initLineData } from '@/utils/common'
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'home',
    computed: mapState(['charts']),
    data(){
        return {
            data: {},
            id: 'test',
            data1: {},
            id1: 'test1',
            test: 0,
            debounced: true
        }
    },
    components: { pie, lineCharts },
    created(){
        this.data = initPieData({
            name: 'EPON',
            data: [
                {value: 85, name: 'online'},
                {value: 3, name: 'offline'},
                {value: 16, name: 'warning'}
            ]
        })
        this.data1 = initLineData({
            name: 'test1',
            xAxis: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'],
            data: [820, 932, 901, 934, 1290, 1330]
        })
    },
    mounted(){
        var _this = this;
        document.body.onresize = function(){
            if(_this.debounced){
                _this.debounced = false;
                // to do
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
    },
    methods: {
    },
    beforeDestroy(){
        document.body.onresize = null;
    }
}
</script>

<style lang="less" scoped>

</style>
