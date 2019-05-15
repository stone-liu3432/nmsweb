<template>
    <div class="nms-main">
        <nav-header style="height: 61px;"></nav-header>
        <content-area></content-area>
        <common-footer></common-footer>
    </div>
</template>

<script>
import navHeader from "../main/header";
import contentArea from "../main/content";
import commonFooter from "../main/footer";
export default {
    name: "nmsMain",
    components: { navHeader, contentArea, commonFooter },
    data() {
        return {
            ws: {}
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
                    this.$message({
                        type: "error",
                        text: this.langMap["illegal_login_info"]
                    });
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("x-token");
                    this.$router.push("/login");
                }
                if (response.data.code === 6) {
                    this.$message({
                        type: "error",
                        text: this.langMap["login_timeout"]
                    });
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
        let hidden,
            visibilityChange,
            _this = this;
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
        // 添加监听器
        //  IE9不支持此事件  IE9下页面最小化时JS不会暂停，无需停止socket
        document.addEventListener(
            visibilityChange,
            function(e) {
                document[hidden] && console.log("当前页面被隐藏");
                if (document[hidden]) {
                    if (_this.ws) {
                        _this.ws.close();
                    }
                } else {
                    initSocket();
                }
            },
            false
        );
        var initSocket = (function(context) {
            return _ => {
                if ("WebSocket" in window) {
                    let ws = new WebSocket(`ws://${window.location.host}/ws`);
                    ws.onopen = function() {
                        console.log("ws open success");
                    };
                    ws.onmessage = function(evt) {
                        var message = evt.data;
                        context.$notify({
                            message,
                            position: "bottom-right",
                            customClass: "custom-shadow"
                        });
                    };
                    ws.onclose = function(e) {
                        console.log("ws close");
                    };
                    ws.onerror = function(e) {
                        console.log("ws error");
                    };
                    context.ws = ws;
                }
            };
        })(this);
        initSocket();
    },
    methods: {},
    beforeDestroy() {
        if (this.ws) {
            this.ws.close();
        }
    }
};
</script>

<style lang="less" scoped>
.nms-main {
    margin: 0 0 30px 0;
}
</style>
