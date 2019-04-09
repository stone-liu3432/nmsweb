<template>
    <div class="layout">
        <Header>
            <Menu mode="horizontal" theme="dark" :active-name="activeName" ref="navMenu" @on-select="changeMenu">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <div v-for="(item, index) in menu" :key="index" v-if="menu">
                        <MenuItem :name="item.name" v-if="!item.children">{{ item.name }}</MenuItem>
                        <Submenu :name="item.name" v-if="item.children">
                            <template slot="title">
                                {{ item.name }}
                            </template>
                            <MenuItem v-for="(_item, _index) in item.children" :key="_item.name" :name="_item.name">
                                {{ _item.name }}
                            </MenuItem>
                        </Submenu>
                    </div>
                </div>
            </Menu>
        </Header>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    name: 'navHeader',
    computed: {
        ...mapState(['menu'])
    },
    data(){
        return {
            activeName: 'home'
        }
    },
    created(){
        
    },
    methods: {
        changeMenu(name){
            this.$router.push(name);
        }
    },
    mounted(){
        this.$nextTick(() =>{
            this.activeName = this.$route.path.slice(1) || 'home';
            this.$refs.navMenu.updateActiveName();
        })
        
    }
}
</script>

<style lang="less" scoped>
.layout{
    border: 1px solid #d7dde4;
    border-top: none;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    margin: 0 auto;
    margin-right: 20px;
    float: right;
    >div{
        display: inline-block;
    }
}
</style>
