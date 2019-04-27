<template>
    <div>
        <el-table :data="alertTable" border style="width: 100%; margin-top: 20px;">
            <el-table-column prop="alarm_id" :label="lanMap['alarm_id']" width="80"></el-table-column>
            <el-table-column prop="source" :label="lanMap['source']"></el-table-column>
            <el-table-column prop="macaddr" :label="lanMap['macaddr']"></el-table-column>
            <el-table-column prop="type" :label="lanMap['type']" width="80"></el-table-column>
            <el-table-column prop="level" :label="lanMap['level']" width="80"></el-table-column>
            <el-table-column prop="location" :label="lanMap['location']"></el-table-column>
            <el-table-column prop="description" :label="lanMap['description']"></el-table-column>
            <el-table-column prop="timestamp" :label="lanMap['timestamp']"></el-table-column>
            <div slot="empty">{{ lanMap['empty'] }}</div>
        </el-table>
        <el-pagination
            style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="alert.length"
            v-if="alertTable.length > pageSize"
        ></el-pagination>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { pageSizes } from '@/utils/common-data'
export default {
    name: "alert",
    computed: mapState(['lanMap']),
    data() {
        return {
            alert: [],
            alertTable: [
                {
                    alarm_id: 0x1001,
                    source: "192.168.100.171",
                    macaddr: "38:3a:21:20:01:01",
                    type: 1,
                    level: 2,
                    location: 65792,
                    description: "ONU LINK UP",
                    timestamp: "2019/01/01 09:09:09"
                }
            ],
            currentPage: 1,
            pageSize: 20,
            pageSizes,

        }
    },
    created(){
        this.getData();
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            var pre = this.pageSize * (this.currentPage - 1);
            if(pre + this.pageSize > this.alert.length){
                this.alertTable = this.alert.slice(pre);
            }else{
                this.alertTable = this.alert.slice(pre, this.pageSize);
            }
        },
        getData(){
            this.$http.get('/api/alarm').then(res =>{
                if(res.data.code === 1){
                    this.alert = res.data.data;
                    this.currentPage = 1;
                    if(this.alert && this.alert.length){
                        if(this.alert.length > this.pageSize){
                            this.alertTable = this.alert.slice(this.currentPage - 1, this.pageSize* this.currentPage);
                        }else{
                            this.alertTable = this.alert;
                        }
                    }
                }else{
                    this.alert = [];
                    this.alertTable = [];
                }
            }).catch(err =>{

            })
        }
    },
};
</script>

<style lang="less" scoped>
</style>
