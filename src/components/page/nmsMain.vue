<template>
    <div class="nms-main">
        <nav-header style="height: 61px;"></nav-header>
        <content-area></content-area>
        <common-footer></common-footer>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import navHeader from "../main/header";
import contentArea from "../main/content";
import commonFooter from "../main/footer";
export default {
    name: "nmsMain",
    components: { navHeader, contentArea, commonFooter },
    computed: mapState(["wsState"]),
    data() {
        return {
            ws: null,
            ws_limit: 0
        };
    },
    created() {
        // var a = {
        //     1: "成功",
        //     2: "失败",
        //     3: "参数错误",
        //     4: "权限错误",
        //     5: "不支持此功能",
        //     6: "已超时或者需要重新登录",
        //     7: "method error",
        //     8: "无效请求（没有X-Token）",
        //     9: "数据已经存在",
        //     10: "数据不存在",
        //     11: "http client请求超时",
        //     2001: "插入数据库错误",
        //     2002: "删除数据库数据错误",
        //     2003: "更新数据库数据错误"
        // };
        this.$http.interceptors.response.use(
            response => {
                if (response.data.code === 8) {
                    this.$message.error(this.langMap["illegal_login_info"]);
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("x-token");
                    this.$router.push("/login");
                }
                if (response.data.code === 6) {
                    this.$message.error(this.langMap["login_timeout"]);
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("x-token");
                    this.$router.push("/login");
                }
                return response;
            },
            err => {
                return Promise.reject(err);
            }
        );
    },
    mounted() {
        let hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        //  添加监听器
        //  IE9不支持此事件  IE9下页面最小化时JS不会暂停，无需停止socket
        const fn = e => {
            document[hidden] && console.log("当前页面被隐藏");
            if (this.wsState) {
                if (document[hidden]) {
                    this.closeWs();
                } else {
                    this.initSocket();
                }
            }
        };
        document.addEventListener(visibilityChange, fn, false);
        this.initSocket();
        this.$on("hook:beforeDestroy", _ => {
            document.removeEventListener(visibilityChange, fn);
            this.wsState && this.closeWs();
        });
    },
    methods: {
        initSocket() {
            let status = "";
            if ("WebSocket" in window) {
                let ws = new WebSocket(`ws://${window.location.host}/ws`);
                ws.onopen = () => {
                    if (ws.readyState === 1) {
                        status = "open";
                    }
                };
                ws.onmessage = evt => {
                    var message = evt.data;
                    this.$notify({
                        message,
                        position: "bottom-right",
                        customClass: "custom-shadow"
                    });
                };
                ws.onclose = e => {
                    //  网络连接中断 或 非正常断开连接
                    if (e.code === 1006 || !e.wasClean) {
                        status = "error";
                        this.closeHandle(status);
                    } else {
                        status = "close";
                        this.closeHandle(status);
                    }
                };
                ws.onerror = e => {
                    status = "error";
                    this.closeWs();
                };
                this.ws = ws;
            }
        },
        closeHandle(status) {
            this.closeWs();
            if (status !== "close") {
                if (this.wsState) {
                    if (this.ws_limit < 5) {
                        this.initSocket();
                        this.ws_limit++;
                    } else {
                        this.ws_limit = 0;
                    }
                }else{
                    this.ws_limit = 0;
                }
            } else {
                this.ws_limit = 0;
            }
        },
        closeWs() {
            if (this.ws) {
                this.ws.close();
            }
        }
    },
    watch: {
        wsState() {
            if (this.wsState) {
                this.initSocket();
            } else {
                this.closeWs();
            }
        }
    }
};
</script>

<style lang="less" scoped>
.nms-main {
    height: 100%;
}
</style>
