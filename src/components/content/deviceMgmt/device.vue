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
                >
                    <span slot-scope="{ node, data }">
                        <el-tooltip
                            :content="data.data && data.data.ipaddr ? `${data.label} [${data.data.ipaddr}]` : data.label"
                            placement="top-start"
                            :enterable="false"
                        >
                            <span
                                style="font-size: 14px;"
                            >{{ data.data && data.data.ipaddr ? `${data.label} [${data.data.ipaddr}]` : data.label }}</span>
                        </el-tooltip>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="20">
                <!-- 功能按钮，数据过滤 -->
                <el-form
                    label-width="auto"
                    size="small"
                    style="margin-left: 16px;"
                    inline
                    :model="dataFilter"
                    :rules="filterRules"
                >
                    <el-form-item :label="`${langMap['show_type']}:`">
                        <el-select v-model.number="dataFilter.type" style="width: 200px;">
                            <el-option :value="0" :label="langMap['all']"></el-option>
                            <template v-if="showFlag === 'onu'">
                                <el-option :value="1" :label="langMap['port_id']"></el-option>
                                <el-option :value="2" :label="langMap['status']"></el-option>
                                <el-option
                                    :value="3"
                                    :label="`${langMap['onu_name']}/${langMap['macaddr']}`"
                                ></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <template v-if="showFlag === 'onu'">
                        <el-form-item :label="langMap['port_id']" v-if="dataFilter.type === 1">
                            <el-select v-model.number="dataFilter.port_id">
                                <template v-for="item in ponports">
                                    <el-option
                                        :value="item"
                                        :label="`PON${item < 10 ? '0' + item : item}`"
                                    ></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="langMap['status']" v-if="dataFilter.type === 2">
                            <el-select v-model="dataFilter.status">
                                <template v-for="item in onuStatus">
                                    <el-option :value="item"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :label="`${langMap['onu_name']}/${langMap['macaddr']}`"
                            v-if="dataFilter.type === 3"
                        >
                            <el-input v-model="dataFilter.custom"></el-input>
                        </el-form-item>
                    </template>
                    <dbc-button
                        style="float: right; margin-right: 10px;"
                        @click="getData"
                    >{{ langMap['refresh'] }}</dbc-button>
                </el-form>
                <template v-if="showFlag === 'olt'">
                    <!-- v-if 渲染时，相同元素会被复用，数据项不同时，需给控制的元素加上唯一的key，避免渲染空模板报错 -->
                    <el-table :data="oltData" style="width: 100%" key="olt-list" border>
                        <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                        <el-table-column prop="macaddr" label="MAC" min-width="140"></el-table-column>
                        <el-table-column prop="ipaddr" :label="langMap['ipaddr']" min-width="140">
                            <template
                                slot-scope="scope"
                            >{{ `${scope.row.ipaddr}/${scope.row.httpport}` }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            :formatter="showStatus"
                            :label="langMap['status']"
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
                                            :command="composeData('olt', 'reboot', scope.row)"
                                            :disabled="!scope.row.status"
                                        >{{ langMap['reboot'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'sync', scope.row)"
                                        >{{ langMap['dev_sync'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'onu_sync', scope.row)"
                                            :disabled="!scope.row.status"
                                        >{{ langMap['onu_sync'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'info', scope.row)"
                                            :disabled="!scope.row.status"
                                            divided
                                        >{{ langMap['dev_detail'] }}</el-dropdown-item>
                                        <el-dropdown-item
                                            :command="composeData('olt', 'save', scope.row)"
                                            :disabled="!scope.row.status"
                                        >{{ langMap['save_config'] }}</el-dropdown-item>
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
                    <el-table
                        :data="onuData"
                        style="width: 100%"
                        key="onu-list"
                        border
                        :row-style="isOnuSync"
                    >
                        <el-table-column prop="devid" label="ID"></el-table-column>
                        <el-table-column :label="`${langMap['port_id']}/${'onu_id'}`">
                            <template
                                slot-scope="scope"
                            >{{ `${scope.row.port_id} / ${scope.row.onu_id}` }}</template>
                        </el-table-column>
                        <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                        <el-table-column prop="macaddr" label="MAC"></el-table-column>
                        <el-table-column
                            prop="status"
                            :formatter="showStatus"
                            :label="langMap['status']"
                        >
                            <template slot-scope="scope">
                                <el-tag
                                    :type="scope.row.sync === 0 ? 'info' : scope.row.status.toLowerCase() === 'online' ? '' : 'danger'"
                                >{{ showStatus(scope.row) }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mclass"
                            :formatter="formatClass"
                            :label="langMap['mclass']"
                        ></el-table-column>
                        <!-- <el-table-column prop="model" :label="langMap['model']"></el-table-column>
                        <el-table-column prop="groupname" :label="langMap['groupname']"></el-table-column>-->
                        <el-table-column prop="register_time" :label="langMap['register_time']"></el-table-column>
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
                        hide-on-single-page
                        @size-change="onuSizeChange"
                        @current-change="onuCurrentChange"
                        :current-page="onuCurrentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="onuTotal"
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
            @close="closeDialog"
            :before-close="isSavedCfg"
            style="min-width: 1280px;"
        >
            <div slot="title" v-if="devMgmtTitle">
                <span>{{ langMap['name'] }} : {{ devMgmtTitle.name }}</span>
                <el-divider direction="vertical"></el-divider>
                <template v-if="!!devMgmtTitle.ipaddr">
                    <span>{{ langMap['ipaddr'] }} : {{ devMgmtTitle.ipaddr }}</span>
                    <el-divider direction="vertical"></el-divider>
                </template>
                <span>{{ langMap['macaddr'] }} : {{ devMgmtTitle.macaddr }}</span>
                <dbc-button
                    :interval="500"
                    style="margin-left: 50px;"
                    @click="refreshCurrentPage"
                >{{ langMap['refresh'] }}</dbc-button>
            </div>
            <olt-detail
                :dev="devFlag"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'olt' && !loading"
                :olt-info="cacheData"
                ref="olt-mgmt-dialog"
                @set-title="devTitle"
            ></olt-detail>
            <onu-detail
                :dev="devFlag"
                :dev_ip="olt_ip"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'onu' && !loading"
                :onu-info="cacheData"
                ref="onu-mgmt-dialog"
                @set-title="devTitle"
            ></onu-detail>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { pageSizes, MCLASS, ONU_STATUS } from "@/utils/common-data";
import { removeUnderline } from "@/utils/common";
const devSetInfo = () =>
    import(/* webpackChunkName: "configMgmt" */ "./oltSetInfo");
const oltDetail = () =>
    import(/* webpackChunkName: "configMgmt" */ "./oltMgmt/oltDetail");
const onuDetail = () =>
    import(/* webpackChunkName: "configMgmt" */ "./onuMgmt/onuDetail");
export default {
    name: "deviceMgmt",
    components: { devSetInfo, oltDetail, onuDetail },
    computed: {
        ...mapState(["langMap", "loading", "dev_ip"]),
        onuData() {
            let data = this.onuList.slice(0);
            if (this.dataFilter.type) {
                if (this.dataFilter.type === 1) {
                    data = data.filter(
                        item => item.port_id === this.dataFilter.port_id
                    );
                }
                if (this.dataFilter.type === 2) {
                    data = data.filter(
                        item =>
                            item.status.toLowerCase() ===
                            this.dataFilter.status.toLowerCase()
                    );
                }
                if (this.dataFilter.type === 3) {
                    if (this.dataFilter.custom) {
                        data = data.filter(
                            item =>
                                item.name.indexOf(this.dataFilter.custom) >
                                    -1 ||
                                item.macaddr.indexOf(this.dataFilter.custom) >
                                    -1
                        );
                    }
                }
            }
            this.onuTotal = data.length;
            let start = this.pageSize * (this.onuCurrentPage - 1);
            if (start + this.pageSize > data.length) {
                return data.slice(start);
            } else {
                return data.slice(start, start + this.pageSize);
            }
        },
        oltData() {
            var start = this.pageSize * (this.currentPage - 1);
            if (start + this.pageSize > this.devList.length) {
                return this.devList.slice(start);
            }
            return this.devList.slice(start, start + this.pageSize);
        }
    },
    data() {
        return {
            onuStatus: ONU_STATUS,
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
            devMgmtTitle: "",
            dataFilterType: 0,
            //  显示onu列表时，缓存Olt IP
            olt_ip: "",
            dialogShow: false,
            dataFilter: {
                type: 0,
                port_id: 1,
                status: "Online",
                custom: ""
            },
            filterRules: {},
            ponports: 0,
            onuTotal: 0,
            oltTotal: 0
        };
    },
    created() {
        this.getData();
        this.getGroups();
    },
    methods: {
        ...mapMutations({
            updateLoading: "changeLoadingState",
            updateTimestamp: "updateTimestamp"
        }),
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
            sessionStorage.setItem("tree_id", this.cacheTree);
            this.currentTreeData = Object.assign({}, item);
            this.dataFilter.type = 0;
            if (!item.children) {
                this.showFlag = "onu";
                this.getOnu(item.data.devid);
                this.olt_ip = item.data.ipaddr;
                this.ponports = item.data.ponports;
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
            if (
                this.currentPage >
                Math.ceil(this.devList.length / this.pageSize)
            ) {
                this.currentPage = Math.ceil(
                    this.devList.length / this.pageSize
                );
            }
            var start = (this.currentPage - 1) * this.pageSize;
            if (start + this.pageSize > this.devList.length) {
                this.devTable = this.devList.slice(start);
            } else {
                this.devTable = this.devList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        devCurrentChange(val) {
            if (val > Math.ceil(this.devList.length / this.pageSize)) {
                val = Math.ceil(this.devList.length / this.pageSize);
            }
            this.currentPage = val;
            var start = this.pageSize * (this.currentPage - 1);
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
                        id: _item.devid,
                        label: _item.name,
                        data: _item
                    });
                });
                result.push({
                    id: String(item),
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
                            this.cacheTree = sessionStorage.getItem("tree_id");
                            if (
                                this.cacheTree !== "" &&
                                this.cacheTree !== null
                            ) {
                                this.$nextTick(_ => {
                                    //  olt 被删除时
                                    let flag = false;
                                    this.$refs["tree"].setCurrentKey(
                                        this.cacheTree
                                    );
                                    this.areaData.forEach(item => {
                                        if (item.id === this.cacheTree) {
                                            this.nodeClick(item);
                                            flag = true;
                                        }
                                        if (
                                            item.children &&
                                            item.children.length
                                        ) {
                                            item.children.forEach(_item => {
                                                if (
                                                    String(_item.id) ===
                                                    this.cacheTree
                                                ) {
                                                    this.nodeClick(_item);
                                                    flag = true;
                                                }
                                            });
                                        }
                                    });
                                    //  当前olt被删除， flag === true 或是首次进入当前页面时
                                    if (!this.cacheTree || !flag) {
                                        this.$refs["tree"].setCurrentKey(
                                            this.areaData[0].id
                                        );
                                        this.nodeClick(this.areaData[0]);
                                    }
                                });
                            } else {
                                this.$nextTick(_ => {
                                    // if (this.$refs["tree"]) {
                                    //     this.cacheTree = this.$refs[
                                    //         "tree"
                                    //     ].getCurrentKey();
                                    //     sessionStorage.setItem(
                                    //         "tree_id",
                                    //         this.cacheTree
                                    //     );
                                    //     this.currentTreeData = Object.assign(
                                    //         {},
                                    //         this.areaData[0]
                                    //     );
                                    // }
                                    this.$refs["tree"].setCurrentKey(
                                        this.areaData[0].id
                                    );
                                    this.nodeClick(this.areaData[0]);
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
            if (
                this.onuCurrentPage >
                Math.ceil(this.onuList.length / this.pageSize)
            ) {
                this.onuCurrentPage = Math.ceil(
                    this.onuList.length / this.pageSize
                );
            }
            var start = (this.onuCurrentPage - 1) * this.pageSize;
            if (start + this.pageSize > this.onuList.length) {
                this.onuTable = this.onuList.slice(start);
            } else {
                this.onuTable = this.onuList.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        onuCurrentChange(val) {
            if (val > Math.ceil(this.onuList.length / this.pageSize)) {
                val = Math.ceil(this.onuList.length / this.pageSize);
            }
            this.onuCurrentPage = val;
            var start = this.pageSize * (this.onuCurrentPage - 1);
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
                                    groupname: node.groupname,
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
                                    groupname: node.groupname,
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
                this.updateLoading(true);
            }
            if (flag === "save") {
                this.$confirm(
                    this.langMap["save_cfg_confirm"],
                    this.langMap["tips"],
                    {
                        type: "warning"
                    }
                )
                    .then(_ => {
                        this.$devProxy({
                            devicelist: [node.ipaddr],
                            url: this.$qs({
                                url: "/system_save"
                            }),
                            method: "get"
                        })
                            .then(res => {
                                if (res.data.code === 1) {
                                    this.$message.success(
                                        this.langMap["set_success"]
                                    );
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch(err => {});
                    })
                    .catch(_ => {});
            }
            if (flag === "reboot") {
                this.rebootOlt(node);
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
                            protocol: data.protocol,
                            httpport: data.httpport,
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
                            devid: data.devid,
                            port_id: data.port_id,
                            onu_id: data.onu_id,
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
                        this.handleFlag = "";
                    })
                    .catch(err => {});
            }
        },
        devTitle(val) {
            this.devMgmtTitle = val;
        },
        isOnuSync({ row }) {
            return row.sync === 0 ? "background: #F5F7FA" : "";
        },
        closeDialog() {
            this.devFlag = "";
            this.handleFlag = "";
        },
        isSavedCfg(done) {
            // if (this.devFlag === "olt") {
            //     this.$confirm(
            //         this.langMap["save_cfg_confirm"],
            //         this.langMap["tips"],
            //         {
            //             type: "warning"
            //         }
            //     )
            //         .then(_ => {
            //             this.$devProxy({
            //                 devicelist: [this.dev_ip],
            //                 url: this.$qs({
            //                     url: "/system_save"
            //                 }),
            //                 method: "get"
            //             })
            //                 .then(res => {
            //                     if (res.data.code === 1) {
            //                         this.$message.success(
            //                             this.langMap["save_succ"]
            //                         );
            //                     } else {
            //                         this.$message.error(res.data.message);
            //                     }
            //                 })
            //                 .catch(err => {});
            //             done();
            //         })
            //         .catch(_ => {
            //             done();
            //         });
            // } else {
            //     done();
            // }
            done();
        },
        //  更新vuex保存的时间戳
        refreshCurrentPage() {
            this.updateTimestamp(new Date().getTime());
        },
        rebootOlt(data) {
            this.$confirm(
                this.langMap["reboot_olt_hit"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [data.ipaddr],
                        url: this.$qs({
                            url: "/system_reboot"
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["st_success"]
                                );
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    },
    watch: {
        dataFilter: {
            handler() {
                if (this.onuCurrentPage !== 1) {
                    this.onuCurrentPage = 1;
                }
            },
            deep: true
        }
    },
    beforeDestroy() {
        sessionStorage.removeItem("tree_id");
    },
    //  配置OLT ，模拟点击行为
    mounted() {
        // this.dropdownClick({
        //     dev: "olt",
        //     flag: "info",
        //     row: {
        //         name: "HSGQ-E08",
        //         devid: 12000,
        //         ipaddr: "192.168.100.171",
        //         macaddr: "38:3a:21:20:00:67",
        //         subnet: "192.168.100.0",
        //         groupname: "E01",
        //         status: 1,
        //         mclass: 1,
        //         model: "HSGQ-E04",
        //         description: "OLT 123",
        //         ponports: 4,
        //         geports: 4,
        //         xgeports: 4
        //     }
        // });
        // this.dropdownClick({
        //     dev: "onu",
        //     flag: "info",
        //     row: {
        //         devid: "383a21201234",
        //         groupname: "asdfsf",
        //         macaddr: "38:3a:21:20:12:34",
        //         mclass: 1,
        //         model: "1ge4fe",
        //         name: "epon_onu",
        //         onu_id: 1,
        //         port_id: 1,
        //         status: "online",
        //         sync: 0,
        //         termid: "383a21201234"
        //     }
        // });
        // this.olt_ip = '192.168.100.171';
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
</style>
