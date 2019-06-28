<template>
    <div>
        <h3>{{ langMap['route_cfg'] }}</h3>
        <div>
            <span>{{ langMap['def_route'] }}:</span>
            <span>{{ def_route ? def_route : ' - ' }}</span>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="cfgDefRoute"
            >{{ langMap['config'] }}</el-button>
            <el-button size="small" type="primary" @click="delDefRoute">{{ langMap['delete'] }}</el-button>
        </div>
        <h3 style="margin-top: 30px;">
            <span>{{ langMap['route'] + langMap['status'] }}</span>
            <el-switch
                v-model="status"
                :active-text="langMap['enable']"
                :inactive-text="langMap['disable']"
                :active-value="1"
                :inactive-value="0"
                style="margin-left: 30px;"
                @change="changeStatus"
                :disabled="isLoading"
            ></el-switch>
        </h3>
        <template v-if="!!this.status">
            <h3 style="margin-top: 30px;">
                {{ langMap['static_route'] }}
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog"
                >{{ langMap['add'] }}</el-button>
            </h3>
            <el-table :data="routes" border stripe>
                <el-table-column
                    prop="ipaddress"
                    :formatter="formatIp"
                    :label="`${langMap['dst_ipaddr']}/${langMap['mask']}`"
                    width="160px"
                ></el-table-column>
                <el-table-column prop="gateway" :label="langMap['gateway']"></el-table-column>
                <el-table-column
                    prop="interface"
                    :formatter="formatInterface"
                    :label="langMap['interface']"
                ></el-table-column>
                <el-table-column
                    prop="protocol"
                    :formatter="formatProtocol"
                    :label="langMap['protocol']"
                ></el-table-column>
                <el-table-column prop="preference" :label="langMap['preference']"></el-table-column>
                <el-table-column prop="status" :formatter="formatStatus" :label="langMap['status']"></el-table-column>
                <el-table-column :label="langMap['config']">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="scope.row.protocol !== 1"
                            @click="delStaticRoute(scope.row)"
                        >{{ langMap['delete'] }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['add'] }}</span>
            <el-form
                :model="formData"
                :rules="formRules"
                ref="static-route-add-form"
                label-width="140px"
            >
                <el-form-item :label="langMap['dst_ipaddr']" prop="ipaddr">
                    <el-input v-model="formData.ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['mask']" prop="mask">
                    <el-input v-model="formData.mask"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['gateway']" prop="gateway">
                    <el-input v-model="formData.gateway"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('static-route-add-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorIpAddr } from "@/utils/validator";
export default {
    name: "staticRoute",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            def_route: "",
            status: 0,
            routes: [],
            isLoading: false,
            dialogVisible: false,
            formData: {
                ipaddr: "",
                mask: "",
                gateway: ""
            },
            formRules: {
                ipaddr: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                mask: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                gateway: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {
        this.getDefRoute();
        this.getStatus();
    },
    methods: {
        getDefRoute() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_route",
                    params: { form: "route_default" }
                }),
                method: "get"
            })
                .then(res => {
                    this.def_route = "";
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.def_route = res.data.data.gateway;
                        }
                    }
                })
                .catch(err => {});
        },
        getStatus() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_route",
                    params: { form: "admin_status" }
                }),
                method: "get"
            })
                .then(res => {
                    this.status = "";
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.status = res.data.data.status;
                            if (!!this.status) {
                                this.getRoute();
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getRoute() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_route",
                    params: { form: "route_table" }
                }),
                method: "get"
            })
                .then(res => {
                    this.routes = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.routes = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        cfgDefRoute() {
            this.$prompt(this.langMap["ipaddr"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                inputPattern: /^(((\d?\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))\.){3}((\d?\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))$/,
                inputErrorMessage: this.langMap["ipaddr_error"],
                inputValue: this.def_route
            })
                .then(({ value }) => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_route",
                            params: { form: "route_default" }
                        }),
                        method: "set",
                        param: {
                            gateway: value
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getDefRoute();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        delDefRoute() {
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
                            params: { form: "route_default" }
                        }),
                        method: "delete",
                        param: {
                            gateway: '0.0.0.0'
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getDefRoute();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        formatInterface(row, col) {
            return row[col.property] ? "Vlanif" + row[col.property] : " * ";
        },
        formatProtocol(row, col) {
            return row[col.property] === "to do"
                ? "to do"
                : row[col.property] === 1
                ? "Direct"
                : "Static";
        },
        formatStatus(row, col) {
            return row[col.property] === 1 ? "Reachale" : "Unreachale";
        },
        formatIp(row, col) {
            return `${row[col.property]} / ${row.mask_num}`;
        },
        changeStatus(val) {
            this.status = Number(!val);
            this.isLoading = true;
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_route",
                    params: { form: "admin" }
                }),
                method: "set",
                param: {
                    status: val
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.getStatus();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
            setTimeout(_ => {
                this.isLoading = false;
            }, 1000);
        },
        delStaticRoute(node) {
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
                            params: { form: "static_route" }
                        }),
                        method: "delete",
                        param: {
                            ipaddress: node.ipaddress,
                            mask: node.mask,
                            gateway: node.gateway
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getRoute();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog() {
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_route",
                            params: { form: "static_route" }
                        }),
                        method: "set",
                        param: {
                            ipaddress: this.formData.ipaddr,
                            mask: this.formData.mask,
                            gateway: this.formData.gateway
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["add_success"]
                                );
                                this.getRoute();
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        closeDialog() {
            this.$refs["static-route-add-form"].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
