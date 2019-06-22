<template>
    <div>
        <h3>
            {{ langMap['packet_filter'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('add')"
            >{{ langMap['add'] }}</el-button>
            <el-button
                type="primary"
                size="small"
                @click="openDialog('delete')"
            >{{ langMap['delete'] }}</el-button>
        </h3>
        <el-table :data="pkTable" border stripe>
            <el-table-column prop="acl_id" label="ACL ID" width="80px"></el-table-column>
            <el-table-column prop="rule_id" label="Rule ID" width="80px"></el-table-column>
            <el-table-column
                prop="state"
                :formatter="formatState"
                :label="langMap['state']"
                width="120px"
            ></el-table-column>
            <el-table-column prop="port_list" :label="langMap['port_list']" :formatter="formatPort"></el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="100"
            layout="total, prev, pager, next, jumper"
            :total="pkList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap[dialogFlag] }}</span>
            <el-form
                :model="formData"
                :rules="formRules"
                label-width="140px"
                ref="packet-filter-form"
            >
                <el-form-item label="ACL ID" prop="acl_id">
                    <el-input v-model.number="formData.acl_id"></el-input>
                </el-form-item>
                <el-form-item label="Rule ID" prop="rule_id">
                    <el-input v-model.number="formData.rule_id"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['port_list']" prop="port_list">
                    <el-select v-model="formData.port_list" multiple>
                        <template v-for="(item, index) in port_name">
                            <el-option :value="Number(index)" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('packet-filter-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { analysisPortList, generatorPortName } from "@/utils/common";
export default {
    name: "packetFilter",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            pkList: [],
            pkTable: [],
            currentPage: 1,
            pageSize: 20,
            dialogVisible: false,
            dialogFlag: "",
            formData: {
                acl_id: "",
                rule_id: "",
                port_list: []
            },
            formRules: {
                acl_id: [
                    {
                        validator: this.validRange(2000, 5999),
                        trigger: ["change", "blur"]
                    }
                ],
                rule_id: [
                    {
                        validator: this.validRange(0, 16, true),
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_pkfilter"
                }),
                method: "get"
            }).then(res => {
                this.pkList = [];
                this.pkTable = [];
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        this.pkList = res.data.data;
                        if (
                            this.currentPage >
                            Math.ceil(this.pkList.length / this.pageSize)
                        ) {
                            this.currentPage = Math.ceil(
                                this.pkList.length / this.pageSize
                            );
                        }
                        var start = (this.currentPage - 1) * this.pageSize;
                        if (start + this.pageSize > this.pkList.length) {
                            this.pkTable = this.pkList.slice(start);
                        } else {
                            this.pkTable = this.pkList.slice(
                                start,
                                start + this.pageSize
                            );
                        }
                    }
                }
            });
        },
        currentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.pkList.length) {
                this.pkTable = this.pkList.slice(start);
            } else {
                this.pkTable = this.pkList.slice(start, start + this.pageSize);
            }
        },
        formatState(row, col) {
            return row[col.property] ? "Running" : "Not running";
        },
        formatPort(row, col) {
            return generatorPortName(
                analysisPortList(row[col.property]),
                this.port_name
            );
        },
        openDialog(flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_pkfilter",
                            params: { form: "inbound" }
                        }),
                        method: this.dialogFlag === "add" ? "set" : "delete",
                        param: {
                            acl_id: this.formData.acl_id,
                            rule_id: this.formData.rule_id,
                            port_list: this.formData.port_list.join(",")
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[
                                        (this.dialogFlag === "add"
                                            ? "set"
                                            : "delete") + "_success"
                                    ]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                            this.dialogVisible = false;
                        })
                        .catch(err => {});
                }
            });
        },
        closeDialog() {
            this.$refs["packet-filter-form"].resetFields();
        },
        validRange(min, max, flag) {
            return (rule, value, cb) => {
                if (value === "" && flag) {
                    return cb();
                }
                if (value < min || value > max || isNaN(value)) {
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            };
        }
    }
};
</script>

<style lang="less" scoped>
</style>
