<template>
    <div class="pie" :id="id">
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'pie',
    props: ['data', 'id'],
    mounted() {
        if(this.id && document){
            var chart = echarts.init(document.getElementById(this.id));
            chart.setOption(this.data);
        }
    },
}
</script>

<style lang="less" scoped>
div.pie{
    margin: 8px auto;
    width: 500px;
    height: 500px;
}
</style>
