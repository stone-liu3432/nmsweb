<template>
    <div>
        <port-nav @port-change="portChange" type="port">
            <template slot="title">{{ langMap['perf_info'] }}</template>
        </port-nav>
        <el-row>
            <el-col :span="10">
                <template
                    v-for="(item, key) in perfInfo"
                    v-if="key.indexOf('rx') > -1 && key !== 'port_id'"
                >
                    <el-row style="margin: 10px 0;">
                        <template>
                            <el-col :span="12">{{ removeUnderline(key) }}</el-col>
                            <el-col :span="8">{{ item }}</el-col>
                        </template>
                    </el-row>
                </template>
            </el-col>
            <el-col :span="10">
                <template
                    v-for="(item, key) in perfInfo"
                    v-if="key.indexOf('tx') > -1 && key !== 'port_id'"
                >
                    <el-row style="margin: 10px 0;">
                        <template>
                            <el-col :span="12">{{ removeUnderline(key) }}</el-col>
                            <el-col :span="8">{{ item }}</el-col>
                        </template>
                    </el-row>
                </template>
            </el-col>
        </el-row>
        <el-button
            :loading="loading"
            size="small"
            type="primary"
            style="margin: 20px 0 0 10px;"
            @click="clearPerf"
        >{{ langMap['clear_perf'] }}</el-button>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { removeUnderline } from "@/utils/common";
export default {
    name: "perfInfo",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", 'timestamp'])
    },
    data() {
        return {
            perfInfo: "",
            loading: false,
            port_id: 1
        };
    },
    created() {},
    methods: {
        getData(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "statistic", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.perfInfo = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.perfInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id) {
            this.port_id = port_id;
            this.getData(port_id);
        },
        removeUnderline(str) {
            return removeUnderline(str);
        },
        clearPerf() {
            this.loading = true;
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "nostatistic", port_id: this.port_id }
                }),
                method: "get"
            }).then(res =>{
                if(res.data.code === 1){
                    this.$message.success(this.langMap['clear_success']);
                    this.getData(this.port_id);
                }else{
                    this.$message.error(res.data.message);
                }
                this.loading = false;
            }).catch(err =>{})
        }
    },
    watch: {
        timestamp(){
            this.getData(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
