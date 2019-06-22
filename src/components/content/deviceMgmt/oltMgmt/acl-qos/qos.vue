<template>
    <div>
        <h3>QoS</h3>
        <h3 style="margin: 26px 0;">
            <span>{{ langMap['mode'] }}:</span>
            <span style="margin-left: 20px;">{{ qos.cmode }}</span>
        </h3>
        <h3>
            {{ langMap['priority'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('priority')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <template v-for="(item, index) in qos.cosq">
            <el-row
                :style="{ 'padding': '8px 0', 'border-top': '1px solid #ddd', 'border-bottom': index === qos.cosq.length - 1 ? '1px solid #ddd' : '' }"
            >
                <el-col :span="4" style="margin-left: 8px;">
                    <span>{{ langMap['priority'] }}:</span>
                    <span style="margin-left: 12px;">{{ index }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['queue'] }}:</span>
                    <span style="margin-left: 12px;">{{ item }}</span>
                </el-col>
            </el-row>
        </template>
        <h3 style="margin-top: 26px;">
            {{ langMap['queue_scheduler'] }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('weight')"
            >{{ langMap['config'] }}</el-button>
        </h3>
        <template v-for="(item, index) in qos.queue">
            <el-row
                :style="{ 'padding': '8px 0', 'border-top': '1px solid #ddd', 'border-bottom': index === qos.cosq.length - 1 ? '1px solid #ddd' : '' }"
            >
                <el-col :span="4" style="margin-left: 8px;">
                    <span>{{ langMap['cos'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.cos }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['mode'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.mode }}</span>
                </el-col>
                <el-col :span="4">
                    <span>{{ langMap['weight'] }}:</span>
                    <span style="margin-left: 12px;">{{ item.weight }}</span>
                </el-col>
            </el-row>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ `${langMap['config']}${langMap[dialogFlag]}` }}</span>
            <el-form :model="formData" :rules="formRules" label-width="140px" ref="qos-mgmt-form">
                <el-form-item :label="langMap['mode']" v-if="dialogFlag === 'weight'">
                    <el-select v-model.number="formData.mode">
                        <el-option :value="1" label="strict-priority"></el-option>
                        <el-option :value="2" label="WRR"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitForm('qos-mgmt-form')">{{ langMap['apply'] }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "qosMgmt",
    computed: {
        ...mapState(["langMap", "port_name", "dev_ip"])
    },
    data() {
        return {
            qos: {},
            dialogVisible: false,
            formData: {
                mode: 1
            },
            formRules: {},
            dialogFlag: ''
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
                    url: "/switch_qos",
                    params: { form: "qos" }
                }),
                method: "get"
            })
                .then(res => {
                    this.qos = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.qos = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(flag){
            this.dialogFlag = flag;
            this.dialogVisible = true;
        },
        submitForm(formName){

        }
    }
};
</script>

<style lang="less" scoped>
</style>
