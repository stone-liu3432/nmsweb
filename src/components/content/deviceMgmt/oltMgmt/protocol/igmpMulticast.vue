<template>
    <div>
        <h3>
            {{ langMap['multicast_table'] }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ langMap['add'] + langMap['static_table'] }}</el-button>
        </h3>
        <el-table :data="multicast" border stripe>
            <el-table-column prop="multi_ip" :label="langMap['multi_ip']"></el-table-column>
            <el-table-column prop="vid" :label="langMap['vid']"></el-table-column>
            <el-table-column prop="action" :formatter="formatAction" :label="langMap['action']"></el-table-column>
            <el-table-column
                prop="host_portlist"
                :formatter="formatPortlist"
                :label="langMap['host_portlist']"
            ></el-table-column>
            <el-table-column
                prop="router_portlist"
                :formatter="formatPortlist"
                :label="langMap['router_portlist']"
            ></el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeDialog">
            <span slot="title">{{ langMap['add'] }}</span>
            <el-form
                :model="addForm"
                :rules="addRules"
                size="small"
                ref="igmp-add-multicast-form"
                label-width="140px"
            >
                <el-form-item :label="langMap['multi_ip']" prop="multi_ip">
                    <el-input v-model="addForm.multi_ip"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['vid']" prop="vid">
                    <el-input v-model.number="addForm.vid"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['port_id']" prop="port_id">
                    <el-select v-model.number="addForm.port_id">
                        <template v-for="(item, key) in port_name">
                            <el-option :value="Number(key)" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('igmp-add-multicast-form')"
                >{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { validatorIpAddr, validatorVlan } from "@/utils/validator";
import { analysisPortList, generatorPortName } from "@/utils/common";
export default {
    name: "igmpMulticast",
    computed: {
        ...mapState([
            "langMap",
            "port_name",
            "basicInfo",
            "dev_ip",
            "timestamp"
        ])
    },
    data() {
        return {
            multicast: [],
            dialogVisible: false,
            addForm: {
                multi_ip: "",
                vid: "",
                port_id: 1
            },
            addRules: {
                multi_ip: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                vid: [{ validator: validatorVlan, trigger: ["change", "blur"] }]
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
                    url: "/switch_igmp",
                    params: { form: "entry" }
                }),
                method: "get"
            })
                .then(res => {
                    this.multicast = [];
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.multicast = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        formatAction(row, col) {
            return row[col.property] ? "static" : "dynamic";
        },
        openDialog() {
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/switch_igmp",
                            params: { form: "static_entry" }
                        }),
                        method: "add",
                        param: {
                            multi_ip: this.addForm.multi_ip,
                            vid: this.addForm.vid,
                            port_id: this.addForm.port_id
                        }
                    })
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
        closeDialog() {
            this.$refs["igmp-add-multicast-form"].resetFields();
        },
        formatPortlist(row, col) {
            return generatorPortName(
                analysisPortList(row[col.property]),
                this.port_name
            );
        }
    },
    watch: {
        timestamp() {
            this.getData();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
