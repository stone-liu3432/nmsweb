<template>
    <div>
        <port-nav @port-change="portChange">
            <template slot="title">{{ langMap['sla_cfg'] }}</template>
        </port-nav>
        <el-table :data="bandwidth" border stripe>
            <el-table-column :formatter="formatName" :label="langMap['onu_id']" width="180"></el-table-column>
            <el-table-column prop="sla_type" :label="langMap['sla_type']"></el-table-column>
            <el-table-column :formatter="formatFix" :label="langMap['fix']"></el-table-column>
            <el-table-column :formatter="formatAssure" :label="langMap['assure']"></el-table-column>
            <el-table-column :formatter="formatMax" :label="langMap['max']"></el-table-column>
            <el-table-column fixed="right" width="100" :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="openDialog(scope.row)"
                    >{{ langMap['config'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="langMap['config']"
            :visible.sync="dialogVisible"
            @close="dialogClose"
            append-to-body
        >
            <el-form
                :model="cfgForm"
                ref="bandwidth-config-form"
                :rules="cfgRules"
                label-width="120px"
            >
                <el-form-item :label="langMap['onu_id']">
                    <span
                        style="margin-left: 10px;"
                    >{{ `ONU${cacheData.port_id}/${cacheData.onu_id < 10 ? '0' + cacheData.onu_id : cacheData.onu_id}` }}</span>
                </el-form-item>
                <el-form-item :label="langMap['sla_type']">
                    <el-select v-model="cfgForm.sla_type" style="width: 200px;">
                        <template v-for="(item, index) in 5">
                            <el-option :value="'type' + item"></el-option>
                        </template>
                    </el-select>
                    <el-popover placement="right" width="400" trigger="hover">
                        <el-table :data="typeTips">
                            <el-table-column
                                width="100"
                                property="sla_type"
                                :label="langMap['sla_type']"
                            ></el-table-column>
                            <el-table-column width="100" property="fix" :label="langMap['fix']">
                                <template slot-scope="scope">
                                    <i :class="{ 'el-icon-check': scope.row.fix }"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="100"
                                property="assure"
                                :label="langMap['assure']"
                            >
                                <template slot-scope="scope">
                                    <i :class="{ 'el-icon-check': scope.row.assure }"></i>
                                </template>
                            </el-table-column>
                            <el-table-column width="100" property="max" :label="langMap['max']">
                                <template slot-scope="scope">
                                    <i :class="{ 'el-icon-check': scope.row.max }"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <i
                            slot="reference"
                            class="el-icon-info"
                            style="font-size: 24px;vertical-align: sub;margin-left: 16px;"
                        ></i>
                    </el-popover>
                </el-form-item>
                <el-form-item :label="langMap['fix']" prop="fix">
                    <el-input
                        v-model.number="cfgForm.fix"
                        :disabled="cfgForm.sla_type === 'type2' || cfgForm.sla_type === 'type3' || cfgForm.sla_type === 'type4'"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="langMap['assure']" prop="assure">
                    <el-input
                        v-model.number="cfgForm.assure"
                        :disabled="cfgForm.sla_type === 'type1' || cfgForm.sla_type === 'type4'"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="langMap['max']" prop="max">
                    <el-input
                        v-model.number="cfgForm.max"
                        :disabled="cfgForm.sla_type === 'type1' || cfgForm.sla_type === 'type2'"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('bandwidth-config-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "slaCfg",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            port_id: 1,
            bandwidth: [],
            dialogVisible: false,
            cacheData: {},
            cfgForm: {
                sla_type: "type1",
                fix: "",
                assure: "",
                max: ""
            },
            cfgRules: {
                fix: [
                    {
                        validator: this.validBandwidth,
                        trigger: ["change", "blur"]
                    }
                ],
                assure: [
                    {
                        validator: this.validBandwidth,
                        trigger: ["change", "blur"]
                    }
                ],
                max: [
                    {
                        validator: this.validBandwidth,
                        trigger: ["change", "blur"]
                    }
                ]
            },
            typeTips: [
                { sla_type: "type1", fix: true },
                { sla_type: "type2", assure: true },
                { sla_type: "type3", assure: true, max: true },
                { sla_type: "type4", max: true },
                { sla_type: "type5", fix: true, assure: true, max: true }
            ]
        };
    },
    created() {},
    methods: {
        portChange(port_id) {
            this.getData(port_id);
            this.port_id = port_id;
        },
        getData(port_id) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onu_bandwidth",
                    params: { port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.bandwidth = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.bandwidth = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatName(row, column) {
            return `ONU${row.port_id}/${
                row.onu_id < 10 ? "0" + row.onu_id : row.onu_id
            }`;
        },
        formatFix(row, column) {
            return row.sla_type === "type1" || row.sla_type === "type5"
                ? row.fix
                : " - ";
        },
        formatAssure(row, column) {
            return row.sla_type === "type2" ||
                row.sla_type === "type3" ||
                row.sla_type === "type5"
                ? row.assure
                : " - ";
        },
        formatMax(row, column) {
            return row.sla_type === "type3" ||
                row.sla_type === "type4" ||
                row.sla_type === "type5"
                ? row.max
                : " - ";
        },
        openDialog(node) {
            this.dialogVisible = true;
            this.cacheData = node;
            Object.keys(this.cfgForm).forEach(item => {
                this.cfgForm[item] = node[item];
            });
        },
        dialogClose() {
            this.$refs["bandwidth-config-form"].resetFields();
        },
        validBandwidth(rule, value, callback) {
            if (this.cfgForm.sla_type === "type1") {
                if (rule.field === "assure" || rule.field === "max") {
                    return callback();
                }
            }
            if (this.cfgForm.sla_type === "type2") {
                if (rule.field === "fix" || rule.field === "max") {
                    return callback();
                }
            }
            if (this.cfgForm.sla_type === "type3") {
                if (rule.field === "fix") {
                    return callback();
                }
            }
            if (this.cfgForm.sla_type === "type4") {
                if (rule.field === "assure" || rule.field === "fix") {
                    return callback();
                }
            }
            if (value < 1 || value > 1000000 || isNaN(value)) {
                return callback(new Error("range: 1-1000000 kbs"));
            }
            callback();
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/onu_bandwidth"
                        }),
                        method: "set",
                        param: {
                            port_id: this.cacheData.port_id,
                            onu_id: this.cacheData.onu_id,
                            sla_type: this.cfgForm.sla_type,
                            fix: this.cfgForm.fix,
                            assure: this.cfgForm.assure,
                            max: this.cfgForm.max
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getData(this.port_id);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                    this.dialogVisible = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
