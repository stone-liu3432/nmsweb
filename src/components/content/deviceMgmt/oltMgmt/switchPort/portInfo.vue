<template>
    <div>
        <h3>{{ langMap['port_info'] }}</h3>
        <el-table :data="portInfo" stripe border>
            <el-table-column :formatter="formatName" :label="langMap['port_id']"></el-table-column>
            <el-table-column
                :formatter="formatState"
                prop="admin_status"
                :label="langMap['admin_status']"
            ></el-table-column>
            <el-table-column prop="link_status" :label="langMap['link_status']">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.link_status? '' : 'danger'"
                    >{{ scope.row.link_status ? langMap['link_up'] : langMap['link_down'] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :formatter="formatState" prop="auto_neg" :label="langMap['auto_neg']"></el-table-column>
            <el-table-column prop="speed" :label="langMap['speed']"></el-table-column>
            <el-table-column :formatter="formatDuplex" prop="duplex" :label="langMap['duplex']"></el-table-column>
            <el-table-column
                :formatter="formatState"
                prop="flow_ctrl"
                :label="langMap['flow_ctrl']"
            ></el-table-column>
            <el-table-column prop="mtu" :label="langMap['mtu']"></el-table-column>
            <el-table-column prop="media" :label="langMap['media']"></el-table-column>
            <el-table-column prop="pvid" :label="langMap['pvid']"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "portInfo",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            portInfo: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "portlist_info" }
                }),
                method: "get"
            })
                .then(res => {
                    this.portInfo = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.portInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatName(row, column) {
            return this.port_name[row.port_id];
        },
        formatState(row, column) {
            return column.property
                ? this.langMap["enable"]
                : this.langMap["disable"];
        },
        formatLink(row, column) {
            return column.property
                ? this.langMap["link_up"]
                : this.langMap["link_down"];
        },
        formatDuplex(row, column) {
            return column.property ? "full" : "half";
        }
    }
};
</script>

<style lang="less" scoped>
</style>
