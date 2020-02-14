<template>
    <div>
        <div class="dhcp-server-item">
            <span>{{ langMap['server_admin'] }}</span>
            <span>{{ admin ? langMap['enable'] : langMap['disable'] }}</span>
            <el-button
                type="primary"
                size="small"
                @click="changeState"
            >{{ admin ? langMap['off'] : langMap['on'] }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                v-if="admin"
                @click="openDialog('config')"
            >{{ langMap['config'] }}</el-button>
        </div>
        <template v-if="admin">
            <div class="dhcp-server-item">
                <span>{{ langMap['interface'] }}</span>
                <span>{{ getInterface(data.interface) }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('interface')"
                >{{ langMap['config'] }}</el-button>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['ipaddress_s'] }}</span>
                <span>{{ data.ipaddress_s }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['ipaddress_e'] }}</span>
                <span>{{ data.ipaddress_e }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['ipmask'] }}</span>
                <span>{{ data.ipmask }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['pridns'] }}</span>
                <span>{{ data.pridns }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['secdns'] }}</span>
                <span>{{ data.secdns }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['gateway'] }}</span>
                <span>{{ data.gateway }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ langMap['lease_time'] }}</span>
                <span>{{ data.lease_time }}</span>
            </div>
        </template>
        <el-dialog :visible.sync="dialogVisible" :title="langMap['config']" append-to-body>
            <dhcp-server-form
                :data="data"
                :inbound="inbound"
                :type="dialogType"
                ref="dhcp-server-form"
            ></dhcp-server-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-server-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import dhcpServerForm from "./dhcpServerForm";
export default {
    name: "dhcpServer",
    components: { dhcpServerForm },
    computed: {
        ...mapState(["dev_ip", "langMap"]),
        admin() {
            return this.data.server_admin;
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            inbound: [],
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getInbound();
    },
    methods: {
        getInbound() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/system", params: { form: "inbound" } }),
                method: "get"
            })
                .then(res => {
                    this.inbound = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.inbound = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getInterface(vlan_id) {
            const result = this.inbound.filter(
                item => item.vlan_id === vlan_id
            )[0];
            return result ? (result.interface ? result.interface : "-") : "-";
        },
        changeState() {
            const msg = `${this.langMap["if_sure"]}${
                this.admin ? this.langMap["close"] : this.langMap["open"]
            } DHCP Server`;
            this.$confirm(msg)
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: "/switch_dhcp?form=server_admin",
                        method: "set",
                        param: {
                            server_admin: !this.admin >>> 0
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.$emit("refreshData");
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openDialog(type) {
            if (!this.inbound.length) {
                this.$confirm(this.langMap["none_inbound_tips"])
                    .then(_ => {
                        this.$router.push("/remote_mgmt");
                    })
                    .catch(_ => {});
            } else {
                this.dialogVisible = true;
                this.dialogType = type;
                this.$nextTick(_ => {
                    this.$refs["dhcp-server-form"].init();
                });
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const ACTIONS = {
                        interface(data) {
                            if (data.interface === this.data.interface) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=server_cfg",
                                param: {
                                    flags: 0x04,
                                    interface: data.interface
                                }
                            };
                        },
                        config(data) {
                            const flags = {
                                ipaddress_s: 0x01,
                                ipaddress_e: 0x01,
                                ipmask: 0x02,
                                pridns: 0x08,
                                secdns: 0x08,
                                gateway: 0x10,
                                lease_time: 0x20
                            };
                            const flag = Object.keys(flags).reduce(
                                (prev, key) => {
                                    if (data[key] !== this.data[key]) {
                                        if (
                                            (prev & flags[key]) !==
                                            flags[key]
                                        ) {
                                            prev |= flags[key];
                                        }
                                    }
                                    return prev;
                                },
                                0
                            );
                            if (flag === 0) {
                                this.$message.info(this.langMap["modify_tips"]);
                                this.dialogVisible = false;
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=server_cfg",
                                param: {
                                    flags: flag,
                                    ipaddress_s: data.ipaddress_s,
                                    ipaddress_e: data.ipaddress_e,
                                    ipmask: data.ipmask,
                                    pridns: data.pridns,
                                    secdns:
                                        data.secdns === ""
                                            ? "0.0.0.0"
                                            : data.secdns,
                                    gateway: data.gateway,
                                    lease_time: data.lease_time
                                }
                            };
                        }
                    };
                    if (typeof ACTIONS[this.dialogType] === "function") {
                        const data = ACTIONS[this.dialogType].call(
                            this,
                            formData
                        );
                        if (data) {
                            this.sendData(
                                Object.assign(
                                    {
                                        method: "set",
                                        devicelist: [this.dev_ip]
                                    },
                                    data
                                )
                            );
                        }
                    }
                }
            });
        },
        sendData(data) {
            this.$devProxy(data)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.$emit("refreshData");
                    } else {
                        this.$message.error(res.data.message);
                    }
                    this.dialogVisible = false;
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-server-item {
    margin: 20px 10px;
    span {
        display: inline-block;
        &:first-child {
            width: 160px;
        }
        & + span {
            width: 200px;
        }
    }
}
</style>