<template>
    <div>
        <h3>{{ langMap['op_multicast'] }}</h3>
        <el-row style="height: 36px; line-height: 36px;">
            <el-col :span="4">{{ langMap['port_id'] }}</el-col>
            <el-col :span="4">
                <el-select v-model="op_id" size="small">
                    <template v-for="item in mcCfg">
                        <el-option :value="item.op_id"></el-option>
                    </template>
                </el-select>
            </el-col>
        </el-row>
        <div style="height: 1px;"></div>
        <el-row style="height: 36px; line-height: 36px;">
            <el-col :span="4">{{ langMap['group_num_max'] }}</el-col>
            <el-col :span="4">{{ mcEthInfo.group_num_max }}</el-col>
            <el-col :span="4">
                <el-button
                    size="mini"
                    type="primary"
                    @click="setGroupNumMax"
                >{{ langMap['config'] }}</el-button>
            </el-col>
        </el-row>
        <el-row style="height: 36px; line-height: 36px;">
            <el-col :span="4">{{ langMap['tag_mode'] }}</el-col>
            <el-col :span="4">{{ tagModes[mcEthInfo.tag_mode] }}</el-col>
            <el-col :span="4">
                <el-button
                    size="mini"
                    type="primary"
                    @click="openDialog('tag-mode')"
                >{{ langMap['config'] }}</el-button>
            </el-col>
        </el-row>
        <el-row style="height: 36px; line-height: 36px;">
            <el-col :span="4">{{ langMap['mvlan'] }}</el-col>
            <el-col :span="4">{{ mvInfo.toString() || ' - ' }}</el-col>
            <el-col :span="8">
                <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('add-mvlan')"
                >{{ langMap['add'] + langMap['mvlan'] }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    v-if="mvInfo.length"
                    @click="delMvlan"
                >{{ langMap['delete'] }}</el-button>
            </el-col>
        </el-row>
        <template v-if="tag_mode === 2">
            <h3 style="margin-top: 30px;">
                {{ langMap['mv_conversion_table'] }}
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('add-mv-translate')"
                >{{ langMap['add'] }}</el-button>
            </h3>
            <el-table :data="mvTranslate">
                <el-table-column label="svlan" prop="svlan"></el-table-column>
                <el-table-column label="cvlan" prop="cvlan"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="delTranslate(scope.row)"
                        >{{ langMap['delete'] }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ dialogTitle }}</span>
            <onu-mvlan-form :form-flag="dialogFlag" ref="onu-multi-vlan-config"></onu-mvlan-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('onu-multi-vlan-config')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import onuMvlanForm from "./onuMvlanForm";
export default {
    name: "onuMvlan",
    components: { onuMvlanForm },
    computed: {
        ...mapState(["langMap"]),
        dialogTitle() {
            if (
                this.dialogFlag === "add-mvlan" ||
                this.dialogFlag === "add-mv-translate"
            ) {
                return this.langMap["add"];
            }
            return this.langMap["config"];
        }
    },
    inject: ["dev_ip", "onuInfo", "port_id", "onu_id"],
    data() {
        return {
            mcCfg: [],
            mvList: [],
            //  当前 op id 下的vlan转换表
            mvTranslate: [],
            //  当前 op id 的组播配置
            mcEthInfo: {},
            //  当前 op id 下的mvlan列表
            mvInfo: [],
            tagModes: ["tag", "untag", "translate"],
            op_id: "",
            dialogVisible: false,
            dialogFlag: "",
            mvlan: 0,
            tag_mode: ""
        };
    },
    created() {
        this.getMcConfig();
        this.getMvList();
    },
    methods: {
        getMcConfig() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_eth_config",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.mcCfg = [];
                        if (res.data.data && res.data.data.length) {
                            this.mcCfg = res.data.data;
                            if (!this.op_id) {
                                this.op_id = this.mcCfg[0].op_id;
                            } else {
                                this.setOpData(this.op_id);
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getMvList() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_vlan",
                        port_id: this.port_id,
                        onu_id: this.onu_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.mvList = [];
                        if (res.data.data && res.data.data.length) {
                            this.mvList = res.data.data;
                            if (!this.op_id) {
                                this.op_id = this.mvList[0].op_id;
                            } else {
                                this.setOpData(this.op_id);
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getMvTranslate(op_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_translate",
                        port_id: this.port_id,
                        onu_id: this.onu_id,
                        op_id
                    }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.mvTranslate = [];
                        if (res.data.data && res.data.data.length) {
                            this.mvTranslate = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        //  根据 op id 来更改页面数据
        setOpData(op_id) {
            this.mcCfg.forEach(item => {
                if (item.op_id === op_id) {
                    this.mcEthInfo = item;
                    this.tag_mode = this.mcEthInfo.tag_mode;
                }
            });
            var mv = [];
            this.mvList.forEach(item => {
                if (item.op_id === op_id) {
                    mv.push(item.mvlan);
                }
            });
            this.mvInfo = mv;
        },
        setGroupNumMax() {
            this.$prompt(this.langMap["group_num_max"], this.langMap["tips"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                inputPattern: /^((\d?\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))$/,
                inputErrorMessage: "Range: 0 - 255"
            })
                .then(({ value }) => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "mc_group_max"
                            }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id: this.op_id,
                            group_num_max: value
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getMcConfig();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(() => {});
        },
        setTagMode(data) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_tag_mode"
                    }
                }),
                method: "set",
                param: {
                    port_id: this.port_id,
                    onu_id: this.onu_id,
                    op_id: this.op_id,
                    tag_mode: data.tag_mode,
                    svlan: data.svlan,
                    cvlan: data.cvlan
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.getMcConfig();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
        },
        openDialog(flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
        },
        submitForm(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var form = this.$refs[formName].formData;
                if (this.dialogFlag === "tag-mode") {
                    this.setTagMode(form);
                }
                if (this.dialogFlag === "add-mvlan") {
                    this.addMvlan(form);
                }
                if (this.dialogFlag === "add-mv-translate") {
                    this.addMvTranslate(form);
                }
                this.dialogVisible = false;
            }
        },
        addMvlan(data) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_vlan"
                    }
                }),
                method: "add",
                param: {
                    port_id: this.port_id,
                    onu_id: this.onu_id,
                    op_id: this.op_id,
                    mvlan: data.mvlan
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["add_success"]);
                        this.getMvList();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
        },
        addMvTranslate(data) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onumgmt",
                    params: {
                        form: "mc_tag_mode"
                    }
                }),
                method: "set",
                param: {
                    port_id: this.port_id,
                    onu_id: this.onu_id,
                    op_id: this.op_id,
                    tag_mode: data.tag_mode,
                    svlan: data.svlan,
                    cvlan: data.cvlan
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["add_success"]);
                        this.getMcConfig();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
        },
        delMvlan() {
            this.mvlan = this.mvInfo[0];
            this.$msgbox({
                title: this.langMap["delete"],
                message: (
                    <el-form label-width="140px" size="small">
                        <el-form-item label={this.langMap["mvlan"]}>
                            <select
                                value={this.mvlan}
                                on-change={e =>
                                    (this.mvlan = Number(e.target.value))
                                }
                                style="width: 200px; padding: 6px 0; text-indent: 6px; border-radius: 3px; border-color: #DCDFE6; color: #606266;"
                                key="onu-mc-mode-set"
                            >
                                {this.mvInfo.map(item => {
                                    return (
                                        <option
                                            value={item}
                                            label={item}
                                        ></option>
                                    );
                                })}
                            </select>
                        </el-form-item>
                    </el-form>
                ),
                showCancelButton: true,
                dangerouslyUseHTMLString: false,
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "mc_vlan"
                            }
                        }),
                        method: "delete",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id: this.op_id,
                            mvlan: this.mvlan
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getMvList();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        closeDialog() {
            this.$refs["onu-multi-vlan-config"].resetForm();
            this.dialogFlag = "";
        },
        delTranslate(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onumgmt",
                            params: {
                                form: "mc_tag_mode"
                            }
                        }),
                        method: "delete",
                        param: {
                            port_id: this.port_id,
                            onu_id: this.onu_id,
                            op_id: this.op_id,
                            tag_mode: 2,
                            svlan: data.svlan,
                            cvlan: data.cvlan
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getMvTranslate(this.op_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    },
    watch: {
        op_id() {
            this.setOpData(this.op_id);
        },
        tag_mode() {
            if (this.tag_mode === 2) {
                this.getMvTranslate(this.op_id);
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
