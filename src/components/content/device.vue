<template>
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
                :check-strictly="true"
                ref="tree"
                highlight-current
                :props="defaultProps"
                @node-click="nodeClick"
                :current-node-key="areaData[0].id"
                v-if="areaData.length"
            ></el-tree>
        </el-col>
        <el-col :span="20">
            <el-row>
                <el-col :span="12">111</el-col>
                <el-col :span="12">222</el-col>
            </el-row>
            <template v-if="showFlag === 'olt'">
                <!-- v-if 渲染时，相同元素会被复用，数据项不同时，需给控制的元素加上唯一的key，避免渲染空模板报错 -->
                <el-table :data="devTable" style="width: 100%" key="olt">
                    <el-table-column prop="devid" label="ID" width="100"></el-table-column>
                    <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                    <el-table-column prop="macaddr" label="MAC" width="180"></el-table-column>
                    <el-table-column prop="ipaddr" :label="langMap['ipaddr']" width="180"></el-table-column>
                    <el-table-column prop="status" :formatter="showStatus" :label="langMap['status']" width="100"></el-table-column>
                    <el-table-column prop="mclass" :label="langMap['mclass']"></el-table-column>
                    <el-table-column prop="model" :label="langMap['model']"></el-table-column>
                    <el-table-column prop="groupname" :label="langMap['groupname']"></el-table-column>
                    <el-table-column :label="langMap['config']" width="80">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="cfgDev(scope.row)"
                            >{{ langMap['config'] }}</el-button>
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
                    <el-table-column prop="devid" label="ID" width="100"></el-table-column>
                    <el-table-column prop="name" :label="langMap['name']"></el-table-column>
                    <el-table-column prop="macaddr" label="MAC" width="180"></el-table-column>
                    <el-table-column prop="status" :formatter="showStatus" :label="langMap['status']" width="100"></el-table-column>
                    <el-table-column prop="mclass" :label="langMap['mclass']"></el-table-column>
                    <el-table-column prop="model" :label="langMap['model']"></el-table-column>
                    <el-table-column prop="groupname" :label="langMap['groupname']"></el-table-column>
                    <el-table-column :label="langMap['config']" width="80">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="cfgDev(scope.row)"
                            >{{ langMap['config'] }}</el-button>
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
</template>

<script>
import { mapState } from "vuex";
import { pageSizes, STATUS } from "@/utils/common-data";
import { removeUnderline } from '@/utils/common'
export default {
    name: "deviceMgmt",
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
            onuDev: {},
            onuList: [],
            onuTable: [],
            onuCurrentPage: 1,
            showFlag: 'olt',
        };
    },
    created() {
        this.getData();
        this.getOnu();
    },
    methods: {
        nodeClick(item, node, self) {
            if (!item.children) {
                this.onuList = this.onuDev[item.data.devid] || [];
                this.onuCurrentPage = 1;
                if(this.onuList.length > this.pageSize){
                    this.onuTable = this.onuList.slice(0, this.pageSize);
                }else{
                    this.onuTable = this.onuList;
                }
                this.showFlag = 'onu';
            } else {
                this.devList = item.data;
                this.currentPage = 1;
                if (this.devList.length > this.pageSize) {
                    this.devTable = this.devList.slice(0, this.pageSize);
                } else {
                    this.devTable = this.devList;
                }
                this.showFlag = 'olt';
            }
        },
        cfgDev(data) {
            console.log(data);
        },
        devSizeChange(val) {
            this.pageSize = val;
        },
        devCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.devList.data.length) {
                this.devTable = this.devList.data.slice(start);
            } else {
                this.devTable = this.devList.data.slice(start, this.pageSize);
            }
        },
        processDev(data) {
            var obj = {},
                result = [],
                id = 1;
            data.forEach(item => {
                if (!obj[item.groupname]) {
                    obj[item.groupname] = [];
                    obj[item.groupname].push(item);
                } else {
                    obj[item.groupname].push(item);
                }
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
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.areaData = this.processDev(res.data.data);
                            this.currentPage = 1;
                            this.devList = this.areaData[0];
                            if (this.areaData[0].data.length > this.pageSize) {
                                this.devTable = this.areaData[0].data.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.devTable = this.areaData[0].data;
                            }
                        } else {
                            this.devList = [];
                            this.areaData = [];
                        }
                    } else {
                        this.devList = [];
                        this.areaData = [];
                    }
                })
                .catch(err => {});
        },
        getOnu() {
            this.$http
                .get("/api/device/epononu?type=list")
                .then(res => {
                    if (res.data.code === 1) {
                        if(res.data.data && res.data.data.length){
                            this.onuDev = this.processOnu(res.data.data);
                        }else{
                            this.onuDev = {};
                        }
                    }else{
                        this.onuDev = {};
                    }
                })
                .catch(err => {});
        },
        processOnu(data) {
            var result = {};
            data.forEach(item => {
                if (result[item.devid]) {
                    result[item.devid].push(item);
                } else {
                    result[item.devid] = [];
                    result[item.devid].push(item);
                }
            });
            return result;
        },
        onuSizeChange(val){
            this.pageSize = val;
        },
        onuCurrentChange(val){
            this.onuCurrentPage = val;
            var start = this.pageSize * (val - 1);
            if(start + this.pageSize > this.onuList.length){
                this.onuTable = this.onuList.slice(start);
            }else{
                this.onuTable = this.onuList.slice(start, this.pageSize);
            }
        },
        showStatus(row){
            return removeUnderline(STATUS[row.status]);
        }
    },
    beforeDestroy() {}
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
    .dev-title-separator {
        padding: 0 8px;
        & + span {
            color: #409eff;
            cursor: pointer;
        }
    }
}
.tree-border {
    min-height: 754px;
    border: 1px solid #ddd;
}
</style>
