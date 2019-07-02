<template>
    <el-row>
        <el-col :span="4">
            <onu-aside @menu-change="menuChange" v-if="updateData"></onu-aside>
        </el-col>
        <el-col :span="20">
            <onu-content :show-content="contentFlag" v-if="updateData" style="margin-left: 20px;"></onu-content>
        </el-col>
    </el-row>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import onuAside from "./onuAside";
import onuContent from "./onuContent";
export default {
    name: "onuDetail",
    components: { onuAside, onuContent },
    computed: {
        ...mapState(["langMap", "port_name"])
    },
    props: {
        onuInfo: { type: Object },
        dev: { type: String },
        updateData: { type: Boolean },
        dev_ip: { type: String, required: true }
    },
    provide() {
        return {
            dev_ip: this.dev_ip,
            onuInfo: this.onuInfo,
            port_id: this.onuInfo.port_id,
            onu_id: this.onuInfo.onu_id
        };
    },
    data() {
        return {
            onu: {},
            contentFlag: ""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        ...mapMutations({
            updateProtName: "updatePortName",
            updateBasicInfo: "updateBasicInfo"
        }),
        getData() {
            this.$http
                .get("/api/device/epononu", {
                    params: {
                        devid: this.onuInfo.devid,
                        termid: this.onuInfo.termid
                    }
                })
                .then(res => {
                    this.onu = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.onu = res.data.data;
                            this.$emit("set-title", {
                                name:
                                    this.onu.name ||
                                    `ONU0${this.onu.port_id}/${
                                        this.onu.onu_id < 10
                                            ? "0" + this.onu.onu_id
                                            : this.onu.onu_id
                                    }`,
                                macaddr: this.onu.macaddr
                                //ipaddr: this.dev_ip
                            });
                            this.getBasicInfo();
                        }
                    } else {
                        this.$emit("set-title", null);
                    }
                })
                .catch(err => {});
        },
        getBasicInfo() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/board", params: { info: "system" } }),
                method: "get"
            })
                .then(res => {
                    this.oltBasicInfo = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.updateProtName(
                                this.formatPortName(res.data.data)
                            );
                            this.updateBasicInfo(res.data.data);
                        }
                    }
                })
                .catch(err => {});
        },
        formatPortName(data) {
            var pon = data.ponports,
                ge = data.geports,
                xge = data.xgeports,
                result = {};
            for (var i = 1; i <= pon; i++) {
                result[i] = `PON${i < 10 ? "0" + i : i}`;
            }
            for (var i = 1 + pon; i <= pon + ge; i++) {
                result[i] = `GE${i - pon < 10 ? "0" + (i - pon) : i - pon}`;
            }
            if (xge) {
                for (var i = pon + ge + 1; i <= pon + ge + xge; i++) {
                    result[i] = `XGE${
                        i - pon - ge < 10 ? "0" + (i - pon - ge) : i - pon - ge
                    }`;
                }
            }
            return result;
        },
        menuChange(val) {
            this.contentFlag = val;
        }
    },
    watch: {
        updateData() {
            if (this.updateData) {
                this.getData();
            } else {
                this.$emit("set-title", null);
                //this.contentFlag = "running_status";
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
