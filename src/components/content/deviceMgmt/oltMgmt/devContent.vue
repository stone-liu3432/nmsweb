<template>
    <div>
        <running-status v-if="showContent === 'running_status'"></running-status>
    </div>
</template>

<script>
const runningStatus = () => import(/* webpackChunkName: olt-system */ './system/running-status');
export default {
    name: 'devContent',
    props: ['showContent'],
    components: { runningStatus },
    data(){
        return {}
    },
    methods: {}
}
</script>

<style lang="less" scoped>
</style>
