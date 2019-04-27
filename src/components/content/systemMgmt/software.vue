<template>
    <div slot="label">
        <h3>软件版本</h3>
        <el-collapse v-model="activeName" accordion class="sw-type-header">
            <el-collapse-item title="查看支持的软件版本" name="1">
                <div class="collapse-margin">
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
                    <el-table-column prop="name" :label="lanMap['name']"></el-table-column>
                    <el-table-column prop="updater" :label="lanMap['updater']"></el-table-column>
                    <el-table-column prop="reason" :label="lanMap['reason']"></el-table-column>
                    <el-table-column fixed="right" :label="lanMap['config']" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="delType(scope.row)">{{ lanMap['delete'] }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right;"
                    @current-change="typeCurrentChange"
                    :current-page="currentPageType"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="swType.length"
                    v-if="swType.length > pageSize"
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
            <el-table-column prop="name" :label="lanMap['name']"></el-table-column>
            <el-table-column prop="filename" :label="lanMap['filename']"></el-table-column>
            <el-table-column prop="version" :label="lanMap['version']"></el-table-column>
            <el-table-column prop="type" :label="lanMap['type']"></el-table-column>
            <el-table-column prop="size" :label="lanMap['size']"></el-table-column>
            <el-table-column prop="compiletime" :label="lanMap['compiletime']"></el-table-column>
            <el-table-column prop="storagetime" :label="lanMap['storagetime']"></el-table-column>
            <el-table-column prop="storager" :label="lanMap['storager']"></el-table-column>
            <el-table-column prop="description" :label="lanMap['description']"></el-table-column>
            <el-table-column fixed="right" :label="lanMap['config']" width="80">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="delStorage(scope.row)">{{ lanMap['delete'] }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;"
            @current-change="storageCurrentChange"
            :current-page="currentPageStorage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="sw.length"
            v-if="sw.length > pageSize"
        ></el-pagination>
        <el-dialog
            :title="lanMap['tips']"
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
                <el-button @click="closeModal">{{ lanMap['cancel'] }}</el-button>
                <el-button
                    type="primary"
                    @click="submitUpload"
                    v-if="modalType === 'updateFile'"
                >{{ lanMap['apply'] }}</el-button>
                <el-button type="primary" @click="submitAddType" v-if="modalType === 'addType'">{{ lanMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import swUpdateFile from "./swUpdateFile";
import addType from "./addType";
import { mapState,mapMutations } from 'vuex'
export default {
    name: "software",
    components: { swUpdateFile, addType },
    computed: mapState(['lanMap']),
    data() {
        return {
            sw: [],
            swType: [],
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
        getSw(){
            this.$http.get('/api/server/software').then(res =>{
                if(res.data.code === 1){
                    this.sw = res.data.data;
                    this.currentPageStorage = 1;
                    if(this.sw && this.sw.length){
                        if(this.sw.length > this.pageSize){
                            this.softwareStorage = this.sw.slice(0, this.pageSize);
                        }else{
                            this.softwareStorage = this.sw;
                        }
                    }else{
                        this.sw = [];
                        this.softwareStorage = [];
                    }
                }else{
                    this.sw = [];
                    this.softwareStorage = [];
                }
            }).catch(err =>{

            })
            
        },
        getSwType(){
            this.$http.get('/api/server/softwaretype').then(res =>{
                if(res.data.code === 1){
                    this.swType = res.data.data;
                    this.currentPageType = 1;
                    if(this.swType && this.swType.length){
                        if(this.swType.length > this.pageSize){
                            this.softwareTypes = this.swType.slice(0, this.pageSize);
                        }else{
                            this.softwareTypes = this.swType;
                        }
                    }else{
                        this.swType = [];
                        this.softwareTypes = [];
                    }
                }else{
                    this.swType = [];
                    this.softwareTypes = [];
                }
            }).catch(err =>{

            })

        },
        typeSelectionChange(val) {
            this.typeSelection = val;
        },
        storageSelectionChange(val) {
            this.storageSelection = val;
        },
        typeCurrentChange(val) {
            this.currentPageType = val;
            var start = this.pageSize * (val - 1);
            if(start + this.pageSize > this.swType.length){
                this.softwareTypes = this.swType.slice(start);
            }else{
                this.softwareTypes = this.swType.slice(start, this.pageSize);
            }
        },
        storageCurrentChange(val) {
            this.currentPageStorage = val;
            var start = this.pageSize * (val - 1);
            if(start + this.pageSize > this.sw.length){
                this.softwareStorage = this.sw.slice(start);
            }else{
                this.softwareStorage = this.sw.slice(start, this.pageSize);
            }
        },
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
            if (!node.fData.label) {
                this.$message("label");
                return;
            }
            this.$http({
                url: "/api/server/upload",
                method: "post",
                params: { name: node.fData.name, label: node.fData.label },
                data: node.fData.file,
                headers: { "content-type": "multipart/form-data" },
                onUploadProgress: function (progressEvent) {
                    console.log(progressEvent);
                },
            })
                .then(res => {})
                .catch(err => {
                    // to do
                });
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
            var data = {
                method: "add",
                param: {
                    name: node.fData.name,
                    updater: "admin",
                    reason: node.fData.reason,
                }
            };
            this.$http.post('/api/server/softwaretype', data).then(res => {

            }).catch(err =>{

            })
        },
        delTypeBatch() {
            return this.$message("暂未支持");
            if (!this.typeSelection.length) {
                this.$message("type no selection");
                return;
            }
            console.log("del type batch");
        },
        delSWBatch() {
            return this.$message("暂未支持");
            if (!this.storageSelection.length) {
                this.$message("storage no selection");
                return;
            }
            console.log("del storage batch");
        },
        delType(node) {
            this.$confirm("是否确认删除？", this.lanMap['tips'], {
                confirmButtonText: this.lanMap['apply'],
                cancelButtonText: this.lanMap['cancel'],
                type: "warning"
            })
                .then(_ => {
                    var param = {
                        method: "delete",
                        param: {
                            name: node.name
                        }
                    };
                    this.$http.post('/api/server/softwaretype', data).then(res =>{
                        if(res.data.code === 1){

                        }else{

                        }
                    }).catch(err =>{

                    })
                })
                .catch(_ => {
                    
                });
        },
        delStorage(node) {
            this.$confirm("是否确认删除？", this.lanMap['tips'], {
                confirmButtonText: this.lanMap['apply'],
                cancelButtonText: this.lanMap['cancel'],
                type: "warning"
            })
                .then(_ => {
                    var param = {
                        method: "delete",
                        param: {
                            name: node.filename
                        }
                    };
                    this.$http.post('/api/server/software', data).then(res =>{
                        if(res.data.code === 1){

                        }else{

                        }
                    }).catch(err =>{

                    })
                })
                .catch(_ => {
                    
                });
        }
    },
    mounted() {},
    beforeDestroy() {}
};
</script>

<style lang="less" scoped>
</style>
