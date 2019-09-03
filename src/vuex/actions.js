import axios from "../config/httpConfig";

export default {
    getDevList({ commit }) {
        axios
            .get("/api/device/olt?type=list")
            .then(res => {
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        commit("updateDevList", res.data.data);
                    } else {
                        commit("updateDevList", []);
                    }
                }
            })
            .catch(err => {
                commit("updateDevList", []);
            });
    },
    getOnuList({ commit }, devid) {
        axios
            .get("/api/device/epononu?type=list", { params: { devid } })
            .then(res => {
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        commit("updateOnuList", res.data.data);
                    } else {
                        commit("updateOnuList", []);
                    }
                }
            })
            .catch(err => {
                commit("updateOnuList", []);
            });
    },
    //  设备分组列表
    getGroups({ commit }) {
        axios
            .get("/api/device/group")
            .then(res => {
                const groups = [];
                if (res.data.code === 1) {
                    if (res.data.data && res.data.data.length) {
                        res.data.data.forEach(item => {
                            groups.push(item.groupname);
                        });
                        commit("updateGroups", groups);
                    }else{
                        commit("updateGroups", []);
                    }
                }
            })
            .catch(err => {
                commit("updateGroups", []);
            });
    }
};
