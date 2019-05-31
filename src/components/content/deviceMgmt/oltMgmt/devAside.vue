<template>
    <el-menu :default-active="activeName" ref="dev_menu" unique-opened @select="handleMenuClick">
        <template v-for="(item, index) in menu">
            <el-menu-item v-if="!item.children" :index="item.name">{{ langMap[item.name] }}</el-menu-item>
            <el-submenu v-if="item.children" :index="item.name">
                <template slot="title">{{ langMap[item.name] || item.name }}</template>
                <el-menu-item
                    v-for="(_item, _index) in item.children"
                    :key="_index"
                    :index="_item.name"
                >{{ langMap[_item.name] || _item.name }}</el-menu-item>
            </el-submenu>
        </template>
    </el-menu>
</template>

<script>
import { mapState } from "Vuex";
import devMenu from "@/config/devMenu";
export default {
    name: "devAside",
    computed: mapState(["langMap"]),
    data() {
        return {
            menu: devMenu,
            activeName: "running_status"
        };
    },
    methods: {
        handleMenuClick(index, indexPath) {
            this.$emit("menu-change", index);
            if(indexPath.length === 1){
                this.$refs['dev_menu'].openedMenus = [];
            }
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
</style>
