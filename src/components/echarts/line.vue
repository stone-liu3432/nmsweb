<template>
    <div class="pie" v-if="data">
        <div>{{ name }}</div>
        <div :ref="id"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'lineCharts',
    props: ['data', 'id'],
    mounted() {
        if(this.id){
            var chart = echarts.init(this.$refs[this.id]);
            chart.setOption(this.data);
            this.updateCharts(chart);
        }
    },
    computed: {
        name(){
            return this.data.series[0].name || '';
        }
    },
    methods: {
        ...mapMutations({
            updateCharts: 'updateCharts'
        }),
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