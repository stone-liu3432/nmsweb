<template>
    <div>
        <h3>{{ langMap['remote_mgmt'] }}</h3>
        <el-card shadow="hover">
            <div slot="header">
                <span>{{ langMap['outbound'] }}</span>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="openModal(outbound, 'outbound')"
                >{{ langMap['config'] }}</el-button>
            </div>
            <el-row>
                <template
                    v-for="(item, key) in outbound"
                    v-if="key !== 'interface' && key !== 'macaddr' && key !== 'mtu'"
                >
                    <el-col :span="12">
                        <el-row style="padding: 6px 0;">
                            <el-col :span="6">{{ langMap[key] }}</el-col>
                            <el-col :span="12">{{ item }}</el-col>
                        </el-row>
                    </el-col>
                </template>
            </el-row>
        </el-card>
        <h3>{{ langMap['inbound'] }}</h3>
        <el-table :data="inbound" border style="width: 100%">
            <el-table-column prop="interface" :formatter="formatVlanif" :label="langMap['name']"></el-table-column>
            <el-table-column prop="ipaddr" :label="langMap['ipaddr']"></el-table-column>
            <el-table-column prop="ipmask" :label="langMap['ipmask']"></el-table-column>
            <el-table-column prop="vlan_id" :label="langMap['vlan_id']"></el-table-column>
            <el-table-column prop="rcvpkts" :label="langMap['rcvpkts']"></el-table-column>
            <el-table-column prop="rcvbytes" :label="langMap['rcvbytes']"></el-table-column>
            <el-table-column prop="transpkts" :label="langMap['transpkts']"></el-table-column>
            <el-table-column prop="transbytes" :label="langMap['transbytes']"></el-table-column>
            <el-table-column>
                <template slot="header" slot-scope="scope">
                    <el-button
                        type="text"
                        size="mini"
                        @click="openModal(null, 'add')"
                    >{{ `${langMap['add']}${ language === 'en' ? ' ' : '' }${langMap['inbound']}` }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="openModal(scope.row, 'inbound')"
                    >{{ langMap['config'] }}</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="delInbound(scope.row)"
                    >{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="configModal" append-to-body @close="closeModal">
            <span slot="title">
                <span>{{ langMap['config'] }}</span>
            </span>
            <el-form label-width="100px" :model="remoteForm" :rules="rules" ref="remote-mgmt-form">
                <el-form-item :label="langMap['interface']" prop="interface">
                    <el-input v-if="modalFlag === 'add'" v-model="remoteForm.interface"></el-input>
                    <span v-else>{{ remoteForm.interface }}</span>
                </el-form-item>
                <el-form-item :label="langMap['ipaddr']" prop="ipaddr">
                    <el-input v-model="remoteForm.ipaddr"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['ipmask']" prop="ipmask">
                    <el-input v-model="remoteForm.ipmask"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['vlan_id']" prop="vlan_id" v-if="modalFlag === 'add'">
                    <el-input v-model="remoteForm.vlan_id"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeModal">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="submitForm('remote-mgmt-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import validator from "@/utils/validator";
export default {
    name: "remoteMgmt",
    computed: {
        ...mapState(["langMap", "dev_ip", "language"])
    },
    data() {
        return {
            outbound: {},
            inbound: [],
            configModal: false,
            modalFlag: "",
            remoteForm: {
                ipaddr: "",
                ipmask: "",
                vlan_id: "",
                interface: ""
            },
            rules: {
                interface: [
                    {
                        validator: validator.validatorName,
                        trigger: ["change", "blur"]
                    }
                ],
                ipaddr: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                ipmask: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_id: [
                    {
                        validator: validator.validatorVlan,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getOutbound();
        this.getInbound();
    },
    methods: {
        getOutbound() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/system", params: { form: "outbound" } }),
                method: "get"
            })
                .then(res => {
                    this.outbound = "";
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.outbound = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getInbound() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/system", params: { form: "inbound" } }),
                method: "get"
            })
                .then(res => {
                    this.inbound = "";
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.inbound = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openModal(data, flag) {
            this.configModal = true;
            this.modalFlag = flag;
            if (data) {
                this.$nextTick(_ => {
                    Object.keys(this.remoteForm).forEach(item => {
                        this.remoteForm[item] = data[item];
                    });
                });
            }
        },
        closeModal() {
            this.$refs["remote-mgmt-form"].resetFields();
            this.configModal = false;
            this.remoteForm.interface = "";
            this.remoteForm.vlan_id = "";
        },
        delInbound(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system",
                            params: { form: "inbound" }
                        }),
                        method: "delete",
                        param: {
                            interface: data.interface,
                            vlan_id: data.vlan_id
                        }
                    }).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success(this.langMap['delete_success']);
                            this.getInbound();
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err => {})
                })
                .catch(_ => {});
        },
        formatVlanif(row, column) {
            return row.interface || `vlanif-${row.vlan_id}`;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.modalFlag === "outbound") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/system",
                                params: { form: "outbound" }
                            }),
                            method: "set",
                            param: {
                                ipaddr: this.remoteForm.ipaddr,
                                ipmask: this.remoteForm.ipmask,
                                interface: "outbound"
                            }
                        };
                    }
                    if (this.modalFlag === "inbound") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/system",
                                params: { form: "inbound" }
                            }),
                            method: "set",
                            param: {
                                ipaddr: this.remoteForm.ipaddr,
                                ipmask: this.remoteForm.ipmask,
                                interface: this.remoteForm.interface,
                                vlan_id: this.remoteForm.vlan_id
                            }
                        };
                    }
                    if (this.modalFlag === "add") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/system",
                                params: { from: "inbound" }
                            }),
                            method: "add",
                            param: {
                                ipaddr: this.remoteForm.ipaddr,
                                ipmask: this.remoteForm.ipmask,
                                vlan_id: this.remoteForm.vlan_id
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                this.remoteForm.interface === "outbound"
                                    ? this.getOutbound()
                                    : this.getInbound();
                            }else{
                                this.$message.error(res.data.message);
                            }
                            this.closeModal();
                        })
                        .catch(err => {});
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
