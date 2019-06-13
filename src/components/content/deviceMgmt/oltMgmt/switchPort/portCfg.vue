<template>
    <div>
        <port-nav @port-change="portChange" type="port">
            <template slot="title">{{ langMap['port_cfg'] }}</template>
        </port-nav>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-card>
                    <div slot="header">
                        <span>{{ langMap['sw_port_cfg'] }}</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="openDialog(basicInfo, 'basic')"
                        >{{ langMap['config'] }}</el-button>
                    </div>
                    <template v-for="(item, key) in basicInfo" v-if="key !== 'port_id'">
                        <el-row style="margin: 10px 0;">
                            <el-col :span="12">{{ langMap[key] }}</el-col>
                            <el-col :span="12">{{ formatData(item, key) }}</el-col>
                        </el-row>
                    </template>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div slot="header">
                        <span>{{ langMap['stormctrl'] }}</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="openDialog(storm, 'storm')"
                        >{{ langMap['config'] }}</el-button>
                    </div>
                    <template v-for="(item, key) in storm" v-if="key !== 'port_id'">
                        <el-row style="margin: 10px 0;">
                            <el-col :span="12">{{ langMap[key] }}</el-col>
                            <el-col :span="12">{{ item }} pps</el-col>
                        </el-row>
                    </template>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div slot="header">
                        <span>{{ langMap['mirror'] }}</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="openDialog(mirror, 'mirror')"
                        >{{ langMap['config'] }}</el-button>
                    </div>
                    <template v-for="(item, key) in mirror" v-if="key !== 'src_port'">
                        <el-row style="margin: 10px 0;">
                            <el-col :span="12">{{ langMap[key] }}</el-col>
                            <el-col :span="12">{{ formatData(item, key) }}</el-col>
                        </el-row>
                    </template>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">add</span>
            <port-cfg-form :info="info" :flag="dialogFlag" ref="port-config-dialog"></port-cfg-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm">{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import portCfgForm from "./portCfgForm";
export default {
    name: "portConfig",
    components: { portCfgForm },
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            port_id: 1,
            basicInfo: {},
            storm: {},
            mirror: {},
            mirrorType: { 1: "ingress", 2: "egress", 3: "all" },
            dialogVisible: false,
            dialogFlag: "basic",
            cacheData: {},
            info: {}
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
            this.getBasicInfo(port_id);
            this.getStormInfo(port_id);
            this.getMirror(port_id);
        },
        getBasicInfo(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "port_info", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.basicInfo = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.basicInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getStormInfo(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "stormctrl", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.storm = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.storm = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getMirror(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_port",
                    params: { form: "mirror", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.mirror = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatData(item, key) {
            if (
                key === "admin_status" ||
                key === "auto_neg" ||
                key === "flow_ctrl"
            ) {
                return item ? this.langMap["enable"] : this.langMap["disable"];
            }
            if (key === "link_status") {
                return item
                    ? this.langMap["link_up"]
                    : this.langMap["link_down"];
            }
            if (key === "duplex") {
                return item ? this.langMap["full"] : this.langMap["half"];
            }
            if (key === "dst_port") {
                return item ? this.port_name[item] : " - ";
            }
            if (key === "type") {
                return item ? this.mirrorType[item] : " - ";
            }
            if (key === "erate" || key === "irate") {
                return item + " Kbps";
            }
            return item;
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.info = Object.assign({ port_id: this.port_id }, data);
            });
            this.cacheData = data;
            this.dialogFlag = flag;
        },
        submitForm() {
            var basicFlag = {
                admin_status: 0x01,
                auto_neg: 0x02,
                speed: 0x40,
                duplex: 0x04,
                flow_ctrl: 0x18,
                mtu: 0x80,
                erate: 0x100,
                irate: 0x200,
                pvid: 0x400
            };
            var stormFlag = {
                broadcast: 0x04,
                multicast: 0x02,
                unicast: 0x01
            };
            var valid = this.$refs["port-config-dialog"].validForm();
            if (valid) {
                var flags = 0,
                    formData = this.$refs["port-config-dialog"].formData,
                    data;
                if (this.dialogFlag === "basic") {
                    Object.keys(basicFlag).forEach(item => {
                        if (this.cacheData[item] !== formData[item]) {
                            flags |= basicFlag[item];
                        }
                    });
                    if (!flags) {
                        return this.$message.info(this.langMap["modify_tips"]);
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_port",
                            params: { form: "port_info" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            flags,
                            admin_status: formData.admin_status,
                            auto_neg: formData.auto_neg,
                            speed: formData.speed,
                            duplex: formData.duplex,
                            flow_ctrl: formData.flow_ctrl,
                            mtu: formData.mtu,
                            erate: formData.erate,
                            irate: formData.irate,
                            pvid: formData.pvid
                        }
                    };
                }
                if (this.dialogFlag === "storm") {
                    Object.keys(stormFlag).forEach(item => {
                        if (this.cacheData[item] !== formData[item]) {
                            flags |= stormFlag[item];
                        }
                    });
                    if (!flags) {
                        return this.$message.info(this.langMap["modify_tips"]);
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_port",
                            params: { form: "stormctrl" }
                        }),
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            flags,
                            broadcast: formData.broadcast,
                            multicast: formData.multicast,
                            unicast: formData.unicast
                        }
                    };
                }
                if (this.dialogFlag === "mirror") {
                    if (!formData.dst_port || !formData.type) {
                        this.dialogVisible = false;
                        return;
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_port",
                            params: { form: "mirror" }
                        }),
                        method: "set",
                        param: {
                            src_port: this.port_id,
                            dst_port: formData.dst_port,
                            type: formData.type
                        }
                    };
                }
                this.$devProxy(data).then(res =>{
                    if(res.data.code === 1){
                        this.$message.success(this.langMap[data.method + '_success']);
                        this.dialogFlag === "basic" && this.getBasicInfo(this.port_id);
                        this.dialogFlag === "storm" && this.getStormInfo(this.port_id);
                        this.dialogFlag === "mirror" && this.getMirror(this.port_id);
                    }else{
                        this.$message.error(res.data.message);
                    }
                    this.dialogVisible = false;
                }).catch(err =>{})
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
