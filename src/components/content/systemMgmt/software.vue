<template>
    <div slot="label">
        <h3>软件版本</h3>
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="查看支持的软件版本" name="1">
                <div>
                    <el-button type="primary" size="small" @click="openModal('addType')">添加软件版本</el-button>
                    <el-button type="danger" size="small" @click="delTypeBatch">删除选中</el-button>
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
                    <el-table-column prop="name" label="软件类型"></el-table-column>
                    <el-table-column prop="updater" label="创建者"></el-table-column>
                    <el-table-column prop="reason" label="创建原因"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right;"
                    @current-change="typeCurrentChange"
                    :current-page="currentPageType"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="400"
                ></el-pagination>
            </el-collapse-item>
        </el-collapse>
        <h3>软件库</h3>
        <div>
            <el-button type="primary" size="small" @click="openModal('updateFile')">上传软件</el-button>
            <el-button size="small" type="danger" @click="delSWBatch">删除选中</el-button>
        </div>
        <el-table
            :data="softwareStorage"
            border
            style="width: 100%"
            @selection-change="storageSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="filename" label="文件名"></el-table-column>
            <el-table-column prop="version" label="版本号"></el-table-column>
            <el-table-column prop="type" label="软件类型"></el-table-column>
            <el-table-column prop="size" label="文件大小"></el-table-column>
            <el-table-column prop="compiletime" label="编辑时间"></el-table-column>
            <el-table-column prop="storagetime" label="上传时间"></el-table-column>
            <el-table-column prop="storager" label="上传者"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="storageCurrentChange"
            :current-page="currentPageStorage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="400"
        ></el-pagination>
        <el-dialog
            title="提示"
            width="40%"
            ref="swModal"
            center
            :visible="!!modalType"
            :before-close="closeModal"
            v-if="!!modalType"
        >
            <sw-update-file ref="swUpdateFile" v-if="modalType === 'updateFile'"></sw-update-file>
            <add-type ref="addType" v-if="modalType === 'addType'"></add-type>
            <span slot="footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitUpload"
                    v-if="modalType === 'updateFile'"
                >确 定</el-button>
                <el-button type="primary" @click="submitAddType" v-if="modalType === 'addType'">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import swUpdateFile from "./swUpdateFile";
import addType from "./addType";
export default {
    name: "software",
    components: { swUpdateFile, addType },
    data() {
        return {
            activeName: "",
            softwareTypes: [
                {
                    name: "zteonu",
                    updater: "admin",
                    reason: "for upgrade zte onu",
                    timestamp: "2019/01/01 09:09:09"
                }
            ],
            typeSelection: [],
            storageSelection: [],
            currentPageType: 1,
            currentPageStorage: 1,
            pageSize: 10,
            softwareStorage: [
                {
                    name: "label_firmware",
                    filename: "firmware.img",
                    version: "epon_firmware_I_V2.0.3_Rel",
                    type: "firmware",
                    size: 123,
                    compiletime: "2019/01/01 01:01:01",
                    storagetime: "2019/01/01 01:01:01",
                    storager: "admin",
                    description: "for new firmware"
                }
            ],
            fileData: "",
            filename: "选择文件",
            modalType: ""
        };
    },
    created() {},
    methods: {
        typeSelectionChange(val) {
            this.typeSelection = val;
        },
        storageSelectionChange(val) {
            this.storageSelection = val;
        },
        typeCurrentChange(val) {},
        storageCurrentChange(val) {},
        submitUpload() {
            var node = this.$refs.swUpdateFile;
            if (!/^\w{3,16}$/.test(node.fData.name)) {
                this.$message("name");
                return;
            }
            if (!node.fData.file) {
                this.$message("file");
                return;
            }
            console.log("upload file");
        },
        openModal(str) {
            this.modalType = str;
        },
        closeModal(done) {
            if (typeof done === "function") {
                done();
            }
            this.modalType = "";
        },
        submitAddType() {
            var node = this.$refs.addType;
            if (!/^\w{3,16}$/.test(node.fData.name)) {
                this.$message("name");
                return;
            }
            console.log("add type");
        },
        delTypeBatch() {
            if (!this.typeSelection.length) {
                this.$message("type no selection");
                return;
            }
            console.log("del type batch");
        },
        delSWBatch() {
            if (!this.storageSelection.length) {
                this.$message("storage no selection");
                return;
            }
            console.log("del storage batch");
        }
    },
    mounted() {},
    beforeDestroy() {}
};
</script>

<style lang="less" scoped>
</style>
