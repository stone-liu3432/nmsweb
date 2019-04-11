<template>
    <div class="pie" v-if="lineData">
        <div>{{ name }}</div>
        <div :ref="id"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'lineCharts',
    props: ['lineData', 'id'],
    data(){
        return {
            chart: {}
        }
    },
    mounted() {
        if(this.id){
            this.chart = echarts.init(this.$refs[this.id]);
            this.chart.setOption(this.lineData);
            this.updateCharts(this.chart);
        }
    },
    computed: {
        name(){
            return this.lineData.series[0].name || '';
        }
    },
    methods: {
        ...mapMutations({
            updateCharts: 'updateCharts'
        }),
    },
    watch: {
        'lineData'(){
            this.chart.setOption(this.lineData);
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