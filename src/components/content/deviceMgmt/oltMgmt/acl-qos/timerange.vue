<template>
    <div>
        <h3>
            {{ langMap['time_range'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ langMap['add'] }}</el-button>
            <el-button type="primary" size="small" @click="delTimeRange">{{ langMap['delete_all'] }}</el-button>
        </h3>
        <el-table :data="timerange" border stripe>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-row>
                        <el-col
                            :span="2"
                            style="height: 32px; line-height: 32px;"
                        >{{ langMap['absolute'] }}</el-col>
                        <el-col :span="22">
                            <template v-for="item in props.row.absolute">
                                <el-row style="line-height: 32px;">
                                    <el-col :span="11">
                                        <span style="padding-right: 10px;">{{ langMap['stime'] }}</span>
                                        <span>{{ `${item.sday} ${item.stime}` }}</span>
                                    </el-col>
                                    <el-col :span="11">
                                        <span style="padding-right: 10px;">{{ langMap['etime'] }}</span>
                                        <span>{{ `${item.eday} ${item.etime}` }}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button
                                            type="text"
                                            size="small"
                                            @click="delTimeRange(item, props.row.name, 'abs')"
                                        >{{ langMap['delete'] }}</el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                        <el-col
                            :span="2"
                            style="height: 32px; line-height: 32px;"
                        >{{ langMap['relative'] }}</el-col>
                        <el-col :span="22">
                            <template v-for="item in props.row.relative">
                                <el-row style="line-height: 32px;">
                                    <el-col :span="8">
                                        <span style="padding-right: 10px;">{{ langMap['stime'] }}</span>
                                        <span>{{ item.stime }}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <span style="padding-right: 10px;">{{ langMap['etime'] }}</span>
                                        <span>{{ item.etime }}</span>
                                    </el-col>
                                    <el-col :span="6">
                                        <span style="padding-right: 10px;">{{ langMap['day'] }}</span>
                                        <span>{{ item.day }}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button
                                            type="text"
                                            size="small"
                                            @click="delTimeRange(item, props.row.name, 'rel')"
                                        >{{ langMap['delete'] }}</el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column :label="langMap['name']" prop="name"></el-table-column>
            <el-table-column :label="langMap['state']" prop="state"></el-table-column>
            <!-- <el-table-column :label="langMap['config']" width="80px">
                <template slot-scope="scope">
                    <el-button type="text" @click="delTimeRange(scope.row)">{{ langMap['delete'] }}</el-button>
                </template>
            </el-table-column>-->
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="timerange.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['add'] }}</span>
            <el-form
                :model="addForm"
                :rules="addRules"
                ref="time-range-form"
                size="small"
                label-width="140px"
            >
                <el-form-item :label="langMap['name']" prop="t_name">
                    <el-input v-model="addForm.t_name"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['type']">
                    <el-select v-model.number="addForm.type" style="width: 200px;">
                        <el-option :value="1" :label="langMap['relative']"></el-option>
                        <el-option :value="2" :label="langMap['absolute']"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="addForm.type === 1">
                    <el-form-item :label="langMap['stime']" prop="time">
                        <el-time-picker
                            is-range
                            v-model="addForm.time"
                            range-separator=" - "
                            :start-placeholder="langMap['stime']"
                            :end-placeholder="langMap['etime']"
                        ></el-time-picker>
                    </el-form-item>
                    <el-form-item :label="langMap['day']" prop="day">
                        <el-select v-model="addForm.day">
                            <template v-for="item in days">
                                <el-option :value="item"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="addForm.type === 2">
                    <el-form-item :label="langMap['stime']" prop="time">
                        <el-date-picker
                            v-model="addForm.time"
                            type="datetimerange"
                            range-separator=" - "
                            :start-placeholder="langMap['stime']"
                            :end-placeholder="langMap['etime']"
                        ></el-date-picker>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('time-range-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { pageSizes } from "@/utils/common-data";
import { validatorName } from "@/utils/validator";
export default {
    name: "timerange",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            timerange: [],
            timeTable: [],
            currentPage: 1,
            days: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
                "Daily",
                "Weekend",
                "Working-day"
            ],
            pageSizes,
            pageSize: 20,
            dialogVisible: false,
            addForm: {
                t_name: "",
                type: 1,
                time: "",
                day: "Working-day"
            },
            addRules: {
                t_name: [
                    { validator: this.validName, trigger: ["change", "blur"] }
                ],
                time: [
                    { validator: this.validTime, trigger: ["change", "blur"] }
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
                    url: "/switch_acl",
                    params: { form: "time_range", name: "all" }
                }),
                method: "get"
            })
                .then(res => {
                    this.timerange = [];
                    this.timeTable = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.timerange = res.data.data;
                            if (
                                this.currentPage >
                                Math.ceil(this.timerange.length / this.pageSize)
                            ) {
                                this.currentPage = Math.ceil(
                                    this.timerange.length / this.pageSize
                                );
                            }
                            if (
                                this.currentPage * this.pageSize >
                                this.timerange.length
                            ) {
                                this.timeTable = this.timerange.slice(
                                    this.pageSize * (this.currentPage - 1)
                                );
                            } else {
                                this.timeTable = this.timerange.slice(
                                    this.pageSize * (this.currentPage - 1),
                                    this.pageSize * this.currentPage
                                );
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            var start = this.pageSize * (val - 1);
            if (start + this.pageSize > this.timerange.length) {
                this.timeTable = this.timerange.slice(start);
            } else {
                this.timeTable = this.timerange.slice(
                    start,
                    start + this.pageSize
                );
            }
        },
        openDialog() {
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var data;
                    if (this.addForm.type === 1) {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_acl",
                                params: { form: "time_range", type: "relative" }
                            }),
                            method: "create",
                            param: {
                                name: this.addForm.t_name,
                                stime: `${this.addForm.time[0].getHours()}:${this.addForm.time[0].getMinutes()}`,
                                etime: `${this.addForm.time[1].getHours()}:${this.addForm.time[1].getMinutes()}`,
                                day: this.addForm.day
                            }
                        };
                    }
                    if (this.addForm.type === 2) {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_acl",
                                params: { form: "time_range", type: "absolute" }
                            }),
                            method: "create",
                            param: {
                                name: this.addForm.t_name,
                                stime: `${this.addForm.time[0].getHours()}:${this.addForm.time[0].getMinutes()}`,
                                sday: `${this.addForm.time[0].getFullYear()}/${this.addForm.time[0].getMonth() +
                                    1}/${this.addForm.time[0].getDate()}`,
                                etime: `${this.addForm.time[1].getHours()}:${this.addForm.time[1].getMinutes()}`,
                                eday: `${this.addForm.time[1].getFullYear()}/${this.addForm.time[1].getMonth() +
                                    1}/${this.addForm.time[1].getDate()}`
                            }
                        };
                    }
                    this.$devProxy(data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["add_success"]
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
        validTime(rule, value, cb) {
            if (!(value instanceof Array)) {
                return cb(new Error(" "));
            }
            cb();
        },
        closeDialog() {
            this.$refs["time-range-form"].resetFields();
        },
        validName(rule, value, cb) {
            var reg = /^\w{3,16}$/;
            if (!reg.test(value)) {
                return cb(new Error(this.langMap.composeRange(3, 16)));
            }
            cb();
        },
        delTimeRange(item, name, flag) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    var data;
                    if (!flag && !data) {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_acl",
                                params: { form: "time_range" }
                            }),
                            method: "delete",
                            param: {
                                name: "all",
                                stime: "",
                                etime: "",
                                day: ""
                            }
                        };
                    }
                    if (flag === "abs") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_acl",
                                params: { form: "time_range" }
                            }),
                            method: "delete",
                            param: {
                                name,
                                time: item.stime,
                                day: item.day
                            }
                        };
                    }
                    if (flag === "rel") {
                        data = {
                            devicelist: [this.dev_ip],
                            url: this.$qs({
                                url: "/switch_acl",
                                params: { form: "time_range" }
                            }),
                            method: "delete",
                            param: {
                                name,
                                time: item.stime
                            }
                        };
                    }
                    this.$devProxy(data)
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>
