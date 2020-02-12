<template>
    <div>
        <div class="dhcp-option82">
            <span>{{ langMap['option82_admin'] }}:</span>
            <span>{{ admin ? langMap['enable'] : langMap['disable'] }}</span>
            <el-button
                type="primary"
                size="small"
                @click="openDialog('admin')"
            >{{ langMap['config'] }}</el-button>
        </div>
        <template v-if="admin">
            <div class="dhcp-option82">
                <span>{{ langMap['option82_policy'] }}:</span>
                <span>{{ langMap[policies[data.option82_policy]] }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('policy')"
                >{{ langMap['config'] }}</el-button>
            </div>
            <div class="dhcp-option82">
                <span>{{ langMap['option82_circuit'] }}:</span>
                <span>{{ circuits[data.option82_circuit] }}</span>
            </div>
            <div class="dhcp-option82">
                <span>{{ langMap['option82_remote'] }}:</span>
                <span>{{ remotes[data.option82_remote] }}</span>
            </div>
        </template>

        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ dialogTitle }}</div>
            <dhcp-option82-form :data="data" :type="dialogType" ref="dhcp-option82-form-ref"></dhcp-option82-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-option82-form-ref')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import dhcpOption82Form from "./dhcpOption82Form";
export default {
    name: "dhcpOption82",
    components: { dhcpOption82Form },
    computed: {
        ...mapState(["langMap", "dev_ip"]),
        admin() {
            return this.data.option82_admin;
        },
        policy() {
            return this.data.option82_policy;
        },
        dialogTitle() {
            if (this.dialogType === "admin") {
                return this.langMap["option82_admin"];
            }
            return this.langMap["option82_policy"];
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            policies: ["reserve", "drop", "replace"],
            circuits: ["", "VLAN+PORT"],
            remotes: ["", "OLT MAC"],
            dialogVisible: false,
            dialogType: ""
        };
    },
    methods: {
        openDialog(type) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                this.$refs["dhcp-option82-form-ref"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                const ACTIONS = {
                    admin(data) {
                        if (data.option82_admin === this.data.option82_admin) {
                            this.$message.info(this.langMap["modify_tips"]);
                            this.dialogVisible = false;
                            return;
                        }
                        return {
                            url: "/switch_dhcp?form=option82_admin",
                            param: {
                                option82_admin: data.option82_admin
                            }
                        };
                    },
                    policy(data) {
                        if (
                            data.option82_policy === this.data.option82_policy
                        ) {
                            this.$message.info(this.langMap["modify_tips"]);
                            this.dialogVisible = false;
                            return;
                        }
                        return {
                            url: "/switch_dhcp?form=option82_policy",
                            param: {
                                option82_policy: data.option82_policy
                            }
                        };
                    }
                };
                if (typeof ACTIONS[this.dialogType] === "function") {
                    const data = ACTIONS[this.dialogType].call(this, formData);
                    if (data) {
                        const _data = Object.assign(
                            {
                                method: "set",
                                devicelist: [this.dev_ip]
                            },
                            data
                        );
                        this.sendData(_data);
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
.dhcp-option82 {
    margin: 20px 10px;
    span {
        margin-right: 20px;
    }
}
</style>