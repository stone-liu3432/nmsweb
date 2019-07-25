<template>
    <div>
        <h3>{{ langMap['age'] }}</h3>
        <div style="margin: 30px 0;">
            <span>{{ langMap['age'] }}:</span>
            <span style="width: 120px;">{{ macAgeData.age }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="cfgMacAge"
            >{{ langMap['config'] }}</el-button>
        </div>
        <el-row>
            <el-col :span="4">
                <h3>{{ langMap['mac_mgmt'] }}</h3>
            </el-col>
            <el-col :span="12" style="line-height: 49px; margin-left: 30px;">
                <el-button
                    size="small"
                    type="primary"
                    @click="openDialog('add')"
                >{{ langMap['add_mac'] }}</el-button>
                <el-button
                    size="small"
                    type="primary"
                    @click="openDialog('flush')"
                >{{ langMap['flush_mac'] }}</el-button>
            </el-col>
        </el-row>
        <!-- mac地址查询 -->
        <el-form
            :model="query"
            inline
            size="small"
            style="margin: 20px 0"
            :rules="macRules"
            ref="mac-mgmt-query-form"
        >
            <el-form-item :label="langMap['query_method']">
                <el-select v-model.number="query.flag">
                    <template v-for="(item, index) in flags">
                        <el-option :value="Number(index)" :label="langMap[item]"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item v-if="query.flag === 1">
                <el-select v-model.number="query.mac_type">
                    <template v-for="(item, index) in macTypes">
                        <el-option :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item v-if="query.flag === 2">
                <el-select v-model.number="query.port_id">
                    <template v-for="(item, index) in port_name">
                        <el-option :value="Number(index)" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="query.flag === 4">
                <el-form-item key="mac-mgmt-vlan-id" prop="vlan_id">
                    <el-input v-model.number="query.vlan_id"></el-input>
                </el-form-item>
                <el-form-item key="mac-mgmt-vlan-id-end" prop="vlan_id_e">
                    <el-input v-model.number="query.vlan_id_e"></el-input>
                </el-form-item>
            </template>
            <template v-if="query.flag === 8">
                <el-form-item key="mac-mgmt-macaddr" prop="macaddr">
                    <el-input v-model="query.macaddr"></el-input>
                </el-form-item>
                <el-form-item key="mac-mgmt-macmask" prop="macmask">
                    <el-input v-model="query.macmask"></el-input>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="queryMacTable('mac-mgmt-query-form')"
                >{{ langMap['find'] }}</el-button>
                <el-button
                    type="primary"
                    @click="loadMoreData"
                    :loading="loadmoreLoading"
                    v-if="loadmore"
                >{{ langMap['loadmore'] }}</el-button>
            </el-form-item>
        </el-form>
        <!-- mac地址查询结束 -->
        <el-table :data="macTable" border stripe>
            <el-table-column prop="macaddr" :label="langMap['macaddr']"></el-table-column>
            <el-table-column prop="vlan_id" :label="langMap['vlan_id']"></el-table-column>
            <el-table-column prop="port_id" :formatter="formatPort" :label="langMap['port_id']"></el-table-column>
            <el-table-column
                prop="mac_type"
                :formatter="formatMacType"
                :label="langMap['mac_type']"
            ></el-table-column>
            <el-table-column fixed="right" width="80">
                <template slot="header" slot-scope="scope">{{ langMap['config'] }}</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="delMac(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="macList.length"
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap[dialogFlag + '_mac'] }}</span>
            <el-form
                :model="addMac"
                :rules="addRules"
                ref="mac-mgmt-add-form"
                label-width="150px"
                v-if="dialogFlag === 'add'"
                key="mac-mgmt-add-form"
            >
                <el-form-item :label="langMap['mac_type']" prop="mac_type">
                    <el-select v-model.number="addMac.mac_type">
                        <el-option :value="1" label="static"></el-option>
                        <el-option :value="2" label="blackhole"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['macaddr']" prop="macaddr" key="mac-mgmt-add-macaddr">
                    <el-input v-model="addMac.macaddr"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['vlan_id']" prop="vlan_id" key="mac-mgmt-add-vlanid">
                    <el-input v-model.number="addMac.vlan_id"></el-input>
                </el-form-item>
                <el-form-item
                    :label="langMap['port_id']"
                    v-if="addMac.mac_type === 1"
                    prop="port_id"
                >
                    <el-select v-model.number="addMac.port_id">
                        <template v-for="(item, key) in port_name">
                            <el-option :label="item" :value="Number(key)"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form
                :model="flushMac"
                :rules="flushRules"
                label-width="150px"
                ref="mac-mgmt-flush-form"
                v-if="dialogFlag === 'flush'"
                key="mac-mgmt-flush-form"
            >
                <el-form-item :label="langMap['flush_way']" prop="flag">
                    <el-select v-model.number="flushMac.flag">
                        <template v-for="(item,key) in flags" v-if="key != 8">
                            <el-option :label="langMap[item]" :value="Number(key)"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langMap['mac_type']" prop="mac_type">
                    <el-select v-model.number="flushMac.mac_type">
                        <template v-for="(item, index) in macTypes">
                            <el-option
                                :label="langMap[item] || 'All'"
                                :value="index"
                                :disabled="flushMac.flag == 2 && index === 2"
                            ></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="langMap['vlan_id']"
                    v-if="flushMac.flag == 4"
                    prop="vlan_id"
                    key="flush-mac-vlan-id"
                >
                    <el-input v-model.number="flushMac.vlan_id"></el-input>
                </el-form-item>
                <el-form-item
                    :label="langMap['port_list']"
                    v-if="flushMac.flag == 2"
                    key="flush-mac-port-list"
                    prop="portlist"
                >
                    <el-checkbox-group v-model="flushMac.portlist">
                        <el-checkbox
                            v-for="(item, index) in port_name"
                            :label="Number(index)"
                            :key="index"
                        >{{ item }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'add'"
                    @click="submitForm('mac-mgmt-add-form')"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    v-if="dialogFlag === 'flush'"
                    @click="submitForm('mac-mgmt-flush-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { pageSizes } from "@/utils/common-data";
import { validatorVlan, validatorMac } from "@/utils/validator";
export default {
    name: "macMgmt",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        const validMacAge = (rule, value, cb) => {
            if (
                value !== 0 &&
                (value < 10 || value > 1000000 || isNaN(value))
            ) {
                return cb(new Error("Range: 0, 10-1000000"));
            }
            cb();
        };
        return {
            count: 0,
            query: {
                flag: 1,
                mac_type: 3,
                port_id: 1,
                vlan_id: 0,
                vlan_id_e: 0,
                macaddr: "",
                macmask: ""
            },
            flags: { 1: "mac_type", 2: "port_id", 4: "vlan_id", 8: "macaddr" },
            macTypes: ["dynamic", "static", "blackhole", "all"],
            macList: [],
            macTable: [],
            pageSize: 10,
            currentPage: 1,
            pageSizes,
            macRules: {
                vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                vlan_id_e: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                macaddr: [
                    { validator: validatorMac, trigger: ["change", "blur"] }
                ],
                macmask: [
                    { validator: validatorMac, trigger: ["change", "blur"] }
                ]
            },
            loadmore: false,
            loadmoreLoading: false,
            macAgeData: {},
            dialogVisible: false,
            dialogFlag: "",
            //  全局添加和清除mac地址时的数据
            addMac: {
                mac_type: 1,
                macaddr: "",
                vlan_id: "",
                port_id: 1
            },
            addRules: {
                macaddr: [
                    { validator: validatorMac, trigger: ["change", "blur"] }
                ],
                vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ]
            },
            flushMac: {
                flag: 1,
                mac_type: 3,
                vlan_id: "",
                portlist: []
            },
            flushRules: {
                vlan_id: [
                    { validator: validatorVlan, trigger: ["change", "blur"] }
                ],
                portlist: [
                    {
                        validator: this.validPortlist,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getData();
        this.getAge();
    },
    methods: {
        getData() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_mac",
                    params: { form: "table" }
                }),
                method: "get",
                param: {
                    flags: 1,
                    count: this.count,
                    mac_type: this.query.mac_type,
                    port_id: this.query.port_id,
                    vlan_id: this.query.vlan_id,
                    vlan_id_e: this.query.vlan_id_e,
                    macaddr: this.query.macaddr,
                    macmask: this.query.macmask
                }
            }).then(res => {
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        if (!this.count) {
                            this.macList = res.data.data;
                            this.currentPage = 1;
                        } else {
                            this.macList = this.macList.cancat(res.data.data);
                        }
                        if (this.macList.length > this.pageSize) {
                            this.macTable = this.macList.slice(
                                (this.currentPage - 1) * this.pageSize,
                                (this.currentPage - 1) * this.pageSize +
                                    this.pageSize
                            );
                        } else {
                            this.macTable = this.macList;
                        }
                        if (res.data.data.length === 200) {
                            this.count++;
                            this.loadmore = true;
                        } else {
                            this.loadmore = false;
                        }
                    } else {
                        this.loadmore = false;
                    }
                } else {
                    this.macList = [];
                    this.macTable = [];
                    this.loadmore = false;
                }
            });
        },
        sizeChange(val) {
            this.pageSize = val;
            if (this.currentPage > this.macList.length / this.pageSize) {
                this.currentPage = Math.ceil(
                    this.macList.length / this.pageSize
                );
                this.macTable = this.macList.slice(
                    (this.currentPage - 1) * this.pageSize
                );
            } else {
                this.macTable = this.macList.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.currentPage * this.pageSize
                );
            }
        },
        currentChange(val) {
            if (val > Math.ceil(this.macList.length / this.pageSize)) {
                val = Math.ceil(this.macList.length / this.pageSize);
            }
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.macList.length) {
                this.macTable = this.macList.slice(start);
            } else {
                this.macTable = this.macList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        formatPort(row, col) {
            return row.port_id ? this.port_name[row.port_id] : 'CPU';
        },
        formatMacType(row, col) {
            return this.macTypes[row.mac_type];
        },
        delMac(data) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_mac",
                            params: { form: "table" }
                        }),
                        method: "delete",
                        param: {
                            mac_type: data.mac_type,
                            macaddr: data.macaddr,
                            vlan_id: data.vlan_id,
                            port_id: data.port_id
                        }
                    }).then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap["delete_success"]
                            );
                            this.getData();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                })
                .catch(_ => {});
        },
        queryMacTable(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.count = 0;
                    this.getData();
                }
            });
        },
        getAge() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/switch_mac",
                    params: { form: "age" }
                }),
                method: "get"
            })
                .then(res => {
                    this.macAgeData = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.macAgeData = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        loadMoreData() {
            this.loadmoreLoading = true;
            this.getData();
            setTimeout(_ => {
                this.loadmoreLoading = false;
            }, 1000);
        },
        openDialog(flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.dialogFlag === "add") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_mac",
                                params: { form: "table" }
                            }),
                            method: "add",
                            param: {
                                mac_type: this.addMac.mac_type,
                                macaddr: this.addMac.macaddr,
                                vlan_id: this.addMac.vlan_id,
                                port_id: this.addMac.port_id
                            }
                        };
                    }
                    if (this.dialogFlag === "flush") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_mac",
                                params: { form: "table" }
                            }),
                            method: "clear",
                            param: {
                                flags: this.flushMac.flag,
                                mac_type: this.flushMac.mac_type,
                                vlan_id: this.flushMac.vlan_id,
                                portlist: this.flushMac.portlist.join(",")
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
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
            this.dialogFlag === "add" &&
                this.$refs["mac-mgmt-add-form"].resetFields();
            this.dialogFlag === "flush" &&
                this.$refs["mac-mgmt-flush-form"].resetFields();
        },
        validPortlist(rule, value, cb) {
            if (!value.length) {
                return this.$message.error(
                    `${this.langMap["param_error"]}: ${
                        this.langMap["port_list"]
                    }`
                );
            }
            cb();
        },
        cfgMacAge() {
            this.$prompt(this.langMap["age"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                inputValidator: value => {
                    if (
                        Number(value) !== 0 &&
                        (value < 10 || value > 1000000 || isNaN(value))
                    ) {
                        return "Range: 0, 10-1000000";
                    }
                },
                inputValue: this.macAgeData.age
            })
                .then(({ value }) => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_mac",
                            params: {
                                form: "age",
                                value: Number(value)
                            }
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getAge();
                            } else {
                                this.$message.error(res.data.message);
                            }
                            setTimeout(_ => {
                                this.isLoading = false;
                                this.editAge = false;
                            }, 1000);
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    },
    watch: {
        "query.flag"() {
            this.$refs["mac-mgmt-query-form"].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
