<template>
    <div class="nms-main">
        <nav-header></nav-header>
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
    created() {},
    mounted() {
        let hidden, visibilityChange, _this = this;
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
        document.addEventListener(visibilityChange, function(e) {
            document[hidden] && console.log("当前页面被隐藏");
            if(document[hidden]){
                if(_this.ws){
                    _this.ws.close();
                }
            }else{
                initSocket(_this);
            }
        }, false);

        function initSocket(context) {
            if ("WebSocket" in window) {
                let ws = new WebSocket("ws://localhost:8201");
                ws.onopen = function() {
                    console.log("ws open success");
                };
                ws.onmessage = function(evt) {
                    var message = evt.data;
                    context.$notify({
                        message,
                        customClass: 'custom-shadow'
                    });
                };
                ws.onclose = function(e) {
                    console.log(e);
                };
                ws.onerror = function(message) {
                    console.log('ws error');
                };
                context.ws = ws;
            }
        }
        initSocket(this);
    },
    methods: {},
    beforeDestroy() {
        if(this.ws) {
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
