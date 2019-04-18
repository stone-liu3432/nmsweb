<template>
    <div class="pie" v-if="pieData">
        <div>{{ title }}</div>
        <div :ref="id"></div>
    </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'pie',
    props: ['pieData', 'id'],
    data(){
        return {
            chart: {}
        }
    },
    mounted() {
        if(this.id){
            this.chart = echarts.init(this.$refs[this.id]);
            this.chart.setOption(this.pieData);
            this.updateCharts(this.chart);
        }
    },
    computed: {
        title(){
            return this.pieData.series[0].name || '';
        }
    },
    methods: {
        ...mapMutations({
            updateCharts: 'updateCharts'
        }),
    },
    watch: {
        'pieData'(){
            this.chart.setOption(this.pieData);
        }
    }
}
</script>

<style lang="less" scoped>
div.pie{
    border: 1px solid #ddd;
    margin: 20px 0 0 0;
    >div{
        &:first-child{
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: linear-gradient(top, #F5F5F5, #E9E9E9);
        }
        &:last-child{
            width: 100%;
            height: 260px;
            padding: 8px;
            box-sizing: border-box;
        }
    }
}
</style>
