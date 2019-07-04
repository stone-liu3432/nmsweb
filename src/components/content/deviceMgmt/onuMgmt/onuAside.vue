<template>
    <el-menu :default-active="defMenuItem" @select="changeMenu">
        <template v-for="item in onuMenu">
            <el-menu-item :index="item.name">
                <span slot="title">{{ langMap[item.name] || item }}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
import { mapState } from "Vuex";
import onuMenu from "@/config/onuMenu";
export default {
    name: "onuAside",
    computed: mapState(["langMap"]),
    data() {
        return {
            onuMenu,
            defMenuItem: 'onu_basic_info'
        };
    },
    created() {
        this.$emit('menu-change', this.defMenuItem);
    },
    methods: {
        changeMenu(val){
            this.$emit('menu-change', val);
        }
    }
};
</script>

<style lang="less" scoped>
</style>
