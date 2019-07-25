<template>
    <div>
        <port-nav
            @port-change="portChange"
            :onu="activeName === 'pon-optical'"
            @onu-change="onuChange"
        >
            <template slot="title">{{ langMap['pon_optical'] }}</template>
        </port-nav>
        <el-tabs type="card" v-model="activeName">
            <el-tab-pane :label="langMap['pon_optical']" name="pon-optical">
                <div>
                    <p style="margin-bottom: 30px;">{{ langMap['pon_optical_tips'] }}</p>
                    <template v-for="(item,key) in onuOptical">
                        <el-row style="margin: 10px 0;">
                            <el-col :span="4">{{ langMap[key] }}</el-col>
                            <el-col :span="3">{{ item }}</el-col>
                        </el-row>
                    </template>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="langMap['onu_optical_diagnose']" name="onu-optical">
                <el-table :data="ponOptical" stripe>
                    <el-table-column :formatter="formatName" :label="langMap['onu_id']"></el-table-column>
                    <el-table-column prop="work_temprature" :label="langMap['work_temprature']"></el-table-column>
                    <el-table-column prop="work_voltage" :label="langMap['work_voltage']"></el-table-column>
                    <el-table-column prop="transmit_bias" :label="langMap['transmit_bias']"></el-table-column>
                    <el-table-column prop="transmit_power" :label="langMap['transmit_power']"></el-table-column>
                    <el-table-column prop="receive_power" :label="langMap['receive_power']"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "ponOptical",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip", "timestamp"])
    },
    data() {
        return {
            port_id: 1,
            onu_id: 1,
            //  pon口下单独onu的诊断信息
            onuOptical: {},
            //  pon口下所有onu的诊断信息
            ponOptical: [],
            activeName: "pon-optical"
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.activeName === "onu-optical" &&
                this.getPonOptical(this.port_id);
        },
        onuChange(port_id, onu_id) {
            this.port_id = port_id;
            this.onu_id = onu_id;
            this.activeName === "pon-optical" &&
                this.getOnuOptical(this.port_id, this.onu_id);
            this.activeName === "onu-optical" &&
                this.getPonOptical(this.port_id);
        },
        getOnuOptical(port_id, onu_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "optical_pon", port_id, onu_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.onuOptical = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.onuOptical = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getPonOptical(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/ponmgmt",
                    params: { form: "optical_onu", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.ponOptical = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.ponOptical = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatName(row, column) {
            return row.onu_name
                ? row.onu_name
                : `ONU${row.port_id}/${
                      row.onu_id < 10 ? "0" + row.onu_id : row.onu_id
                  }`;
        }
    },
    watch: {
        activeName() {
            this.activeName === "pon-optical" &&
                this.getOnuOptical(this.port_id, this.onu_id);
            this.activeName === "onu-optical" &&
                this.getPonOptical(this.port_id);
        },
        timestamp() {
            this.activeName === "pon-optical" &&
                this.getOnuOptical(this.port_id, this.onu_id);
            this.activeName === "onu-optical" &&
                this.getPonOptical(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
