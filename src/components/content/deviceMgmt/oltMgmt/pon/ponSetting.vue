<template>
    <div>
        <h3>{{ langMap['pon_auth'] }}</h3>
        <el-table :data="authData" border>
            <el-table-column :formatter="formatName" :label="langMap['port_id']" width="80"></el-table-column>
            <el-table-column :label="langMap['auth_type']">
                <template slot-scope="scope">{{ def_auth_type[scope.row.auth_type] }}</template>
            </el-table-column>
            <el-table-column :label="langMap['auth_mode']">
                <template slot-scope="scope">{{ def_auth_mode[scope.row.auth_mode] }}</template>
            </el-table-column>
            <el-table-column :label="langMap['config']" fixed="right" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{ langMap['config'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <h3>P2P</h3>
        <el-table :data="p2p" border>
            <el-table-column :formatter="formatName" :label="langMap['port_id']"></el-table-column>
            <el-table-column :label="langMap['status']">
                <template
                    slot-scope="scope"
                >{{ scope.row.flag ? langMap['enable'] : langMap['disable'] }}</template>
            </el-table-column>
            <el-table-column :label="langMap['config']" fixed="right" width="100">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="changeP2PStatus(scope.row)"
                    >{{ scope.row.flag ? langMap['off'] : langMap['on'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <h3 style="margin-top: 30px;">
            <span style="margin-right: 30px;">{{ langMap['port_isolation'] }}</span>
            <el-popover placement="top" width="160" v-model="visible" trigger="manual">
                <p>{{ `${langMap['if_sure']}${ port_isolat ? langMap['off'] : langMap['on'] }` }}</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible = false">{{ langMap['cancel'] }}</el-button>
                    <el-button type="primary" size="mini" @click="submitIsolat">{{ langMap['apply'] }}</el-button>
                </div>
                <el-switch 
                    ref="isolat-status"
                    slot="reference"
                    active-color="#13ce66"
                    @change="changeIsolat"
                    :value="port_isolat"
                    :active-text="langMap['enable']"
                    :inactive-text="langMap['disable']"
                ></el-switch>
            </el-popover>
        </h3>
        <el-dialog
            :title="langMap['pon_auth']"
            :visible.sync="dialogVisible"
            width="450px"
            append-to-body
        >
            <el-form :model="authForm" label-width="120px">
                <el-form-item :label="langMap['port_id']">
                    <span style="margin-left: 16px;">{{ port_name[authForm.port_id] }}</span>
                </el-form-item>
                <el-form-item :label="langMap['auth_type']">
                    <el-select v-model.number="authForm.auth_type" style="width: 200px;">
                        <template v-for="(item, index) in def_auth_type">
                            <el-option :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['auth_mode']">
                    <el-select v-model.number="authForm.auth_mode" style="width: 200px;">
                        <template v-for="(item, index) in def_auth_mode">
                            <el-option :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm()">{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "ponSetting",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            port_id: 1,
            def_auth_type: ["Auto", "Manual"],
            def_auth_mode: ["mac", "LOID", "Loid+password", "hybrid"],
            authData: [],
            dialogVisible: false,
            authForm: {
                port_id: 1,
                auth_type: 0,
                auth_mode: 0
            },
            p2p: [],
            port_isolat: 0,
            visible: false
        };
    },
    created() {
        this.getAuth();
        this.getP2P();
        this.getIsolat();
    },
    methods: {
        getAuth() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "authorize" }
                }),
                method: "get"
            })
                .then(res => {
                    this.authData = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.authData = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getP2P() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "p2p" }
                }),
                method: "get"
            })
                .then(res => {
                    this.p2p = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.p2p = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getIsolat() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_isolate",
                    params: { form: "isolate" }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.port_isolat = 0;
                        if (res.data.data) {
                            this.port_isolat = !!res.data.data.isolate_status;
                        }
                    }
                })
                .catch(err => {});
        },
        formatName(row, column) {
            return this.port_name[row.port_id];
        },
        openDialog(node) {
            this.dialogVisible = true;
            Object.keys(this.authForm).forEach(item => {
                this.authForm[item] = node[item];
            });
        },
        //  注册方式
        submitForm() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "authorize" }
                }),
                method: "set",
                param: {
                    port_id: this.authForm.port_id,
                    auth_type: this.authForm.auth_type,
                    auth_mode: this.authForm.auth_mode
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(this.langMap["set_success"]);
                        this.getAuth();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .catch(err => {});
            this.dialogVisible = false;
        },
        changeP2PStatus(node) {
            this.$confirm(
                this.langMap["if_sure"] +
                    (node.flag ? this.langMap["off"] : this.langMap["on"]),
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/ponmgmt",
                            params: { form: "p2p" }
                        }),
                        method: "set",
                        param: {
                            port_id: node.port_id,
                            flag: Number(!node.flag)
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getP2P();
                            } else {
                                this.$message(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        changeIsolat(val){
            this.visible = true;
        },
        submitIsolat(){
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_isolate",
                    params: { form: "isolate" }
                }),
                method: "set",
                param: {
                    isolat_status: Number(!this.$refs['isolat-status'].value)
                }
            }).then(res =>{
                if(res.data.code === 1){
                    this.$message.success(this.langMap['set_success']);
                    this.getIsolat();
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch(err =>{})
            this.visible = false;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
