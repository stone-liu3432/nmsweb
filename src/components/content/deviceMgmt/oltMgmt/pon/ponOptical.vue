<template>
    <div>
        <port-nav @port-change="portChange" :onu="true" @onu-change="onuChange">
            <template slot="title">{{ langMap['onu_deny'] }}</template>
        </port-nav>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: 'ponOptical',
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data(){
        return {}
    },
    created(){},
    methods: {
        portChange(port_id){
            //console.log(port_id);
        },
        onuChange(port_id, onu_id){
            //console.log(port_id, onu_id);
        },
        getOnuOptical(port_id){

        },
        getPonOptical(port_id, onu_id){

        },
    }
}
</script>

<style lang="less" scoped>
</style>
