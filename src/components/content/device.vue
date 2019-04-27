<template>
    <el-row class="device-list" :gutter="10">
        <el-col :span="4" v-if="showArea">
            <div class="dev-tree-title">
                <span>area list</span>
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
            ></el-tree>
        </el-col>
        <el-col :span="20">
            <el-row>
                <el-col :span="12">111</el-col>
                <el-col :span="12">222</el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="devid" label="ID" width="50"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="macaddr" label="MAC" width="180"></el-table-column>
                <el-table-column prop="status" label="状态" width="100"></el-table-column>
                <el-table-column prop="class" label="设备类型"></el-table-column>
                <el-table-column prop="model" label="设备型号"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="cfgDev(scope.row)">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
            ></el-pagination>
        </el-col>
    </el-row>
</template>

<script>
import { pageSizes } from '@/utils/common-data'
export default {
    name: "deviceMgmt",
    data() {
        var areaData = [
            {
                id: 1,
                label: "一级 1",
                children: [
                    {
                        id: 4,
                        label: "二级 1-1",
                        children: [
                            {
                                id: 9,
                                label: "三级 1-1-1"
                            },
                            {
                                id: 10,
                                label: "三级 1-1-2"
                            }
                        ]
                    }
                ]
            }
        ];
        areaData.forEach(item => {
            if (item.children) {
                item.disabled = true;
                item.children.forEach(_item => {
                    if (_item.children) {
                        _item.disabled = true;
                    }
                });
            }
        });
        return {
            showArea: true,
            areaData,
            defaultProps: {
                children: "children",
                label: "label"
            },
            tableData: [
                {
                    devid: 1,
                    name: "EPON-OLT",
                    macaddr: "38:3a:21:20:00:01",
                    status: 1,
                    model: "HSGQ-E08",
                    class: "EPON"
                }
            ],
            currentPage: 4,
            pageSize: 20,
            pageSizes,
        };
    },
    created(){
    },
    methods: {
        nodeClick(item, node, self) {
            if (!item.children) {
                this.$refs.tree.setCheckedKeys([item.id]);
                this.$refs.tree.setCurrentKey([item.id]);
            }
        },
        cfgDev(data) {
            console.log(data);
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    },
    beforeDestroy(){
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
