<template>
    <el-header>
        <div class="layout-logo"></div>
        <el-menu :default-active="activeIndex" mode="horizontal" router>
            <template v-for="(item, index) in menu" v-if="menu">
                <el-menu-item :index="item.name" v-if="!item.children">{{ item.name }}</el-menu-item>
                <el-submenu :index="item.name" v-if="item.children">
                    <template slot="title">
                        {{ item.name }}
                    </template>
                    <el-menu-item :index="_item.name" v-for="(_item, _index) in item.children" :key="_index">
                        {{ _item.name }}
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </el-header>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
    name: 'navHeader',
    computed: {
        ...mapState(['menu', 'theme'])
    },
    data(){
        return {
            activeIndex: 'home'
        }
    },
    created(){
        
    },
    methods: {
        ...mapMutations({
            updateBreadcrumb: 'updateBreadcrumb',
        }),
    },
    mounted(){
        //  刷新页面时的菜单状态恢复
        this.$nextTick(() =>{
            var activeIndex = this.$route.path.slice(1) || 'home';
            this.activeIndex = activeIndex;
            this.updateBreadcrumb(this.activeIndex);
        })
    },
    watch: {
        '$route'(){
            this.activeIndex = this.$route.path.slice(1);
            this.updateBreadcrumb(this.activeIndex);
        }
    }
}
</script>

<style lang="less" scoped>
.layout-logo{
    height: inherit;
    width: 200px;
    background: #aaa;
    float: left;
}
header{
    border-bottom: 1px solid #e6e6e6;
    >ul{
        float: right;
        margin-right: 30px;
    }
}
.header-dark{
    background: #515a6e;
}
.header-light{
    background: #fff;
    >ul:after{
        background: #fff;
    }
}
.header-primary{
    background: #2D8CF0;
}
</style>
