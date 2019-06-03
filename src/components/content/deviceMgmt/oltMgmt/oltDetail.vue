<template>
    <el-row :gutter="20">
        <el-col :span="4">
            <dev-aside @menu-change="menuChange" v-if="updateData"></dev-aside>
        </el-col>
        <el-col :span="20">
            <dev-content :show-content="contentFlag" v-if="updateData && dev_ip"></dev-content>
        </el-col>
    </el-row>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import devAside from "./devAside";
import devContent from "./devContent";
export default {
    name: "oltDetail",
    props: ["oltInfo", "dev", "updateData"],
    components: { devAside, devContent },
    computed: {
        ...mapState(["langMap", "port_name"])
    },
    data() {
        return {
            olt: "",
            dev_ip: "",
            oltBasicInfo: {},
            contentFlag: "running_status"
        };
    },
    created() {
        this.getData();
    },
    methods: {
        ...mapMutations({
            updateProtName: "updatePortName",
            updateDevIP: "updateDevIP",
            updateBasicInfo: 'updateBasicInfo'
        }),
        getData() {
            this.$http
                .get("/api/device/olt", {
                    params: { devid: this.oltInfo.devid }
                })
                .then(res => {
                    this.olt = "";
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.olt = res.data.data;
                            this.dev_ip = this.olt.current_ipaddr;
                            this.updateDevIP(this.dev_ip);
                            this.$emit("set-title", {
                                name: this.olt.name,
                                ipaddr: this.olt.current_ipaddr,
                                macaddr: this.olt.macaddr
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
                            this.oltBasicInfo = res.data.data;
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
        menuChange(name) {
            this.contentFlag = name;
        }
    },
    watch: {
        updateData() {
            if (this.updateData) {
                this.getData();
            } else {
                this.$emit("set-title", null);
                this.contentFlag = "running_status";
            }
        }
    },
    beforeDestroy() {}
};
</script>

<style lang="less" scoped>
</style>
