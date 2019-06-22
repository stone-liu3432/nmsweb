<template>
    <div>
        <h3>
            {{ langMap['acl_mgmt'] }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog(null, 'add-acl')"
            >{{ langMap['add'] }} ACL</el-button>
            <el-button
                size="small"
                type="primary"
                @click="openDialog(null, 'delete-acl')"
            >{{ langMap['delete'] }} ACL</el-button>
        </h3>
        <el-table
            :data="aclTable"
            border
            stripe
            :show-header="false"
            row-key="acl_id"
            size="small"
            @expand-change="expandCell"
            @row-click="rowClick"
            :expand-row-keys="expands"
            ref="acl-mgmt-table"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <template v-for="(item, key) in cacheRule">
                        <el-row>
                            <el-col :span="4" style="height: 32px; line-height: 32px;">
                                <span>
                                    <template v-if="editRulePri">
                                        <i
                                            class="el-icon-caret-top"
                                            :style="{ 'font-size': '20px', 'cursor': key === 0 ? 'not-allowed' : 'pointer', 'color': key === 0 ? '#C8C9CC' : ''}"
                                            @click="swapRulePri(cacheRule, key, -1)"
                                        ></i>
                                        <i
                                            class="el-icon-caret-bottom"
                                            :style="{ 'font-size': '20px', 'cursor': key === (cacheRule.length - 1) ? 'not-allowed' : 'pointer', 'color': key === (cacheRule.length - 1) ? '#C8C9CC' : ''}"
                                            @click="swapRulePri(cacheRule, key, 1)"
                                        ></i>
                                    </template>
                                </span>
                                <span>RULE ID: {{ item.rule_id }}</span>
                            </el-col>
                            <el-col :span="18">
                                <el-row>
                                    <template
                                        v-for="(_item, _key) in item"
                                        v-if="_key !== 'rule_id'"
                                    >
                                        <el-col :span="8" style="height: 32px; line-height: 32px;">
                                            <span>{{ langMap[_key] }}:</span>
                                            <span>{{ _item }}</span>
                                        </el-col>
                                    </template>
                                </el-row>
                            </el-col>
                            <el-col :span="2">
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="delRule(props.row.acl_id, item.rule_id)"
                                >{{ langMap['delete'] }}</el-button>
                            </el-col>
                        </el-row>
                        <el-divider v-if="key !== (cacheRule.length -1)"></el-divider>
                    </template>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <span>ACL ID:</span>
                    {{ scope.row.acl_id }}
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <span>{{ langMap['rule_count'] }}:</span>
                    {{ scope.row.rule.length }}
                </template>
            </el-table-column>
            <el-table-column :label="langMap['config']" width="350px">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        @click.stop="openDialog(Object.assign({}, scope.row), 'config')"
                    >{{ langMap['config'] }}</el-button>
                    <el-button
                        size="small"
                        @click.stop="openDialog(Object.assign({}, scope.row), 'add-rule')"
                    >{{ langMap['add'] }} Rule</el-button>
                    <template v-if="scope.row.acl_id === acl_id">
                        <el-button
                            size="small"
                            v-if="editRulePri"
                            @click.stop="setRulePri"
                        >{{ langMap['save'] }}</el-button>
                        <el-button
                            size="small"
                            v-else
                            @click.stop="setRulePri"
                        >{{ langMap['rule_priority'] }}</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="100"
            layout="total, prev, pager, next, jumper"
            :total="aclList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ dialogTitle }}</span>
            <acl-form :form-info="cacheData" :form-flag="dialogFlag" ref="acl-mgmt-form"></acl-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('acl-mgmt-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { removeArrayItem } from "@/utils/common";
import aclForm from "./aclForm";
export default {
    name: "aclMgmt",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"]),
        dialogTitle(){
            if(this.dialogFlag === 'add-acl'){
                return `${this.langMap['add']}ACL`;
            }
            if(this.dialogFlag === 'delete-acl'){
                return `${this.langMap['delete']}ACL`;
            }
            if(this.dialogFlag === 'config'){
                return `${this.langMap['config']}`;
            }
            if(this.dialogFlag === 'add-rule'){
                return `${this.langMap['add']}Rule`;
            }
        }
    },
    components: { aclForm },
    data() {
        return {
            acl_id: 0,
            aclList: [],
            aclTable: [],
            timerange: [],
            editRulePri: false,
            //  缓存数据，应用于调整了rule优先级没有提交，就切换到别的 acl 的情况
            cacheRule: [],
            expands: [],
            dialogVisible: false,
            dialogFlag: "",
            cacheData: {},
            currentPage: 1,
            pageSize: 20
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
                    url: "/switch_acl",
                    params: { form: "acl", sacl_id: 2000, eacl_id: 5999 }
                }),
                method: "get"
            })
                .then(res => {
                    this.aclList = [];
                    this.aclTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.aclList = res.data.data;
                            if (
                                this.currentPage >
                                Math.ceil(this.aclList.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    this.aclList.length / this.pageSize
                                );
                            }
                            if (
                                this.currentPage * this.pageSize >
                                this.aclList.length
                            ) {
                                this.aclTable = this.aclList.slice(
                                    this.pageSize * (this.currentPage - 1)
                                );
                            } else {
                                this.aclTable = this.aclList.slice(
                                    this.pageSize * (this.currentPage - 1),
                                    this.pageSize * this.currentPage
                                );
                            }
                            if (this.acl_id === this.expands[0]) {
                                this.aclList.forEach(item => {
                                    if (item.acl_id === this.acl_id) {
                                        this.cacheRule = Object.assign(
                                            [],
                                            item.rule
                                        );
                                    }
                                });
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        expandCell(row, expands) {
            if (expands.length) {
                this.expands = [expands.acl_id];
                this.rowClick(row);
            } else {
                this.editRulePri = false;
                this.cacheRule = [];
                this.acl_id = 0;
            }
        },
        rowClick(row) {
            if (this.expands.indexOf(row.acl_id) < 0) {
                this.expands = [];
                this.expands.push(row.acl_id);
                this.cacheRule = Object.assign([], row.rule);
                this.acl_id = row.acl_id;
            } else {
                removeArrayItem(this.expands, row.acl_id);
                this.cacheRule = [];
                this.acl_id = 0;
            }
            this.editRulePri = false;
        },
        setRulePri() {
            if (this.editRulePri) {
                var rulePriArr = this.cacheRule.reduce((initVal, item) => {
                    initVal.push(item.rule_id);
                    return initVal;
                }, []);
                this.$devProxy({
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_acl",
                        params: { form: "rulepri" }
                    }),
                    method: "modify",
                    param: {
                        acl_id: this.acl_id,
                        new_rule_id: rulePriArr
                    }
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap["modify_success"]
                            );
                            this.getData();
                            this.editRulePri = false;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {});
            }
            this.editRulePri = !this.editRulePri;
        },
        //  交换rule list顺序   flag:  -1 - previous  1 - next
        swapRulePri(node, index, flag) {
            if (index === 0 && flag === -1) {
                return;
            }
            if (index === node.length - 1 && flag === 1) {
                return;
            }
            if (flag === 1) {
                var _node = node[index],
                    next = node[index + 1];
                this.$set(node, index, next);
                this.$set(node, index + 1, _node);
            }
            if (flag === -1) {
                var _node = node[index],
                    prev = node[index - 1];
                this.$set(node, index, prev);
                this.$set(node, index - 1, _node);
            }
        },
        openDialog(data, flag) {
            this.dialogVisible = true;
            this.dialogFlag = flag;
            if (data) {
                this.$nextTick(_ => {
                    this.cacheData = data;
                });
            }
        },
        submitForm(formName) {
            var valid = this.$refs[formName].validForm();
            if (valid) {
                var form = this.$refs[formName].formData;
                var data = this.composeData(form, this.dialogFlag);
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
                    })
                    .catch(err => {});
            }
        },
        closeDialog() {
            this.$refs["acl-mgmt-form"].resetForm();
        },
        composeData(item, flag) {
            var data;
            if (flag === "add-acl") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_acl",
                        params: { form: "acl" }
                    }),
                    method: "create",
                    param: {
                        acl_id: item.acl_id
                    }
                };
            }
            if (flag === "delete-acl") {
                data = {
                    devicelist: [this.dev_ip],
                    url: this.$qs({
                        url: "/switch_acl",
                        params: { form: "acl" }
                    }),
                    method: "delete",
                    param: {
                        acl_id: item.acl_id,
                        acl_id_e: item.acl_id_e
                    }
                };
            }
            if (flag === "config" || flag === "add-rule") {
                if (this.formType(item.acl_id) === 1) {
                    var flags = {
                        src_ipaddr: 0x01,
                        timerange: 0x02
                    };
                    var _flag = 0;
                    if (flag === "add-rule") {
                        Object.keys(flags).forEach(_item => {
                            if (item[_item]) {
                                _flag |= flags[_item];
                            }
                        });
                    }
                    if (flag === "config") {
                        this.cacheData.rule.forEach(node => {
                            if (node.rule_id === item.rule_id) {
                                Object.keys(flags).forEach(_item => {
                                    if (node[_item] !== item[_item]) {
                                        _flag |= flags[_item];
                                    }
                                });
                            }
                        });
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_acl",
                            params: { form: "rule" }
                        }),
                        method: "set",
                        param: {
                            acl_id: item.acl_id,
                            rule_id: item.rule_id,
                            action: item.action,
                            flags: _flag,
                            src_ipaddr: item.src_ipaddr,
                            src_ipmask: item.src_ipmask,
                            timerange: item.timerange
                        }
                    };
                }
                if (this.formType(item.acl_id) === 2) {
                    var flags = {
                        protocol: 0x1,
                        src_ipaddr: 0x02,
                        dst_ipaddr: 0x04,
                        src_port: 0x08,
                        dst_port: 0x10,
                        precedence: 0x20,
                        dscp: 0x40,
                        timerange: 0x80
                    };
                    var _flag = 0;
                    if (flag === "add-rule") {
                        Object.keys(flags).forEach(_item => {
                            if (item[_item]) {
                                _flag |= flags[_item];
                            }
                        });
                    }
                    if (flag === "config") {
                        this.cacheData.rule.forEach(node => {
                            if (node.rule_id === item.rule_id) {
                                Object.keys(flags).forEach(_item => {
                                    if (node[_item] !== item[_item]) {
                                        _flag |= flags[_item];
                                    }
                                });
                            }
                        });
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_acl",
                            params: { form: "rule" }
                        }),
                        method: "set",
                        param: {
                            acl_id: item.acl_id,
                            rule_id: item.rule_id,
                            action: item.action,
                            flags: _flag,
                            protocol: item.protocol,
                            src_ipaddr: item.src_ipaddr,
                            src_ipmask: item.src_ipmask,
                            dst_ipaddr: item.dst_ipaddr,
                            dst_ipmask: item.dst_ipmask,
                            src_port: item.src_port,
                            dst_port: item.dst_port,
                            precedence: item.precedence,
                            dscp: item.dscp,
                            timerange: item.timerange
                        }
                    };
                }
                if (this.formType(item.acl_id) === 3) {
                    var flags = {
                        eth_type: 0x01,
                        cos: 0x02,
                        inner_cos: 0x04,
                        vlan_id: 0x08,
                        inner_vlan_id: 0x10,
                        src_mac: 0x20,
                        dst_mac: 0x40,
                        timerange: 0x80
                    };
                    var _flag = 0;
                    if (flag === "add-rule") {
                        Object.keys(flags).forEach(_item => {
                            if (item[_item]) {
                                _flag |= flags[_item];
                            }
                        });
                    }
                    if (flag === "config") {
                        this.cacheData.rule.forEach(node => {
                            if (node.rule_id === item.rule_id) {
                                Object.keys(flags).forEach(_item => {
                                    if (node[_item] !== item[_item]) {
                                        _flag |= flags[_item];
                                    }
                                });
                            }
                        });
                    }
                    data = {
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_acl",
                            params: { form: "rule" }
                        }),
                        method: "set",
                        param: {
                            acl_id: item.acl_id,
                            rule_id: item.rule_id,
                            action: item.action,
                            flags: _flag,
                            eth_type: item.eth_type,
                            cos: item.cos,
                            inner_cos: item.inner_cos,
                            vlan_id: item.vlan_id,
                            inner_vlan_id: item.inner_vlan_id,
                            src_mac: item.src_mac,
                            src_mask: item.src_mask,
                            dst_mac: item.dst_mac,
                            dst_mask: item.dst_mask,
                            timerange: item.timerange
                        }
                    };
                }
            }
            return data;
        },
        formType(id) {
            if (id >= 2000 && id < 3000) {
                return 1;
            }
            if (id >= 3000 && id < 5000) {
                return 2;
            }
            if (id >= 5000 && id <= 5999) {
                return 3;
            }
        },
        delRule(acl_id, rule_id) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_acl",
                            params: { form: "rule" }
                        }),
                        method: "delete",
                        param: {
                            acl_id,
                            rule_id
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        currentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.aclList.length) {
                this.aclTable = this.aclList.slice(start);
            } else {
                this.aclTable = this.aclList.slice(
                    start,
                    start + this.pageSize
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
