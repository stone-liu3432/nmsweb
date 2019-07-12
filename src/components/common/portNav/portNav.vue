<template>
    <div>
        <h3 class="port-nav-title" style="float: left;">
            <slot name="title"></slot>
        </h3>
        <el-form label-width="140px" inline size="small" style="line-height: 51px;">
            <el-form-item :label="langMap['port_id']">
                <el-select v-model.number="port_id">
                    <template v-for="(item, key) in port_name">
                        <el-option :value="Number(key)" :label="item" v-if="labelName(key)"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="langMap['onu_id']" v-if="onu && Object.keys(onulist).length">
                <el-select v-model.number="onu_id">
                    <template v-for="(item, index) in onulist">
                        <el-option :value="Number(index)" :label="item"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label-width="0">
                <slot name="action"></slot>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "portNav",
    props: {
        type: {
            type: String,
            default: "pon"
        },
        onu: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo", "dev_ip"]),
    },
    data() {
        return {
            port_id: 1,
            onu_id: 1,
            onulist: {}
        };
    },
    created() {
        this.onu && this.getSrc(this.port_id);
        this.$emit('port-change', this.port_id);
    },
    methods: {
        labelName(key) {
            return this.type.toLowerCase() === "pon"
                ? key <= this.basicInfo.ponports
                : true;
        },
        //  获取当前PON口下的onu列表
        getSrc(port_id) {
            var onu_flag = this.onu_id;
            this.$devProxy({
                devicelist: [this.dev_ip],
                url: this.$qs({
                    url: "/onu_allow_list",
                    params: { form: "resource", port_id }
                }),
                method: "get"
            })
                .then(res => {
                    this.onulist = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            var onulist = this.analysis(res.data.data.resource);
                            onulist.length && (this.onu_id = onulist[0]);
                            onulist.forEach(item => {
                                var name =
                                    item < 10
                                        ? `ONU${res.data.data.port_id}/0${item}`
                                        : `ONU${res.data.data.port_id}/${item}`;
                                this.onulist[item] = name;
                            });
                            if(onu_flag === this.onu_id){
                                this.$emit('onu-change', this.port_id, this.onu_id);
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        analysis(str) {
            if (!str) return [];
            var result = [];
            var arr = str.split(",");
            for (var i = 0, len = arr.length; i < len; i++) {
                var substrs = arr[i];
                if (substrs.indexOf("-") !== -1) {
                    var subArr = substrs.split("-");
                    var min = Number(subArr[0]),
                        max = Number(subArr[subArr.length - 1]);
                    if (isNaN(min) || isNaN(max)) {
                        return [];
                    }
                    for (var j = 0; j <= max - min; j++) {
                        result.push(min + j);
                    }
                } else {
                    if (isNaN(Number(substrs))) {
                        return [];
                    }
                    result.push(Number(substrs));
                }
            }
            return result.filter(item => !!item);
        }
    },
    watch: {
        port_id(){
            this.$emit('port-change', this.port_id);
            this.onu && this.getSrc(this.port_id);
        },
        onu_id(){
            this.$emit('onu-change', this.port_id, this.onu_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
