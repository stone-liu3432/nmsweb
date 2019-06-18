<template>
    <div>
        igmp
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: 'igmp',
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"]),
    },
    data(){
        return {}
    },
    created(){},
    methods: {}
}
</script>

<style lang="less" scoped>
</style>
