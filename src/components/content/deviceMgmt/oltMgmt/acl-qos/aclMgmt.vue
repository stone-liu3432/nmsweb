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
            :data="aclList"
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
                                            <span>{{ formatData(_item, _key) }}</span>
                                        </el-col>
                                    </template>
                                </el-row>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="text" size="small">{{ langMap['delete'] }}</el-button>
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
                    <el-button size="small" @click.stop="openDialog(scope.row, 'config')">{{ langMap['config'] }}</el-button>
                    <el-button size="small" @click.stop="openDialog(scope.row, 'add-rule')">{{ langMap['add'] }} Rule</el-button>
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
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['add'] }}</span>
            <acl-form
                :form-info="cacheData"
                :form-flag="dialogFlag"
                ref="acl-mgmt-form"
            ></acl-form>
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
        ...mapState(["langMap", "port_name", "dev_ip"])
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
            cacheData: {}
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
        formatData(item, key) {
            if (key === "src_port" || key === "dst_port") {
                return this.port_name[item];
            }
            return item;
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
            return
            if (valid) {
                var form = this.$refs[formName].formData;
                var data = this.composeData(form, this.dialogFlag);
                this.$devProxy(data).then(res =>{
                    if(res.data.code === 1){
                        this.$message.success(this.langMap[data.method + '_success']);
                        this.getData();
                    }else{
                        this.$message.error(res.data.message);
                    }
                }).catch(err =>{})
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
            return data;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
