<template>
    <div>
        qos mgmt
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: 'qosMgmt',
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
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
