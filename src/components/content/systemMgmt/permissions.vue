<template>
    <div slot="label">
        <h3>{{ langMap['auth_mgmt'] }}</h3>
        <el-table
            ref="userRole"
            :data="userRoles"
            tooltip-effect="dark"
            border
            style="width: 100%"
        >
            <!-- @selection-change="selectionChange" -->
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="roleid" :label="langMap['roleid']"></el-table-column>
            <el-table-column prop="rolename" :label="langMap['rolename']"></el-table-column>
            <el-table-column :label="langMap['config']">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="delRole(scope.row)"
                    >{{ langMap['delete'] }}</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="cfgRole(scope.row)"
                    >{{ langMap['config'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="roles.length"
            v-if="roles.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { pageSizes } from "@/utils/common-data";
export default {
    name: "permissions",
    computed: mapState(["langMap"]),
    data() {
        return {
            roles: [],
            userRoles: [],
            pageSize: 20,
            currentPage: 1,
            selectionRoles: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        selectionChange(val) {
            this.selectionRoles = val;
        },
        delRole(val) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"],
                type: "warning",
                center: true
            })
                .then(_ => {
                    var data = {
                        method: "delete",
                        param: {
                            name: val.rolename
                        }
                    };
                    this.$http
                        .post("/api/server/role", data)
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
                })
                .catch(_ => {});
        },
        cfgRole() {},
        getData() {
            this.$http
                .get("/api/server/role")
                .then(res => {
                    this.roles = [];
                    this.userRoles = [];
                    this.currentPage = 1;
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.roles = res.data.data;
                            if (this.roles.length > this.pageSize) {
                                this.userRoles = this.roles.slice(
                                    0,
                                    this.pageSize
                                );
                            } else {
                                this.userRoles = this.roles;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        currentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.roles.length) {
                this.userRoles = this.roles.slice(start);
            } else {
                this.userRoles = this.roles.slice(start, this.pageSize);
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
