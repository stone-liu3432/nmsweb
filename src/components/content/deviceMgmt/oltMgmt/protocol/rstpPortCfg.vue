<template>
    <el-form :model="portForm" :rules="portRules" label-width="140px" size="small" ref="rstp-port-config-form">
        <el-form-item :label="langMap['port_id']" prop="port_id">
            <el-select v-model.number="portForm.port_id">
                <template v-for="(item,index) in port_name" v-if="index > basicInfo.ponports">
                    <el-option :value="Number(index)" :label="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['port_priority']" prop="port_priority">
            <el-select v-model.number="portForm.port_priority">
                <template v-for="item in portPris">
                    <el-option :value="item"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['port_path_cost']" prop="port_path_cost">
            <el-input v-model.number="portForm.port_path_cost"></el-input>
        </el-form-item>
        <el-form-item :label="langMap['edge_status']" prop="edge_status">
            <el-select v-model.number="portForm.edge_status">
                <el-option :value="0" label="Nedge"></el-option>
                <el-option :value="1" label="Edge"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="langMap['admin_link_type']" prop="admin_link_type">
            <el-select v-model="portForm.admin_link_type">
                <el-option value="auto"></el-option>
                <el-option value="p2p"></el-option>
                <el-option value="shared"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "rstpPortCfg",
    computed: {
        ...mapState(["langMap", "port_name", "basicInfo"])
    },
    props: {
        portInfo: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            portPris: [],
            portForm: {
                port_id: 0,
                port_priority: 0,
                port_path_cost: 0,
                edge_status: 0,
                admin_link_type: "auto",
            },
            portRules: {
                port_path_cost: [
                    { validator: this.validRange(0, 200000000), trigger: ['change', 'blur'] }
                ]
            }
        };
    },
    created() {
        (ctx =>{
            var n = 16, i = 0, max = 240;
            while(n * i <= max){
                ctx.portPris.push(n * i);
                i++;
            }
        })(this)
        this.portForm.port_id = this.basicInfo.ponports + 1;
    },
    methods: {
        validRange(min,max){
            return (rule, value, cb) => {
                if(value < min || value > max || isNaN(value)){
                    return cb(new Error(`Range: ${min} - ${max}`));
                }
                cb();
            }
        },
        validForm(){
            var flag = false;
            this.$refs['rstp-port-config-form'].validate(valid =>{
                flag = valid;
            })
            return flag;
        }
    },
    watch: {
        'portForm.port_id'(val){
            this.portInfo.forEach(item =>{
                if(item.port_id === this.portForm.port_id){
                    Object.keys(this.portForm).forEach(_item =>{
                        this.portForm[_item] = item[_item];
                    })
                }
            })
        }
    }
};
</script>

<style lang="less" scoped>
</style>
