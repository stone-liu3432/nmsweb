<template>
    <div slot="label">
        <h3>{{ langMap['sw_ver'] }}</h3>
        <el-collapse v-model="activeName" accordion class="sw-type-header">
            <el-collapse-item name="1">
                <template slot="title">
                    <el-button type="primary" size="small">{{ langMap['view_sw_ver'] }}</el-button>
                </template>
                <div class="collapse-margin">
                    <el-button
                        type="primary"
                        size="small"
                        @click="openModal('addType')"
                    >{{ langMap['add_sw_ver'] }}</el-button>
                    <el-button
                        type="danger"
                        size="small"
                        @click="delTypeBatch"
                    >{{ langMap['del_select'] }}</el-button>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="softwareTypes"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                    @selection-change="typeSelectionChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                    <el-table-column prop="updater" :label="langMap['updater']"></el-table-column>
                    <el-table-column prop="reason" :label="langMap['reason']"></el-table-column>
                    <el-table-column fixed="right" :label="langMap['config']" width="120">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="delType(scope.row)"
                            >{{ langMap['delete'] }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right;"
                    @current-change="typeCurrentChange"
                    :current-page="currentPageType"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="swType.length"
                    v-if="swType.length > pageSize"
                ></el-pagination>
            </el-collapse-item>
        </el-collapse>
        <h3>{{ langMap['sw_lib'] }}</h3>
        <div style="margin: 10px 0;">
            <el-tooltip :content="langMap['no_sw_type_tips']" :disabled="softwareTypes.length > 0">
                <el-button
                    type="primary"
                    size="small"
                    @click="openModal('updateFile')"
                    :disabled="softwareTypes.length <= 0"
                >{{ langMap['upload_sw'] }}</el-button>
            </el-tooltip>
            <el-button size="small" type="danger" @click="delSWBatch">{{ langMap['del_select'] }}</el-button>
        </div>
        <el-table
            :data="softwareStorage"
            border
            style="width: 100%"
            @selection-change="storageSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" :label="langMap['name']"></el-table-column>
            <el-table-column prop="filename" :label="langMap['filename']"></el-table-column>
            <el-table-column prop="version" :label="langMap['version']"></el-table-column>
            <el-table-column prop="type" :label="langMap['type']"></el-table-column>
            <el-table-column prop="size" :label="langMap['size']"></el-table-column>
            <el-table-column prop="compiletime" :label="langMap['compiletime']"></el-table-column>
            <el-table-column prop="storagetime" :label="langMap['storagetime']"></el-table-column>
            <el-table-column prop="storager" :label="langMap['storager']"></el-table-column>
            <el-table-column prop="description" :label="langMap['description']"></el-table-column>
            <el-table-column fixed="right" :label="langMap['config']" width="80">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="delStorage(scope.row)"
                    >{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="storageCurrentChange"
            :current-page="currentPageStorage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="sw.length"
            v-if="sw.length > pageSize"
        ></el-pagination>
        <el-dialog
            :title="langMap['tips']"
            width="40%"
            ref="swModal"
            center
            :visible.sync="visibilityFlag"
            @closed="clearData"
        >
            <sw-update-file ref="swUpdateFile" v-if="modalType === 'updateFile'" :types="softwareTypes"></sw-update-file>
            <add-type ref="addType" v-if="modalType === 'addType'"></add-type>
            <span slot="footer">
                <el-button @click="closeModal">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitUpload"
                    v-if="modalType === 'updateFile'"
                >{{ langMap['apply'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitAddType"
                    v-if="modalType === 'addType'"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import swUpdateFile from "./swUpdateFile";
import addType from "./addType";
import { mapState, mapMutations } from "Vuex";
export default {
    name: "software",
    components: { swUpdateFile, addType },
    computed: {
        ...mapState(["langMap"]),
    },
    data() {
        return {
            sw: [],
            swType: [],
            activeName: "",
            softwareTypes: [],
            typeSelection: [],
            storageSelection: [],
            currentPageType: 1,
            currentPageStorage: 1,
            pageSize: 10,
            softwareStorage: [],
            modalType: "",
            visibilityFlag: false,
        };
    },
    created() {
        this.getSw();
        this.getSwType();
    },
    methods: {
        getSw() {
            this.$http
                .get("/api/server/software")
                .then(res => {
                    this.sw = [];
                    this.softwareStorage = [];
                    if (res.data.code === 1) {
                        this.sw = res.data.data;
                        this.currentPageStorage = 1;
                        if (this.sw && this.sw.length) {
                            if (this.sw.length > this.pageSize) {
                                this.softwareStorage = this.sw.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.softwareStorage = this.sw;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getSwType() {
            this.$http
                .get("/api/server/softwaretype")
                .then(res => {
                    this.swType = [];
                    this.softwareTypes = [];
                    if (res.data.code === 1) {
                        this.swType = res.data.data;
                        this.currentPageType = 1;
                        if (this.swType && this.swType.length) {
                            if (this.swType.length > this.pageSize) {
                                this.softwareTypes = this.swType.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.softwareTypes = this.swType;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        typeSelectionChange(val) {
            this.typeSelection = val;
        },
        storageSelectionChange(val) {
            this.storageSelection = val;
        },
        typeCurrentChange(val) {
            this.currentPageType = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.swType.length) {
                this.softwareTypes = this.swType.slice(start);
            } else {
                this.softwareTypes = this.swType.slice(start, start + this.pageSize);
            }
        },
        storageCurrentChange(val) {
            this.currentPageStorage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.sw.length) {
                this.softwareStorage = this.sw.slice(start);
            } else {
                this.softwareStorage = this.sw.slice(start, start + this.pageSize);
            }
        },
        submitUpload() {
            var node = this.$refs.swUpdateFile;
            var valid = node.validatorForm();
            if (valid) {
                this.$http({
                    url: "/api/server/upload",
                    method: "post",
                    params: { name: node.fData.name, label: node.fData.label, type: node.fData.type },
                    data: node.fData.file,
                    headers: { "content-type": "multipart/form-data" }
                })
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap["upload_success"]
                            );
                            this.getSw();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {});
                this.closeModal();
            }
        },
        openModal(str) {
            this.visibilityFlag = true;
            this.modalType = str;
        },
        closeModal() {
            this.visibilityFlag = false;
        },
        clearData(){
            this.modalType = '';
        },
        submitAddType() {
            var node = this.$refs.addType;
            var valid = node.validatorForm();
            if (valid) {
                var data = {
                    method: "add",
                    param: {
                        name: node.fData.name,
                        updater: sessionStorage.getItem('user'),
                        reason: node.fData.reason
                    }
                };
                this.$http
                    .post("/api/server/softwaretype", data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                            this.getSwType();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {});
                this.closeModal();
            }
        },
        delTypeBatch() {
            return this.$message(this.langMap['no_supprot_now']);
            if (!this.typeSelection.length) {
                this.$message("type no selection");
                return;
            }
            console.log("del type batch");
        },
        delSWBatch() {
            return this.$message(this.langMap['no_supprot_now']);
            if (!this.storageSelection.length) {
                this.$message("storage no selection");
                return;
            }
            console.log("del storage batch");
        },
        delType(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                type: "warning"
            })
                .then(_ => {
                    var param = {
                        method: "delete",
                        param: {
                            name: node.name
                        }
                    };
                    this.$http
                        .post("/api/server/softwaretype", param)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[param.method + "_success"]
                                );
                                this.getSwType();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        delStorage(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                type: "warning"
            })
                .then(_ => {
                    var param = {
                        method: "delete",
                        param: {
                            name: node.name
                        }
                    };
                    this.$http
                        .post("/api/server/software", param)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[param.method + "_success"]
                                );
                                this.getSw();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    },
    mounted() {},
    beforeDestroy() {}
};
</script>

<style lang="less" scoped>
</style>
