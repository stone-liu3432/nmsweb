<template>
    <div>
        <h3>{{ langMap['configMgmt'] }}</h3>
        <!-- 恢复配置 -->
        <el-row>
            <el-col
                style="height: 32px; line-height: 32px;"
                :span="4"
            >{{ langMap['restore_config'] }}</el-col>
            <el-col :span="8">
                <el-upload
                    :http-request="uploadConfig"
                    action="placeholder"
                    :limit="1"
                    :multiple="false"
                    :auto-upload="false"
                    ref="dev-config-upload-file"
                >
                    <el-button
                        slot="trigger"
                        size="small"
                        type="primary"
                    >{{ langMap['file_click'] }}</el-button>
                    <el-button
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="submitUpload"
                    >{{ langMap['restore_config'] }}</el-button>
                </el-upload>
            </el-col>
            <el-col
                style="height: 32px; line-height: 32px;"
                :span="12"
            >{{ langMap['res_cfg_info'] }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 备份配置 -->
        <el-row style="height: 32px; line-height: 32px;">
            <el-col :span="4">{{ langMap['backup_config'] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    style="width: 100%;"
                    @click="backupConfig"
                >{{ langMap['backup_config'] }}</el-button>
            </el-col>
            <el-col :span="15" :offset="1">{{ langMap['bkup_cfg_info'] }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 恢复出厂设置 -->
        <el-row style="height: 32px; line-height: 32px;">
            <el-col :span="4">{{ langMap['default_config'] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    style="width: 100%;"
                    @click="defCfg"
                >{{ langMap['default_config'] }}</el-button>
            </el-col>
            <el-col :span="15" :offset="1">{{ langMap['def_cfg_info'] }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 配置保存 -->
        <el-row style="height: 32px; line-height: 32px;">
            <el-col :span="4">{{ langMap['save_config'] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    style="width: 100%;"
                    @click="saveConfig"
                >{{ langMap['save_config'] }}</el-button>
            </el-col>
            <el-col :span="15" :offset="1">{{ langMap['save_cfg_info'] }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 查看当前配置 -->
        <el-row style="height: 32px; line-height: 32px;">
            <el-col :span="4">{{ langMap['view_cfg'] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    style="width: 100%;"
                    @click="downloadCurrentConfig"
                >{{ langMap['view_cfg'] }}</el-button>
            </el-col>
            <el-col :span="15" :offset="1">{{ langMap['view_cfg_tips'] }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 重启设备 -->
        <el-row style="height: 32px; line-height: 32px;">
            <el-col :span="4">{{ langMap['reboot'] }}</el-col>
            <el-col :span="4">
                <el-button
                    type="primary"
                    size="small"
                    style="width: 100%;"
                    @click="rebootOlt"
                >{{ langMap['reboot'] }}</el-button>
            </el-col>
            <el-col :span="15" :offset="1">{{ langMap['reboot_olt'] }}</el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "devMgmt",
    computed: {
        ...mapState(["langMap", "dev_ip"])
    },
    data() {
        return {};
    },
    created() {},
    methods: {
        uploadConfig(item) {
            var formData = new FormData();
            formData.append("file", item.file);
            formData.append('devicelist', this.dev_ip);
            formData.append("method", "post");
            formData.append("url", "/system_restore");
            this.$http
                .post("/api/fileproxy", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 0
                })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(
                            this.langMap["restore_config_succ"]
                        );
                    } else {
                        this.$message.error(
                            this.langMap["restore_config_fail"]
                        );
                    }
                })
                .catch(err => {});
        },
        submitUpload() {
            this.$refs["dev-config-upload-file"].submit();
        },
        rebootOlt() {
            this.$confirm(
                this.langMap["reboot_olt_hit"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
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
        },
        saveConfig() {
            this.$confirm(
                this.langMap["save_cfg_confirm"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_save"
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["save_succ"]
                                );
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        defCfg() {
            this.$confirm(this.langMap["def_cfg_hit"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_def_config"
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap["def_cfg_succ"]
                                );
                            } else {
                                this.$message.error(
                                    this.langMap["default_config_fail"]
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        backupConfig() {
            this.$confirm(
                this.langMap["backup_config_tips"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_backup"
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.downloadFile(res.data.data.filename);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        downloadFile(filename) {
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: `/${filename}`,
                method: "get"
            })
                .then(res => {
                    var content = res.data;
                    var data = new Blob([content], {
                        type: "text/plain;charset=UTF-8"
                    });
                    var downloadUrl = window.URL.createObjectURL(data);
                    var anchor = document.createElement("a");
                    anchor.href = downloadUrl;
                    anchor.download = `${filename}`;
                    anchor.click();
                    window.URL.revokeObjectURL(data);
                })
                .catch(err => {});
        },
        downloadCurrentConfig() {
            this.$confirm(
                this.langMap["current_cfg_tips"],
                this.langMap["tips"],
                {
                    type: "warning"
                }
            )
                .then(_ => {
                    this.$devProxy({
                        devicelist: [this.dev_ip],
                        url: this.$qs({
                            url: "/system_running_config"
                        }),
                        method: "get"
                    })
                        .then(res => {
                            if (res.data.code === 1) {
                                this.downloadFile("oltconfigtmp.txt");
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
