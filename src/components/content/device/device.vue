<template>
    <div>
        <el-row class="device-list" :gutter="10">
            <el-col :span="4" v-if="showArea">
                <div class="dev-tree-title">
                    <span>{{ langMap['devicelist'] }}</span>
                </div>
                <el-tree
                    class="tree-border"
                    :data="areaData"
                    default-expand-all
                    node-key="id"
                    :expand-on-click-node="false"
                    check-strictly
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                    @node-click="nodeClick"
                ></el-tree>
            </el-col>
            <el-col :span="20">
                <!-- 功能按钮，待添加 -->
                <!-- <el-row>
                    <el-col :span="12">111</el-col>
                    <el-col :span="12">222</el-col>
                </el-row>-->
                <template v-if="showFlag === 'olt'">
                    <!-- v-if 渲染时，相同元素会被复用，数据项不同时，需给控制的元素加上唯一的key，避免渲染空模板报错 -->
                    <el-table :data="devTable" style="width: 100%" key="olt">
                        <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                        <el-table-column prop="macaddr" label="MAC" width="180"></el-table-column>
                        <el-table-column prop="ipaddr" :label="langMap['ipaddr']" width="180"></el-table-column>
                        <el-table-column
                            prop="status"
                            :formatter="showStatus"
                            :label="langMap['status']"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-tag
                                    :type="scope.row.status ? '' : 'danger'"
                                >{{ scope.row.status ? langMap['online'] : langMap['offline'] }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mclass"
                            :formatter="formatClass"
                            :label="langMap['mclass']"
                        ></el-table-column>
                        <el-table-column prop="model" :label="langMap['model']"></el-table-column>
                        <el-table-column prop="groupname" :label="langMap['groupname']"></el-table-column>
                        <el-table-column :label="langMap['config']" width="100">
                            <template slot-scope="scope">
                                <el-dropdown
                                    @command="dropdownClick"
                                    trigger="click"
                                    style="user-select: none;"
                                >
                                    <span class="el-dropdown-link">
                                        {{ langMap['config'] }}
                                        <i
                                            class="el-icon-arrow-down el-icon--right"
                                        ></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            :command="composeData('olt', 'config', scope.row)"
                                        >{{ langMap['config'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'delete', scope.row)"
                                        >{{ langMap['delete'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'sync', scope.row)"
                                        >{{ langMap['dev_sync'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'onu_sync', scope.row)"
                                        >{{ langMap['onu_sync'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'info', scope.row)"
                                            divided
                                        >{{ langMap['dev_detail'] }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        style="float: right;"
                        @size-change="devSizeChange"
                        @current-change="devCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="devList.length"
                        v-if="devList.length > pageSize"
                    ></el-pagination>
                </template>
                <template v-if="showFlag === 'onu'">
                    <el-table :data="onuTable" style="width: 100%" key="onu">
                        <el-table-column prop="devid" label="ID" width="140"></el-table-column>
                        <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                        <el-table-column prop="macaddr" label="MAC" width="180"></el-table-column>
                        <el-table-column
                            prop="status"
                            :formatter="showStatus"
                            :label="langMap['status']"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-tag
                                    :type="scope.row.status === 'online' ? '' : 'danger'"
                                >{{ showStatus(scope.row) }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mclass"
                            :formatter="formatClass"
                            :label="langMap['mclass']"
                        ></el-table-column>
                        <el-table-column prop="model" :label="langMap['model']"></el-table-column>
                        <el-table-column prop="groupname" :label="langMap['groupname']"></el-table-column>
                        <el-table-column :label="langMap['config']" width="100">
                            <template slot-scope="scope">
                                <el-dropdown
                                    @command="dropdownClick"
                                    trigger="click"
                                    style="user-select: none;"
                                >
                                    <span class="el-dropdown-link">
                                        {{ langMap['config'] }}
                                        <i
                                            class="el-icon-arrow-down el-icon--right"
                                        ></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            :command="composeData('onu', 'config', scope.row)"
                                        >{{ langMap['config'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('onu', 'delete', scope.row)"
                                        >{{ langMap['delete'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('onu', 'info', scope.row)"
                                            divided
                                        >{{ langMap['dev_detail'] }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        style="float: right;"
                        @size-change="onuSizeChange"
                        @current-change="onuCurrentChange"
                        :current-page="onuCurrentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="onuList.length"
                        v-if="onuList.length > pageSize"
                    ></el-pagination>
                </template>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="showConfigDialog" width="800px" key="devConfig">
            <div slot="title">{{ langMap['config'] + (devFlag === 'olt' ? ' OLT' : ' ONU') }}</div>
            <dev-set-info
                :data="cacheData"
                :dev="devFlag"
                :update-data="showConfigDialog"
                :groups="groups"
                v-if="handleFlag === 'config'"
                ref="oltSetInfo"
            ></dev-set-info>
            <div slot="footer">
                <el-button @click="showConfigDialog = false;">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitConfig">{{ langMap['apply'] }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="showMgmtDialog"
            key="devMgmt"
            fullscreen
            :close-on-press-escape="false"
        >
            <div slot="title" v-if="devMgmtTitle">
                <span>{{ langMap['name'] }} : {{ devMgmtTitle.name }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ langMap['ipaddr'] }} : {{ devMgmtTitle.ipaddr }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ langMap['macaddr'] }} : {{ devMgmtTitle.macaddr }}</span>
            </div>
            <olt-detail
                :dev="devFlag"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'olt'"
                :olt-info="cacheData"
                ref="olt-mgmt-dialog"
                @set-title="devTitle"
            ></olt-detail>
            <onu-detail
                :dev="devFlag"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'onu'"
                :onu-info="cacheData"
                ref="onu-mgmt-dialog"
            ></onu-detail>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import { pageSizes, STATUS, MCLASS } from "@/utils/common-data";
import { removeUnderline } from "@/utils/common";
const devSetInfo = () => import(/* webpackChunkName: "configMgmt" */ "./oltSetInfo");
const oltDetail = () => import(/* webpackChunkName: "configMgmt" */ "./oltDetail");
const onuDetail = () => import(/* webpackChunkName: "configMgmt" */ "./onuDetail");
export default {
    name: "deviceMgmt",
    components: { devSetInfo, oltDetail, onuDetail },
    computed: mapState(["langMap"]),
    data() {
        return {
            showArea: true,
            areaData: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            devList: [],
            devTable: [],
            currentPage: 4,
            pageSize: 20,
            pageSizes,
            onuList: [],
            onuTable: [],
            onuCurrentPage: 1,
            showFlag: "olt",
            showConfigDialog: false,
            devData: {},
            devFlag: "",
            handleFlag: "",
            cacheData: {},
            groups: [],
            cacheTree: "",
            currentTreeData: {},
            showMgmtDialog: false,
            devMgmtTitle: ""
        };
    },
    created() {
        this.getData();
        this.getGroups();
    },
    methods: {
        getGroups() {
            this.$http
                .get("/api/device/group")
                .then(res => {
                    this.groups = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            res.data.data.forEach(item => {
                                this.groups.push(item.groupname);
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        nodeClick(item) {
            this.cacheTree = this.$refs["tree"].getCurrentKey();
            this.currentTreeData = Object.assign({}, item);
            if (!item.children) {
                this.showFlag = "onu";
                this.getOnu(item.data.devid);
            } else {
                this.devList = item.data;
                this.currentPage = 1;
                if (this.devList.length > this.pageSize) {
                    this.devTable = this.devList.slice(0, this.pageSize);
                } else {
                    this.devTable = this.devList;
                }
                this.showFlag = "olt";
            }
        },
        cfgDev(data) {
            this.showConfigDialog = true;
            this.devData = data;
        },
        devSizeChange(val) {
            this.pageSize = val;
        },
        devCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.devList.length) {
                this.devTable = this.devList.slice(start);
            } else {
                this.devTable = this.devList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        processDev(data) {
            var obj = {},
                result = [],
                id = 1;
            data.forEach(item => {
                if (!obj[item.groupname]) {
                    obj[item.groupname] = [];
                }
                obj[item.groupname].push(item);
            });
            Object.keys(obj).forEach((item, index) => {
                var children = [];
                obj[item].forEach(_item => {
                    children.push({
                        id: id++,
                        label: _item.name,
                        data: _item
                    });
                });
                result.push({
                    id: id++,
                    label: item,
                    data: obj[item],
                    children
                });
            });
            return result;
        },
        getData() {
            this.$http
                .get("/api/device/olt?type=list")
                .then(res => {
                    this.devList = [];
                    this.areaData = [];
                    this.devTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.areaData = this.processDev(res.data.data);
                            this.currentPage = 1;
                            this.devList = this.areaData[0].data;
                            if (this.areaData[0].data.length > this.pageSize) {
                                this.devTable = this.areaData[0].data.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.devTable = this.areaData[0].data;
                            }
                            if (this.cacheTree !== "") {
                                this.$nextTick(_ => {
                                    this.$refs["tree"].setCurrentKey(
                                        this.cacheTree
                                    );
                                    this.areaData.forEach(item => {
                                        if (item.id === this.cacheTree) {
                                            this.nodeClick(item);
                                        }
                                    });
                                });
                            } else {
                                this.$nextTick(_ => {
                                    if (this.$refs["tree"]) {
                                        this.$refs["tree"].setCurrentKey(
                                            this.areaData[0].id
                                        );
                                        this.cacheTree = this.$refs[
                                            "tree"
                                        ].getCurrentKey();
                                        this.currentTreeData = Object.assign(
                                            {},
                                            this.areaData[0]
                                        );
                                    }
                                });
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getOnu(devid) {
            this.$http
                .get("/api/device/epononu?type=list", { params: { devid } })
                .then(res => {
                    this.onuList = [];
                    this.onuTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.onuList = res.data.data;
                            this.onuCurrentPage = 1;
                            if (this.onuList.length > this.pageSize) {
                                this.onuTable = this.onuList.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.onuTable = this.onuList;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        onuSizeChange(val) {
            this.pageSize = val;
        },
        onuCurrentChange(val) {
            this.onuCurrentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.onuList.length) {
                this.onuTable = this.onuList.slice(start);
            } else {
                this.onuTable = this.onuList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        showStatus(row) {
            if (this.showFlag === "olt") {
                return row.status
                    ? this.langMap["online"]
                    : this.langMap["offline"];
            }
            return removeUnderline(row.status);
        },
        formatClass(row, column) {
            return MCLASS[row[column.property]];
        },
        dropdownClick(command) {
            var { dev, flag, row: node } = command;
            this.devFlag = dev;
            this.handleFlag = flag;
            this.cacheData = node;
            //  设置
            if (flag === "config") {
                this.showConfigDialog = true;
                // this.$nextTick(_ => {
                //     this.$refs["oltSetInfo"].getData();
                // });
            }
            //  删除设备
            if (flag === "delete") {
                this.$confirm(
                    this.langMap["cfm_del_tips"],
                    this.langMap["tips"],
                    {
                        type: "warning"
                    }
                )
                    .then(_ => {
                        var url, data;
                        if (dev === "olt") {
                            url = "/api/device/olt";
                            data = {
                                method: "delete",
                                param: {
                                    type: "devid",
                                    name: "",
                                    groupname: "",
                                    ipaddr: "",
                                    macaddr: "",
                                    devid: node.devid
                                }
                            };
                        }
                        if (dev === "onu") {
                            url = "/api/device/epononu";
                            data = {
                                method: "delete",
                                param: {
                                    type: "macaddr",
                                    name: "",
                                    groupname: "",
                                    macaddr: node.macaddr
                                }
                            };
                        }
                        this.$http
                            .post(url, data)
                            .then(res => {
                                if (res.data.code === 1) {
                                    this.$message.success(
                                        this.langMap[data.method + "_success"]
                                    );
                                    this.devFlag === "olt" && this.getData();
                                    this.devFlag === "onu" &&
                                        this.getOnu(this.cacheData.devid);
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch(err => {});
                    })
                    .catch(_ => {});
            }
            //  同步设备
            if (flag === "sync") {
                var data = {
                    method: "sync",
                    param: {
                        name: node.name,
                        devid: node.devid,
                        ipaddr: node.ipaddr
                    }
                };
                this.$http
                    .post("/api/device/olt", data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.getData();
                    })
                    .catch(err => {});
            }
            //  同步ONU信息
            if (flag === "onu_sync") {
                var data = {
                    method: "sync",
                    param: {
                        devid: node.devid,
                        termid: node.termid
                    }
                };
                this.$http
                    .post("/api/device/epononu", data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[data.method + "_success"]
                            );
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {});
            }
            if (flag === "info") {
                this.showMgmtDialog = true;
            }
        },
        composeData(dev, flag, row) {
            return { dev, flag, row };
        },
        submitConfig() {
            var data = this.$refs["oltSetInfo"].devInfo;
            var result = this.$refs["oltSetInfo"].validForm();
            if (result) {
                var url, params;
                if (this.devFlag === "olt") {
                    url = "/api/device/olt";
                    params = {
                        method: "set",
                        param: {
                            name: data.devname,
                            devid: data.devid,
                            groupname: data.groupname,
                            ipaddr: data.ipaddr,
                            contact: data.contact,
                            location: {
                                region: data.location.region,
                                address: data.location.address,
                                longitude: Number(data.location.longitude),
                                latitude: Number(data.location.latitude)
                            }
                        }
                    };
                }
                if (this.devFlag === "onu") {
                    url = "/api/device/epononu";
                    params = {
                        method: "set",
                        param: {
                            macaddr: data.macaddr,
                            name: data.devname,
                            groupname: data.groupname,
                            label: data.label,
                            location: {
                                address: data.location.address,
                                longitude: Number(data.location.longitude),
                                latitude: Number(data.location.latitude),
                                region: data.location.region
                            },
                            username: data.username,
                            account: data.account,
                            userphone: data.userphone,
                            btype: data.btype,
                            updater: sessionStorage.getItem("user"),
                            description: data.description
                        }
                    };
                }
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[params.method + "_success"]
                            );
                            this.devFlag === "olt" && this.getData();
                            this.devFlag === "onu" &&
                                this.getOnu(this.cacheData.devid);
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.showConfigDialog = false;
                        this.handleFlag = '';
                    })
                    .catch(err => {});
            }
        },
        devTitle(val) {
            this.devMgmtTitle = val;
        }
    },
    beforeDestroy() {},
    //  配置OLT ，模拟点击行为
    mounted() {
        this.dropdownClick({
            dev: "olt",
            flag: "info",
            row: {
                name: "HSGQ-E08",
                devid: 12000,
                ipaddr: "192.168.100.171",
                macaddr: "38:3a:21:20:00:67",
                subnet: "192.168.100.0",
                groupname: "E01",
                status: 1,
                mclass: 1,
                model: "HSGQ-E04",
                description: "OLT 123",
                ponports: 4,
                geports: 4,
                xgeports: 4
            }
        });
    }
};
</script>

<style lang="less" scoped>
.device-list {
    margin: 10px;
}
.dev-tree-title {
    color: #666;
    user-select: none;
    padding-left: 8px;
    font-weight: 600;
    margin: 6px 0 6px 0;
    .dev-title-separator {
        padding: 0 8px;
        & + span {
            color: #409eff;
            cursor: pointer;
        }
    }
}
.tree-border {
    min-height: 740px;
    border: 1px solid #ddd;
    max-height: 740px;
    overflow-y: auto;
}
</style>
