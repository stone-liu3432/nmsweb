<template>
    <div>
        <h3>{{ langMap['vlan_cfg'] }}</h3>
        <div style="margin: 20px 0 20px 30px;">
            <el-button
                type="primary"
                size="small"
                @click="openDialog(null, 'create')"
            >{{ langMap['create'] }}VLAN</el-button>
            <el-button
                type="primary"
                size="small"
                @click="openDialog(null, 'delete')"
            >{{ langMap['delete'] }}VLAN</el-button>
            <el-button
                type="primary"
                size="small"
                @click="openDialog(null, 'batch_cfg_vlan')"
            >{{ langMap['batch_cfg_vlan'] }}</el-button>
            <el-button
                type="primary"
                size="small"
                @click="loadmoreData"
                :loading="loading"
                v-if="loadmore"
            >{{ langMap['loadmore'] }}</el-button>
        </div>
        <h3>{{ langMap['vlan_list'] }}</h3>
        <el-table :data="vlanTable" border stripe>
            <el-table-column prop="vlan_id" :label="langMap['vlan_id']" width="80"></el-table-column>
            <el-table-column
                :formatter="formatPortList"
                prop="tagged_portlist"
                :label="langMap['tagged_portlist']"
                width="180"
            ></el-table-column>
            <el-table-column
                :formatter="formatPortList"
                prop="untagged_portlist"
                :label="langMap['untagged_portlist']"
            ></el-table-column>
            <el-table-column
                :formatter="formatPortList"
                prop="default_vlan_portlist"
                :label="langMap['default_vlan_portlist']"
            ></el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">{{ langMap['config'] }}</template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog(scope.row, 'config')"
                    >{{ langMap['config'] }}</el-button>
                    <el-button
                        type="text"
                        @click="delVlan(scope.row, scope.$index)"
                    >{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="1000px" @close="closeDialog">
            <span slot="title">{{ langMap[dialogFlag] }}</span>
            <vlan-form :flag="dialogFlag" :vlan-data="dialogData" ref="vlan-mgmt-form"></vlan-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('vlan-mgmt-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
        <el-pagination
            style="float: right;"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="vlanList.length"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { analysisPortList, generatorPortName } from "@/utils/common";
import { pageSizes } from "@/utils/common-data";
import vlanForm from "./vlanForm";
export default {
    name: "vlanMgmt",
    components: { vlanForm },
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"])
    },
    data() {
        return {
            count: 0,
            vlanList: [],
            vlanTable: [],
            pageSize: 10,
            currentPage: 1,
            pageSizes,
            loadmore: false,
            loading: false,
            dialogVisible: false,
            dialogFlag: "",
            dialogData: {},
            cacheData: {}
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
                    url: "/switch_vlan",
                    params: { count: this.count }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            if (!this.count) {
                                this.vlanList = res.data.data;
                                this.currentPage = 1;
                            } else {
                                this.vlanList = this.vlanList.cancat(
                                    res.data.data
                                );
                            }
                            if (
                                this.currentPage >
                                Math.ceil(this.vlanList.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    this.vlanList.length / this.pageSize
                                );
                            }
                            if (this.vlanList.length > this.pageSize) {
                                this.vlanTable = this.vlanList.slice(
                                    (this.currentPage - 1) * this.pageSize,
                                    (this.currentPage - 1) * this.pageSize +
                                        this.pageSize
                                );
                            } else {
                                this.vlanTable = this.vlanList;
                            }
                            if (res.data.data.length === 200) {
                                this.count++;
                                this.loadmore = true;
                            } else {
                                this.loadmore = false;
                            }
                        } else {
                            this.loadmore = false;
                        }
                    } else {
                        this.vlanList = [];
                        this.vlanTable = [];
                        this.loadmore = false;
                    }
                })
                .catch(err => {});
        },
        formatPortList(row, col) {
            return (
                generatorPortName(
                    analysisPortList(row[col.property]),
                    this.port_name
                ) || " - "
            );
        },
        sizeChange(val) {
            this.pageSize = val;
            if (this.currentPage > this.vlanList.length / this.pageSize) {
                this.currentPage = Math.ceil(
                    this.vlanList.length / this.pageSize
                );
                this.vlanTable = this.vlanList.slice(
                    (this.currentPage - 1) * this.pageSize
                );
            } else {
                this.vlanTable = this.vlanList.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.currentPage * this.pageSize
                );
            }
        },
        currentChange(val) {
            if (val > Math.ceil(this.vlanList.length / this.pageSize)) {
                val = Math.ceil(this.vlanList.length / this.pageSize);
            }
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.vlanList.length) {
                this.vlanTable = this.vlanList.slice(start);
            } else {
                this.vlanTable = this.vlanList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        delVlan(data, index) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlan"
                        }),
                        method: "destroy",
                        param: {
                            vlan_id: data.vlan_id
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.vlanList.splice(
                                    this.vlanList.indexOf(data),
                                    1
                                );
                                this.vlanTable.splice(index, 1);
                                this.currentChange(this.currentPage);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.cacheData = data;
            this.dialogFlag = flag;
            this.dialogData = Object.assign({}, data);
        },
        submitForm(formName) {
            var valid = this.$refs[formName].validForm();
            var vlanForm = this.$refs[formName].vlanForm;
            var tagged = this.$refs[formName].taggedList.sort().join(",");
            var untagged = this.$refs[formName].untaggedList.sort().join(",");
            if (valid) {
                var data, createAndSet;
                if (this.dialogFlag === "create") {
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlanlist"
                        }),
                        method: "create",
                        param: {
                            type: 1,
                            vlanid_s: vlanForm.vlan_id_s,
                            vlanid_e: vlanForm.vlan_id_e
                        }
                    };
                    createAndSet = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlanlist"
                        }),
                        method: "set",
                        param: {
                            vlanid_s: vlanForm.vlan_id_s,
                            vlanid_e: vlanForm.vlan_id_e,
                            tagged_portlist: tagged,
                            untagged_portlist: untagged
                        }
                    };
                }
                if (this.dialogFlag === "delete") {
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlanlist"
                        }),
                        method: "destroy",
                        param: {
                            vlanid_s: vlanForm.vlan_id_s,
                            vlanid_e: vlanForm.vlan_id_e
                        }
                    };
                }
                if (this.dialogFlag === "batch_cfg_vlan") {
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlanlist"
                        }),
                        method: "set",
                        param: {
                            vlanid_s: vlanForm.vlan_id_s,
                            vlanid_e: vlanForm.vlan_id_e,
                            tagged_portlist: tagged,
                            untagged_portlist: untagged
                        }
                    };
                }
                if (this.dialogFlag === "config") {
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_vlanlist"
                        }),
                        method: "set",
                        param: {
                            vlanid_s: this.cacheData.vlan_id,
                            vlanid_e: this.cacheData.vlan_id,
                            tagged_portlist: tagged,
                            untagged_portlist: untagged
                        }
                    };
                }
                this.$devProxy(data)
                    .then(res => {
                        if (res.data.code === 1) {
                            if (
                                this.dialogFlag === "create" &&
                                (!!tagged || !!untagged) &&
                                !!createAndSet
                            ) {
                                //  创建vlan 并配置了端口
                                this.$devProxy(createAndSet)
                                    .then(res => {
                                        if (res.data.code === 1) {
                                            this.$message.success(
                                                this.langMap[
                                                    data.method + "_success"
                                                ]
                                            );
                                            this.count && this.count--;
                                            this.getData();
                                        } else {
                                            this.$message.error(
                                                res.data.message
                                            );
                                        }
                                    })
                                    .catch(err => {});
                            } else {
                                //  只创建vlan，未配置端口
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                this.count && this.count--;
                                this.getData();
                            }
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.dialogVisible = false;
                    })
                    .catch(err => {});
            }
        },
        closeDialog() {
            this.$refs["vlan-mgmt-form"].resetForm();
        },
        loadmoreData() {
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
