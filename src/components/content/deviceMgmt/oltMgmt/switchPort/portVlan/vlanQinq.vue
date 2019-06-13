<template>
    <div>
        <el-table :data="pvQinq" border>
            <!-- 
            <span>cvlan</span>
            <span>cvlan start</span>
            <span>cvlan end</span>
            <span>svlan</span>
            <span>{{ lanMap['svlan_pri'] }}</span>
             -->
            <el-table-column prop="cvlan" label="cvlan" width="180"></el-table-column>
            <el-table-column prop="cvlan_s" label="cvlan start" width="180"></el-table-column>
            <el-table-column prop="cvlan_e" label="cvlan end"></el-table-column>
            <el-table-column prop="svlan" label="svlan"></el-table-column>
            <el-table-column prop="svlan_pri" :label="langMap['svlan_pri']"></el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-button size="small" type="primary">{{ langMap['add'] }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text">{{ langMap['config'] }}</el-button>
                    <el-button type="text">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "vlanQinq",
    props: {
        port_id: {
            type: Number,
            default: 1
        }
    },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            pvQinq: []
        };
    },
    created() {
        this.getQinQ(this.port_id);
    },
    methods: {
        getQinQ(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/vlan_action",
                    params: { form: "qinq", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.pvQinq = [];
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.pvQinq = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    },
    watch: {
        port_id(){
            this.getQinQ(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
