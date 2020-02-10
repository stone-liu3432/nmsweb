<template>
    <div class="topo-container">
        <canvas :width="cvsWidth" :height="cvsHeight" ref="topo"></canvas>
        <dbc-button
            style="position: absolute;right: 30px; top: 30px;"
            :loading="saveLoading"
            @click="dbcSavePosition"
        >{{ langMap['save_location'] }}</dbc-button>
        <context-menu
            :visible.sync="showContextMenu"
            :location="ctxMenuLocation"
            @command="ctxHandle"
            ref="topo-context-menu"
        >
            <template>
                <context-menu-item :command="ctxData('config')">{{ langMap['config'] }}</context-menu-item>
                <context-menu-item :command="ctxData('delete')">{{ langMap['delete'] }}</context-menu-item>
                <context-menu-item
                    :command="ctxData('info')"
                    :disabled="!ctxMenuState"
                >{{ langMap['dev_detail'] }}</context-menu-item>
            </template>
        </context-menu>
        <el-dialog :visible.sync="showConfigDialog" width="800px" key="devConfig">
            <div slot="title">{{ langMap['config'] + (devFlag === 'olt' ? ' OLT' : ' ONU') }}</div>
            <dev-set-info
                :data="cacheData"
                :dev="devFlag"
                :update-data="showConfigDialog"
                :groups="groups"
                v-if="handleFlag === 'config'"
                ref="oltSetInfo"
            ></dev-set-info>
            <div slot="footer">
                <el-button @click="showConfigDialog = false;">{{ langMap['cancel'] }}</el-button>
                <el-button type="primary" @click="submitConfig('oltSetInfo')">{{ langMap['apply'] }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="showMgmtDialog"
            key="devMgmt"
            fullscreen
            :close-on-press-escape="false"
            @close="closeDialog"
            style="min-width: 1280px;"
        >
            <div slot="title" v-if="devMgmtTitle">
                <span>{{ langMap['name'] }} : {{ devMgmtTitle.name }}</span>
                <el-divider direction="vertical"></el-divider>
                <template v-if="!!devMgmtTitle.ipaddr">
                    <span>{{ langMap['ipaddr'] }} : {{ devMgmtTitle.ipaddr }}</span>
                    <el-divider direction="vertical"></el-divider>
                </template>
                <span>{{ langMap['macaddr'] }} : {{ devMgmtTitle.macaddr }}</span>
                <dbc-button
                    :interval="500"
                    style="margin-left: 50px;"
                    @click="refreshCurrentPage"
                >{{ langMap['refresh'] }}</dbc-button>
            </div>
            <olt-detail
                :dev="devFlag"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'olt' && !loading"
                :olt-info="cacheData"
                ref="olt-mgmt-dialog"
                @set-title="deviceTitle"
            ></olt-detail>
            <onu-detail
                :dev="devFlag"
                :dev_ip="olt_ip"
                :update-data="showMgmtDialog"
                v-if="handleFlag === 'info' && devFlag === 'onu' && !loading"
                :onu-info="cacheData"
                ref="onu-mgmt-dialog"
                @set-title="deviceTitle"
            ></onu-detail>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "Vuex";
import "../../../../static/jtopo-0.4.8-min";
import { throttle } from "@/utils/common";
const devSetInfo = () =>
    import(/* webpackChunkName: "configMgmt" */ "./oltSetInfo");
const oltDetail = () =>
    import(/* webpackChunkName: "configMgmt" */ "./oltMgmt/oltDetail");
const onuDetail = () =>
    import(/* webpackChunkName: "configMgmt" */ "./onuMgmt/onuDetail");
//  页面节点无任何位置变化
const POSITION_NOT_CHANGE = 1;
export default {
    name: "topo",
    components: { devSetInfo, oltDetail, onuDetail },
    data() {
        return {
            stage: null,
            scene: null,
            cvsWidth: 0,
            cvsHeight: 0,
            intervals: [],
            devTitle: "",
            showContextMenu: false,
            //  当前节点数据和当前节点标示(olt/onu)
            devData: {},
            ctxMenuLocation: {
                x: 0,
                y: 0
            },
            //  已修改的节点坐标集合
            nodeLocation: {},
            showConfigDialog: false,
            showMgmtDialog: false,
            devMgmtTitle: "",
            //  olt / onu
            devFlag: "olt",
            //  将要进行的操作
            handleFlag: "",
            //  选中设备的数据缓存
            cacheData: {},
            //  下拉菜单的操作集合
            olt_ip: "",
            sceneLocation: {
                translateX: 0,
                translateY: 0
            },
            //  保存位置信息按钮频率限制
            saveLoading: false,
            dropdownStrategy: {
                //  @params {row: Object, dev: String, flag: String}
                //  row: 设备信息
                //  dev: 设备类型  olt/onu
                //  flag: 将要进行的操作
                config({ dev }) {
                    this.showConfigDialog = true;
                },
                delete({ dev, row, flag }) {
                    this.deleteDevice({ row, dev, flag });
                },
                info({ dev }) {
                    this.showMgmtDialog = true;
                    this.updateLoading(true);
                }
            }
        };
    },
    computed: {
        ...mapState(["langMap", "oltList", "onuList", "groups", "loading"]),
        ctxMenuState() {
            return this.devData.row ? !!this.devData.row.status : false;
        }
    },
    created() {
        this.getOlt();
        this.getGroups();
    },
    mounted() {
        let canvas = this.$refs["topo"];
        this.stage = new JTopo.Stage(canvas);
        //this.stage.wheelZoom = 0.9;
        this.stage.mousedown(e => {
            this.showContextMenu = false;
        });
        this.scene = new JTopo.Scene(this.stage);

        const { width, height } = canvas.getBoundingClientRect();
        this.cvsWidth = width;
        this.cvsHeight = height;

        //  自定义右键菜单的销毁
        window.addEventListener("mousedown", this.globalMouseHandle, false);

        //  定时自动保存 & 刷新设备状态
        let interval = setInterval(_ => {
            this.savePosition(false)
                .then(_ => {
                    this.devFlag === "olt" && this.getOlt();
                    this.devFlag === "onu" && this.getOnu(this.cacheData.devid);
                })
                .catch(msg => {
                    if (msg === POSITION_NOT_CHANGE) {
                        this.devFlag === "olt" && this.getOlt();
                        this.devFlag === "onu" &&
                            this.getOnu(this.cacheData.devid);
                    }
                });
        }, 5000);

        this.$once("hook:beforeDestroy", _ => {
            window.removeEventListener("mousedown", this.globalMouseHandle);
            clearInterval(interval);
        });
    },
    methods: {
        ...mapMutations({
            updateLoading: "changeLoadingState",
            updateTimestamp: "updateTimestamp"
        }),
        ...mapActions({
            getOlt: "getDevList",
            getOnu: "getOnuList",
            getGroups: "getGroups"
        }),
        //  初始化画布，清除已有信息
        initStage() {
            if (this.stage && this.scene) {
                this.scene.clear();
                this.stage.clear();
            }
            this.scene = new JTopo.Scene(this.stage);
            //  scene 位置保存恢复
            this.scene.translateX = this.sceneLocation.translateX;
            this.scene.translateY = this.sceneLocation.translateY;

            const dragFn = e => {
                const { translateX, translateY } = this.scene;
                this.sceneLocation.translateX = translateX;
                this.sceneLocation.translateY = translateY;
            };

            this.scene.mousedrag(throttle(dragFn, 300));
        },
        draw({ title = "nms", data = [], devType = "olt" }) {
            this.initStage();

            const ROW_STEP = 100;
            const BASE_OFFSET = 60;
            let row = 1;
            let col = 1;
            //  每行的节点个数上限
            let row_count = 8;
            if (row_count > data.length) {
                row_count = data.length;
            }
            //  行内节点下标
            let row_idx = 0;

            let nodeFrom = new JTopo.Node("mms");
            let size = nodeFrom.getSize();
            let pwidth = size.width;
            nodeFrom.setLocation((this.cvsWidth - pwidth) / 2, row * ROW_STEP);
            nodeFrom.textPosition = "Top_Center";
            nodeFrom.text = title;
            nodeFrom.fontColor = "0,0,0";
            nodeFrom.dragable = false;
            if (devType === "onu") {
                const cb = e => {
                    this.getOlt();
                    this.devFlag = "olt";
                    this.sceneLocation = {
                        translateX: 0,
                        translateY: 0
                    };
                };
                nodeFrom.dbclick(cb);
            }
            this.scene.add(nodeFrom);

            row++;

            data.forEach((item, index) => {
                if (row_idx >= row_count) {
                    row++;
                    col = 1;
                    row_idx = 0;
                }
                let c = new JTopo.Node(item.name);
                if (
                    item.position &&
                    (item.position.left || item.position.top)
                ) {
                    c.setLocation(item.position.left, item.position.top);
                } else {
                    let pwidth = c.getSize().width;
                    let node_width = this.cvsWidth / row_count;
                    let cstart =
                        (node_width - pwidth) / 2 + row_idx * node_width;
                    c.setLocation(cstart, row * ROW_STEP);
                    row_idx++;
                }
                let title = item.name || item.ipaddr;
                if (title.length > 16) {
                    title = title.replace(/(.{16})(.*)/g, "$1...");
                }
                c.text = title;
                c.fontColor = "0, 0, 0";
                if (
                    !item.status ||
                    (typeof item.status === "string" &&
                        item.status.toLowerCase() !== "online")
                ) {
                    //  olt status: number, onu status: string
                    c.alarm =
                        typeof item.status === "number"
                            ? "link down"
                            : item.status.toLowerCase();
                    c.alarmColor = "255, 0, 0";
                    c.alarmAlpha = 0.9;
                }
                if (devType === "olt") {
                    //  olt节点绑定鼠标事件
                    this.oltBindEvent(c, item);
                } else {
                    this.onuBindEvent(c, item);
                }
                this.scene.add(c);

                let link = new JTopo.Link(nodeFrom, c);
                link.lineWidth = 1;
                link.strokeColor = item.status ? "128, 151, 189" : "255, 0, 0";
                link.showSelected = false;
                this.scene.add(link);
            });
        },
        ctxHandle(data) {
            const { dev, flag, row: node } = data;
            this.devFlag = dev;
            this.handleFlag = flag;
            this.cacheData = node;
            this.dropdown(flag, data);
        },
        //  根据选择不同，进行不同的操作
        dropdown(str, data) {
            //  str in this.dropdownStrategy
            if (Reflect.has(this.dropdownStrategy, str)) {
                return this.dropdownStrategy[str].call(this, data);
            }
        },
        globalMouseHandle(e) {
            if (this.showContextMenu) {
                //  监测鼠标按下事件，点击的元素不是弹出的右键菜单的子元素时，清除右键菜单
                //  当前右键菜单为显示状态时才能触发
                //  nextTick用于触发右键菜单事件时，DOM元素未渲染完成
                this.$nextTick(_ => {
                    const elm = this.$refs["topo-context-menu"];
                    if (elm && elm.$el.children) {
                        const nodelist = Array.from(elm.$el.children);
                        if (!nodelist.includes(e.target)) {
                            this.showContextMenu = false;
                        }
                    }
                });
            }
        },
        //  右键菜单的所有数据
        ctxData(flag) {
            return { flag, ...this.devData };
        },
        /*
         *  @method oltBindEvent 给绘制出的olt节点添加事件绑定
         *  @param {Jtopo.Node} c 要绑定事件的olt节点
         *  @param {Object} item 当前olt节点的数据
         */
        oltBindEvent(c, item) {
            const dev = "olt";
            //  双击查看当前olt下所有onu
            const fn = e => {
                this.getOnu(item.devid);
                this.devTitle = item.name || item.ipaddr;
                this.olt_ip = item.ipaddr;
                this.devFlag = "onu";
                this.cacheData = item;
                this.sceneLocation = {
                    translateX: 0,
                    translateY: 0
                };
            };
            c.dbclick(fn);
            //  右键菜单
            const ctxFn = e => {
                if (e.button === 2) {
                    this.devData = { dev, row: item };
                    this.showContextMenu = true;
                    this.ctxMenuLocation = {
                        x: e.offsetX,
                        y: e.offsetY
                    };
                }
            };
            c.mouseup(ctxFn);
            //  拖拽时记录节点位置
            const dragFn = e => {
                const { left, top } = e.target.getBound();
                this.nodeLocation[item.devid] = {
                    devid: item.devid,
                    left,
                    top
                };
            };
            c.mousedrag(throttle(dragFn, 300));
        },
        /*
         *  @method onuBindEvent 给绘制出的onu节点添加事件绑定
         *  @param {Jtopo.Node} c 要绑定事件的onu节点
         *  @param {Object} item 当前onu节点的数据
         */
        onuBindEvent(c, item) {
            const dev = "onu";
            //  右键菜单
            const ctxFn = e => {
                if (e.button === 2) {
                    this.devData = { dev, row: item };
                    this.showContextMenu = true;
                    this.ctxMenuLocation = {
                        x: e.offsetX,
                        y: e.offsetY
                    };
                }
            };
            c.mouseup(ctxFn);
            //  拖拽时记录节点位置
            const dragFn = e => {
                this.nodeLocation[item.termid] = {
                    devid: item.devid,
                    termid: item.termid,
                    left: e.offsetX,
                    top: e.offsetY
                };
            };
            c.mousedrag(throttle(dragFn, 300));
        },
        //  设置信息提交按钮
        submitConfig(refName) {
            var data = this.$refs[refName].devInfo;
            var result = this.$refs[refName].validForm();
            if (result) {
                var url, params;
                if (this.devFlag === "olt") {
                    url = "/api/device/olt";
                    params = {
                        method: "set",
                        param: {
                            name: data.devname,
                            devid: data.devid,
                            groupname: data.groupname,
                            ipaddr: data.ipaddr,
                            contact: data.contact,
                            protocol: data.protocol,
                            httpport: data.httpport,
                            location: {
                                region: data.location.region,
                                address: data.location.address,
                                longitude: Number(data.location.longitude),
                                latitude: Number(data.location.latitude)
                            }
                        }
                    };
                }
                if (this.devFlag === "onu") {
                    url = "/api/device/epononu";
                    params = {
                        method: "set",
                        param: {
                            devid: data.devid,
                            port_id: data.port_id,
                            onu_id: data.onu_id,
                            macaddr: data.macaddr,
                            name: data.devname,
                            groupname: data.groupname,
                            label: data.label,
                            location: {
                                address: data.location.address,
                                longitude: Number(data.location.longitude),
                                latitude: Number(data.location.latitude),
                                region: data.location.region
                            },
                            username: data.username,
                            account: data.account,
                            userphone: data.userphone,
                            btype: data.btype,
                            updater: sessionStorage.getItem("user"),
                            description: data.description
                        }
                    };
                }
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success(
                                this.langMap[params.method + "_success"]
                            );
                            this.devFlag === "olt" && this.getOlt();
                            this.devFlag === "onu" &&
                                this.getOnu(this.cacheData.devid);
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.showConfigDialog = false;
                        this.handleFlag = "";
                    })
                    .catch(err => {});
            }
        },
        //  删除设备
        deleteDevice({ row: node, dev, flag }) {
            this.$confirm(this.langMap["cfm_del_tips"], this.langMap["tips"], {
                type: "warning"
            })
                .then(_ => {
                    var url, data;
                    if (dev === "olt") {
                        url = "/api/device/olt";
                        data = {
                            method: "delete",
                            param: {
                                type: "devid",
                                name: "",
                                groupname: node.groupname,
                                ipaddr: "",
                                macaddr: "",
                                devid: node.devid
                            }
                        };
                    }
                    if (dev === "onu") {
                        url = "/api/device/epononu";
                        data = {
                            method: "delete",
                            param: {
                                type: "macaddr",
                                name: "",
                                groupname: node.groupname,
                                macaddr: node.macaddr
                            }
                        };
                    }
                    this.$http
                        .post(url, data)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(
                                    this.langMap[data.method + "_success"]
                                );
                                dev === "olt" && this.getOlt();
                                dev === "onu" &&
                                    this.getOnu(this.cacheData.devid);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        //  更新vuex保存的时间戳
        refreshCurrentPage() {
            this.updateTimestamp(new Date().getTime());
        },
        closeDialog() {
            // this.devFlag = "";
            // this.handleFlag = "";
        },
        deviceTitle(val) {
            this.devMgmtTitle = val;
        },
        //  保存位置信息，当显式传入false时，表明不需要消息提示(自动保存)
        savePosition(tips = true) {
            const param = Object.values(this.nodeLocation);
            if (!param.length) {
                if (!tips) {
                    return Promise.reject(POSITION_NOT_CHANGE);
                }
                return;
            }
            const data = {
                method: "set",
                param
            };
            return new Promise((resolve, reject) => {
                this.$http
                    .post("/api/topo?form=position", data)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.nodeLocation = {};
                            if (tips) {
                                this.$message.success(
                                    this.langMap["save_succ"]
                                );
                            } else {
                                resolve();
                            }
                        } else {
                            if (tips) {
                                this.$message.error(res.data.message);
                            } else {
                                reject();
                            }
                        }
                    })
                    .catch(err => {
                        if (!tips) {
                            reject();
                        }
                    });
            });
        },
        dbcSavePosition() {
            const save = throttle(this.savePosition, 1000);
            save();
        }
    },
    watch: {
        oltList() {
            if (this.oltList.length) {
                this.draw({ title: "nms", data: this.oltList });
                this.devTitle = "";
            }
        },
        onuList() {
            if (this.onuList.length) {
                this.draw({
                    title: this.devTitle,
                    data: this.onuList,
                    devType: "onu"
                });
            }
        }
    },
    beforeDestroy() {},
    //  hooks  topo节点有位置变化并且未保存时，提示是否保存位置信息
    beforeRouteLeave(to, from, next) {
        if (Object.values(this.nodeLocation).length) {
            this.$confirm(
                this.langMap["unsaved_content_tips"],
                this.langMap["tips"],
                {
                    confirmButtonText: this.langMap["apply"],
                    cancelButtonText: this.langMap["cancel"]
                }
            )
                .then(_ => {
                    if (Object.values(this.nodeLocation).length) {
                        this.savePosition(false);
                    }
                    next();
                })
                .catch(_ => {
                    next(false);
                });
        } else {
            next();
        }
    }
};
</script>

<style lang="less" scoped>
.topo-container {
    height: calc(100% - 56px);
    position: relative;
}
canvas {
    box-sizing: border-box;
    border: 1px solid #ddd;
    width: 100%;
    min-width: 1200px;
    height: 100%;
    min-height: 600px;
}
</style>
