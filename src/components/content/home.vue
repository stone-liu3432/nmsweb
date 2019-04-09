<template>
    <div>
        <pie :id="id" :data="data" v-if="data.series"></pie>
    </div>
</template>

<script>
import pie from '../echarts/pie'
export default {
    name: 'home',
    data(){
        return {
            data: {},
            id: 'test'
        }
    },
    components: { pie },
    created(){
        
    },
    mounted(){
        this.data = {
            backgroundColor: '#2c343c',
            title: {
                text: 'test Pie',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },
            series : [
                {
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:274, name:'联盟广告'},
                        {value:235, name:'视频广告'},
                        {value:400, name:'搜索引擎'}
                    ].sort((a, b) => a.value - b.value)
                }
            ]
        };
    }
}
</script>

<style lang="less" scoped>

</style>
