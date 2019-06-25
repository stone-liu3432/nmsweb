<template>
    <div>
        <h3>
            ARP
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="destroyARP"
            >{{ langMap['delete_all'] }}</el-button>
            <el-button
                type="primary"
                size="small"
                @click="refreshData"
                :disabled="loading"
            >{{ langMap['refresh'] }}</el-button>
        </h3>
        <el-table :data="arpTable" border stripe>
            <el-table-column prop="ipaddress" :label="langMap['ipaddr']"></el-table-column>
            <el-table-column prop="macaddress" :label="langMap['macaddr']"></el-table-column>
            <el-table-column prop="portid" :formatter="formatPort" :label="langMap['port_id']"></el-table-column>
            <el-table-column prop="vlanid" :label="langMap['vlan_id']"></el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="arpList.length"
            hide-on-single-page
        ></el-pagination>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "arpTable",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            arpList: [],
            arpTable: [],
            currentPage: 1,
            pageSize: 20,
            loading: false
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
                    url: "/switch_route",
                    params: { form: "arp_table" }
                }),
                method: "get"
            })
                .then(res => {
                    this.arpList = [];
                    this.arpTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.arpList = res.data.data;
                            if (
                                this.currentPage >
                                Math.ceil(this.arpList.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    this.arpList.length / this.pageSize
                                );
                            }
                            var start = this.pageSize * (this.currentPage - 1);
                            if (start + this.pageSize > this.arpList.length) {
                                this.arpTable = this.arpList.slice(start);
                            } else {
                                this.arpTable = this.arpList.slice(
                                    start,
                                    start + this.pageSize
                                );
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        currentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (this.currentPage - 1);
            if (start + this.pageSize > this.arpList.length) {
                this.arpTable = this.arpList.slice(start);
            } else {
                this.arpTable = this.arpList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        formatPort(row, col) {
            return this.port_name[row[col.property]];
        },
        destroyARP() {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning",
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_route",
                            params: { form: "arp_flush" }
                        }),
                        method: "destroy",
                        param: {}
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["destroy_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            this.loading = true;
            this.getData();
            setTimeout(_ => {
                this.loading = false;
            }, 1000);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
