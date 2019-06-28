<template>
    <div>
        <h3>
            {{ langMap['mvlan'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog(mv_info, 'create')"
            >{{ langMap['create'] }}</el-button>
        </h3>
        <template v-if="multi_vlan.length">
            <el-divider content-position="right"></el-divider>
            <div class="igmp-mvlan-items">
                <span>{{ langMap['mvlan'] }}</span>
                <span>
                    <el-select v-model.number="mvlan" size="small" style="width: 200px;">
                        <template v-for="(item,key) in multi_vlan">
                            <el-option :value="item.mvlan"></el-option>
                        </template>
                    </el-select>
                </span>
                <span>
                    <el-button size="small" type="primary" @click="delMvlan">{{ langMap['delete'] }}</el-button>
                </span>
            </div>
            <el-divider content-position="right"></el-divider>
            <div class="igmp-mvlan-items">
                <span>{{ langMap['mvlan_desc'] }}</span>
                <span>{{ mv_info.mvlan_desc }}</span>
                <span>
                    <el-button
                        size="small"
                        type="primary"
                        @click="openDialog(mv_info, 'config-desc')"
                    >{{ langMap['config'] }}</el-button>
                </span>
            </div>
            <el-divider content-position="right"></el-divider>
            <div class="igmp-mvlan-items">
                <span>{{ langMap['router_portlist'] }}</span>
                <span>{{ formatPortlist(mv_info.router_portlist) }}</span>
                <span>
                    <el-button
                        size="small"
                        type="primary"
                        @click="openDialog(mv_info, 'config-router-list')"
                    >{{ langMap['add'] }}</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        @click="openDialog(mv_info, 'delete-router-port')"
                    >{{ langMap['delete'] }}</el-button>
                </span>
            </div>
            <el-divider content-position="right"></el-divider>
            <div class="igmp-mvlan-items">
                <span>{{ langMap['mc_unknown_policy'] }}</span>
                <span>{{ ['transparent', 'discard'][mc_unknown.mc_unknown_policy] }}</span>
                <span>
                    <el-button
                        size="small"
                        type="primary"
                        @click="openDialog(mc_unknown, 'config-mc-policy')"
                    >{{ langMap['config'] }}</el-button>
                </span>
            </div>
            <h3 style="margin-top: 36px;">{{ langMap['program'] }}</h3>
            <el-table :data="program" style="width: 100%" border stripe>
                <el-table-column :formatter="formatIp" :label="langMap['ipaddr']" width="300px"></el-table-column>
                <el-table-column prop="program_desc" :label="langMap['program_desc']"></el-table-column>
                <el-table-column :label="langMap['config']" width="140px">
                    <template slot="header" slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openDialog(null, 'config-program')"
                        >{{ langMap['add'] }}</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="delProgram(scope.row)"
                        >{{ langMap['delete'] }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="640px" @close="closeDialog">
            <span slot="title">{{ langMap['config'] }}</span>
            <igmp-mvlan-form
                :form-info="cacheData"
                :form-flag="dialogFlag"
                :mvlan="mvlan"
                ref="igmp-config-mvlan"
            ></igmp-mvlan-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('igmp-config-mvlan')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import igmpMvlanForm from "./igmpMvlanForm";
import { analysisPortList, generatorPortName } from "@/utils/common";
export default {
    name: "igmpMvlan",
    components: { igmpMvlanForm },
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"])
    },
    data() {
        return {
            multi_vlan: [],
            mvlan: 0,
            mv_info: {},
            mc_unknown: {},
            program: [],
            dialogVisible: false,
            dialogFlag: "",
            cacheData: {}
        };
    },
    created() {
        this.getMvlan();
    },
    methods: {
        getMvlan() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_igmp",
                    params: { form: "multicast_vlan" }
                }),
                method: "get"
            })
                .then(res => {
                    this.multi_vlan = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.multi_vlan = res.data.data;
                            if (!this.mvlan) {
                                this.mvlan = this.multi_vlan[0].mvlan;
                                return
                            }
                            //  删除mvlan时调用
                            var flag = true;
                            this.multi_vlan.forEach(item => {
                                if (item.mvlan === this.mvlan) {
                                    flag = false;
                                    this.mv_info = item;
                                }
                            });
                            if (flag) {
                                this.mvlan = this.multi_vlan[0].mvlan;
                            }
                        }else{
                            this.mv_info = {};
                            this.mc_unknown = {};
                            this.program = [];
                        }
                    }
                })
                .catch(err => {});
        },
        getMcUnknown(mvlan) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_igmp",
                    params: { form: "mc_unknown", mvlan }
                }),
                method: "get"
            })
                .then(res => {
                    this.mc_unknown = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.mc_unknown = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getProgram(mvlan) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_igmp",
                    params: { form: "program", mvlan }
                }),
                method: "get"
            })
                .then(res => {
                    this.program = [];
                    if (res.data.code === 1 && res.data.data.length) {
                        if (res.data.data) {
                            this.program = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatIp(row, col) {
            return `${row.program_s} - ${row.program_e}`;
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
            if (data) {
                this.$nextTick(_ => {
                    this.cacheData = Object.assign({}, data);
                });
            }
        },
        delMvlan() {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_igmp",
                            params: { form: "multicast_vlan" }
                        }),
                        method: "destroy",
                        param: {
                            mvlan: this.mv_info.mvlan,
                            mvlan_desc: this.mv_info.mvlan_desc
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getMvlan();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        delProgram(item) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_igmp",
                            params: { form: "program" }
                        }),
                        method: "delete",
                        param: {
                            mvlan: this.mvlan,
                            program_s: item.program_s,
                            program_e: item.program_e,
                            program_desc: item.program_desc
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getProgram(this.mvlan);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var form = this.$refs[formName].mvForm;
                var data = this.composeData(this.dialogFlag, form);
                this.$devProxy(data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                            if (
                                this.dialogFlag === "create" ||
                                this.dialogFlag === "config-router-list" ||
                                this.dialogFlag === "delete-router-port" ||
                                this.dialogFlag === "config-desc"
                            ) {
                                this.getMvlan();
                            }
                            if (this.dialogFlag === "config-mc-policy") {
                                this.getMcUnknown(this.mvlan);
                            }
                            if (this.dialogFlag === "config-program") {
                                this.getProgram(this.mvlan);
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
            this.$refs["igmp-config-mvlan"].resetForm();
        },
        composeData(flag, data) {
            var data;
            if (flag === "create") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "multicast_vlan" }
                    }),
                    method: "create",
                    param: {
                        mvlan: data.mvlan,
                        mvlan_desc: data.mvlan_desc
                    }
                };
            }
            if (flag === "config-desc") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "multicast_vlan_desc" }
                    }),
                    method: "set",
                    param: {
                        mvlan: data.mvlan,
                        mvlan_desc: data.mvlan_desc
                    }
                };
            }
            if (flag === "config-router-list") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "router_port" }
                    }),
                    method: "add",
                    param: {
                        mvlan: data.mvlan,
                        router_portlist: data.checkList.toString()
                    }
                };
            }
            if (flag === "delete-router-port") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "router_port" }
                    }),
                    method: "delete",
                    param: {
                        mvlan: data.mvlan,
                        router_portlist: data.checkList.toString()
                    }
                };
            }
            if (flag === "config-mc-policy") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "mc_unknown" }
                    }),
                    method: "set",
                    param: {
                        mvlan: data.mvlan,
                        mc_unknown_policy: data.mc_unknown_policy
                    }
                };
            }
            if (flag === "config-program") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_igmp",
                        params: { form: "program" }
                    }),
                    method: "add",
                    param: {
                        mvlan: data.mvlan,
                        program_s: data.program_s,
                        program_e: data.program_e,
                        program_desc: data.program_desc
                    }
                };
            }
            return data;
        },
        formatPortlist(portlist) {
            return generatorPortName(
                analysisPortList(portlist),
                this.port_name
            );
        }
    },
    watch: {
        mvlan() {
            this.multi_vlan.forEach(item => {
                if (item.mvlan === this.mvlan) {
                    this.mv_info = item;
                }
            });
            if (this.mvlan) {
                this.getMcUnknown(this.mvlan);
                this.getProgram(this.mvlan);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.igmp-mvlan-items {
    margin: 16px 0;
    > span + span {
        margin-left: 30px;
    }
}
</style>
