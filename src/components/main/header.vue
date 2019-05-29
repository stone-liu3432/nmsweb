<template>
    <el-header>
        <div class="layout-logo"></div>
        <el-dropdown @command="handleCommand" class="layout-user">
            <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="realtimealarm">{{ wsState ? langMap['close_rt_alarm'] : langMap['open_rt_alarm'] }}</el-dropdown-item>
                <el-dropdown-item command="logout">{{ langMap['logout'] }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-menu :default-active="activeIndex" mode="horizontal" router>
            <template v-for="(item, index) in menu" v-if="menu">
                <el-menu-item :index="item.name" v-if="!item.children">{{ langMap[item.name] }}</el-menu-item>
                <el-submenu :index="item.name" v-if="item.children">
                    <template slot="title">{{ langMap[item.name] }}</template>
                    <el-menu-item
                        :index="_item.name"
                        v-for="(_item, _index) in item.children"
                        :key="_index"
                    >{{ langMap[_item.name] }}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </el-header>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
export default {
    name: "navHeader",
    computed: {
        ...mapState(["menu", "theme", "langMap", 'wsState']),
        username() {
            return sessionStorage.getItem("user");
        }
    },
    data() {
        return {
            activeIndex: "home"
        };
    },
    created() {},
    methods: {
        ...mapMutations({
            updateBreadcrumb: "updateBreadcrumb",
            setwsState: 'setWsState'
        }),
        logout() {
            this.$confirm(this.langMap["logout_tips"], this.langMap["tips"], {
                type: "warning",
                confirmButtonText: this.langMap["apply"],
                cancelButtonText: this.langMap["cancel"]
            })
                .then(_ => {
                    var data = {
                        method: "logout",
                        param: {
                            username: sessionStorage.getItem("user")
                        }
                    };
                    this.$http
                        .post("/logout", data)
                        .then(res => {
                            if (res.data.code === 1) {
                                sessionStorage.removeItem("user");
                                sessionStorage.removeItem("x-token");
                                this.$router.push("/login");
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        handleCommand(command){
            if(command === 'logout'){
                this.logout();
            }
            if(command === 'realtimealarm'){
                this.setwsState(!this.wsState);
            }
        }
    },
    mounted() {
        //  刷新页面时的菜单状态恢复
        this.$nextTick(() => {
            var activeIndex = this.$route.path.slice(1) || "home";
            this.activeIndex = activeIndex;
            this.updateBreadcrumb(this.activeIndex);
        });
    },
    watch: {
        $route() {
            this.activeIndex = this.$route.path.slice(1);
            this.updateBreadcrumb(this.activeIndex);
        }
    }
};
</script>

<style lang="less" scoped>
.layout-logo {
    height: inherit;
    width: 200px;
    background: #aaa;
    float: left;
}
.layout-user{
    float: right;
    height: inherit;
    line-height: 60px;
}
header {
    border-bottom: 1px solid #e6e6e6;
    > ul {
        float: right;
        margin-right: 30px;
    }
}
.header-dark {
    background: #515a6e;
}
.header-light {
    background: #fff;
    > ul:after {
        background: #fff;
    }
}
.header-primary {
    background: #2d8cf0;
}
</style>
