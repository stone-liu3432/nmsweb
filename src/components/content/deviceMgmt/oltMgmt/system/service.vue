<template>
    <div>
        <h3>{{ langMap['service'] }}</h3>
        <el-card shadow="hover">
            <div slot="header">
                <span>SNMP</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">{{ langMap['config'] }}</el-button> -->
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form
                        label-width="120px"
                        :model="snmp_trap"
                        :rules="trapRules"
                        ref="snmp-trap-server-form"
                    >
                        <el-form-item label="trap server">
                            <!-- <el-button
                                type="text"
                                style="float: right; margin-right: 10px;"
                            >{{ langMap['config'] }}</el-button>-->
                        </el-form-item>
                        <el-form-item label="server ip" prop="serverip">
                            <el-input v-model="snmp_trap.serverip"></el-input>
                        </el-form-item>
                        <el-form-item label="trap port">
                            <span v-html="snmp_trap.trap_port" style="padding-left: 15px;"></span>
                        </el-form-item>
                        <el-form-item label="trap community" prop="trap_community">
                            <el-input v-model="snmp_trap.trap_community"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                size="small"
                                style="width: 120px;"
                                @click="submitTrapServer('snmp-trap-server-form')"
                            >{{ langMap['apply'] }}</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-form
                        label-width="150px"
                        :model="snmp_community"
                        :rules="commRules"
                        ref="snmp-community-form"
                    >
                        <el-form-item label="SNMP Community">
                            <!-- <el-button type="text">{{ langMap['config'] }}</el-button> -->
                        </el-form-item>
                        <el-form-item label="Community">
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox :label="1">Read community</el-checkbox>
                                <el-checkbox :label="2">Write community</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="Read community" prop="read_community">
                            <el-input v-model="snmp_community.read_community"></el-input>
                        </el-form-item>
                        <el-form-item label="Write community" prop="write_community">
                            <el-input v-model="snmp_community.write_community"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                size="small"
                                style="width: 120px;"
                                @click="submitCommunity('snmp-community-form')"
                            >{{ langMap['apply'] }}</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <br>
        <h3>
            SSH-Key
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openAddModal"
            >{{ langMap['add'] }}</el-button>
        </h3>
        <el-collapse v-model="activeName" accordion v-if="sshd && sshd.length">
            <template v-for="(item, index) in sshd">
                <el-collapse-item :name="item.keyname">
                    <template slot="title">
                        <span>{{ item.keyname }}</span>
                        <el-button
                            type="text"
                            style="margin-left: 30px;"
                            @click.stop="delSsh(item)"
                        >{{ langMap['delete'] }}</el-button>
                    </template>
                    <div>publickey: {{ item.publickey }}</div>
                </el-collapse-item>
            </template>
        </el-collapse>
        <el-dialog :visible.sync="dialogVisible" append-to-body @close="closeModal">
            <span slot="title">{{ `${langMap['add']} SSH key` }}</span>
            <el-form label-width="80px" :model="sshForm" :rules="sshRules" ref="add-ssh-form">
                <el-form-item :label="langMap['name']" prop="keyname">
                    <el-input v-model="sshForm.keyname"></el-input>
                </el-form-item>
                <el-form-item :label="langMap['key']" prop="publickey">
                    <el-input
                        type="textarea"
                        v-model="sshForm.publickey"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or 'ecdsa-sha2-nistp521'"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitAddKey('add-ssh-form')">{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { validatorIpAddr, validatorName } from "@/utils/validator";
import { mapState } from "Vuex";
const validCommunity = (rlue, value, callback) => {
    var reg = /^.{0,16}$/;
    if (!reg.test(value)) {
        return callback(new Error("0-16 characters"));
    }
    callback();
};
const validKey = (rule, value, callback) => {
    var reg = /^.{128,512}$/;
    if(!reg.test(value)){
        return callback(new Error('publickey must be between 128 and 512 characters'));
    }
    callback();
}
export default {
    name: "service",
    computed: {
        ...mapState(["langMap", "dev_ip"])
    },
    data() {
        return {
            snmp_trap: {
                serverip: "",
                trap_port: "",
                trap_community: ""
            },
            snmp_community: {
                read_community: "",
                write_community: ""
            },
            checkList: [],
            sshd: "",
            sshForm: {
                keyname: "",
                publickey: ""
            },
            trapRules: {
                serverip: [
                    { validator: validatorIpAddr, trigger: ["change", "blur"] }
                ],
                trap_community: [
                    { validator: validCommunity, trigger: ["change", "blur"] }
                ]
            },
            commRules: {
                read_community: [
                    { validator: validCommunity, trigger: ["change", "blur"] }
                ],
                write_community: [
                    { validator: validCommunity, trigger: ["change", "blur"] }
                ]
            },
            activeName: "1",
            dialogVisible: false,
            sshRules: {
                keyname: [
                    { validator: validatorName, trigger: ['change', 'blur'] }
                ],
                publickey: [
                    { validator: validKey, trigger: ['change', 'blur'] }
                ]
            }
        };
    },
    created() {
        this.getTrap();
        this.getCommunity();
        this.getSsh();
    },
    methods: {
        getTrap() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({ url: "/snmp_cfg", params: { form: "trap" } }),
                method: "get"
            })
                .then(res => {
                    Object.keys(this.snmp_trap).forEach(item => {
                        this.snmp_trap[item] = "";
                    });
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            Object.keys(this.snmp_trap).forEach(item => {
                                this.snmp_trap[item] = res.data.data[item];
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        getCommunity() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/snmp_cfg",
                    params: { form: "community" }
                }),
                method: "get"
            })
                .then(res => {
                    Object.keys(this.snmp_community).forEach(item => {
                        this.snmp_community[item] = "";
                    });
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            Object.keys(this.snmp_community).forEach(item => {
                                this.snmp_community[item] = res.data.data[item];
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        getSsh() {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/system_service",
                    params: { form: "sshd" }
                }),
                method: "get"
            })
                .then(res => {
                    this.sshd = "";
                    if (res.data.code === 1) {
                        if (res.data.data && res.data.data.length) {
                            this.sshd = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        submitTrapServer(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/snmp_cfg",
                            params: { form: "trap" }
                        }),
                        method: "set",
                        param: {
                            serverip: this.snmp_trap.serverip,
                            trap_port: this.snmp_trap.trap_port,
                            trap_community: this.snmp_trap.trap_community.replace(
                                /\s*/g,
                                ""
                            )
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getTrap();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                }
            });
        },
        submitCommunity(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (!this.checkList.length) {
                        return;
                    }
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/snmp_cfg",
                            params: { form: "community" }
                        }),
                        method: "set",
                        param: {
                            flags: this.checkList.reduce(
                                (initValue, item) => initValue + item
                            ),
                            read_community: this.snmp_community.read_community.replace(
                                /\s*/g,
                                ""
                            ),
                            write_community: this.snmp_community.write_community.replace(
                                /\s*/g,
                                ""
                            )
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["set_success"]
                                );
                                this.getCommunity();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                }
            });
        },
        delSsh(node) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_service",
                            params: { form: "sshd" }
                        }),
                        method: "delete",
                        param: {
                            keyname: node.keyname
                        }
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["delete_success"]
                                );
                                this.getSsh();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        openAddModal() {
            this.dialogVisible = true;
        },
        submitAddKey(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_service",
                            params: { form: "sshd" }
                        }),
                        method: "add",
                        param: {
                            keyname: this.sshForm.keyname,
                            publickey: this.sshForm.publickey
                        }
                    }).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success(this.langMap['add_success']);
                            this.getSsh();
                            this.dialogVisible = false;
                        }else{
                            this.$message.error(res.data.message);
                        }
                    }).catch(err =>{})
                }
            })
        },
        closeModal(){
            this.$refs['add-ssh-form'].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
