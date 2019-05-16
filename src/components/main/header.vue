<template>
    <el-header>
        <div class="layout-logo"></div>
        <div @click="logout">
            <span>{{ username }}</span>
            <span>{{ langMap['logout'] }}</span>
        </div>
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
import { mapState, mapMutations } from "vuex";
export default {
    name: "navHeader",
    computed: {
        ...mapState(["menu", "theme", "langMap"]),
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
            updateBreadcrumb: "updateBreadcrumb"
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
    & + div {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 10px;
        text-align: center;
        float: right;
        width: 100px;
        height: inherit;
        line-height: 60px;
        color: #67aef7;
        cursor: pointer;
        span {
            overflow: hidden;
        }
        span:last-child {
            display: none;
        }
        &:hover {
            span:first-child {
                display: none;
            }
            span:last-child {
                display: inline;
            }
        }
    }
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
