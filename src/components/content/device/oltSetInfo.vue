<template>
    <el-form :model="devInfo" status-icon :rules="rules" ref="devInfo" label-width="120px">
        <el-row>
            <el-col :span="12">
                <el-form-item :label="langMap['name']" prop="devname">
                    <el-input v-model="devInfo.devname"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="langMap['groupname']" prop="groupname">
                    <el-select v-model="devInfo.groupname" style="width: 100%;">
                        <el-option v-for="(item, index) in groups" :key="index" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item :label="langMap['region']" prop="region">
                    <el-input v-model="devInfo.location.region"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="langMap['address']" prop="address">
                    <el-input v-model="devInfo.location.address"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item :label="langMap['longitude']" prop="longitude">
                    <el-input v-model="devInfo.location.longitude"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="langMap['latitude']" prop="latitude">
                    <el-input v-model="devInfo.location.latitude"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <template v-if="dev === 'olt'">
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="langMap['ipaddr']" prop="ipaddr">
                        <el-select v-model="devInfo.ipaddr" style="width: 100%">
                            <el-option v-for="(item, index) in ip_pool" :key="index" :value="item">{{ item }}</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="langMap['contact']" prop="contact">
                        <el-input v-model="devInfo.contact"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="langMap['devid']">
                        <el-input v-model="devInfo.devid" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="langMap['manufacturer']">
                        <el-input v-model="devInfo.manufacturer" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
        <template v-if="dev === 'onu'">
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="langMap['label']" prop="label">
                        <el-input v-model="devInfo.label"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="langMap['btype']" prop="btype">
                        <el-input v-model="devInfo.btype"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="langMap['macaddr']" prop="macaddr">
                        <el-input v-model="devInfo.macaddr" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="langMap['username']" prop="username">
                        <el-input v-model="devInfo.username"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="langMap['account']" prop="account">
                        <el-input v-model="devInfo.account"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="langMap['userphone']" prop="userphone">
                        <el-input v-model="devInfo.userphone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item :label="langMap['description']" prop="description">
                        <el-input v-model="devInfo.description" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>
    </el-form>
</template>

<script>
import { mapState } from "vuex";
import store from "@/vuex/store";
import validator from "@/utils/validator";
let validRegion = (rule, value, callback) => {
    var reg = /^.{0,65}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap["validatorRegion"]));
    }
    callback();
};
let validLongitude = (rule, value, callback) => {
    if (value !== "" && (value < -180 || value > 180)) {
        return callback(new Error(" -180.00000 ~ 180.00000 "));
    }
    callback();
};
let validLatitude = (rule, value, callback) => {
    if (value !== "" && (value < -90 || value > 90)) {
        return callback(new Error(" -90.00000 ~ 90.00000 "));
    }
    callback();
};
let valid4_33char = (rule, value, callback) => {
    var reg = /^.{4,33}$/;
    if (value !== "" && !reg.test(value)) {
        return callback(new Error(store.state.langMap["validator_name_tips"]));
    }
    callback();
};
let validDesc = (rule, value, callback) => {
    var reg = /^.{0,256}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap["validUp256char"]));
    }
    callback();
};
let validBtype = (rule, value, callback) => {
    var reg = /^.{0,16}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap["validUp16char"]));
    }
    callback();
};
export default {
    name: "oltSetInfo",
    computed: mapState(["langMap"]),
    props: ["data", "dev", "groups"],
    data() {
        return {
            ip_pool: [],
            devInfo: {
                devname: "",
                devid: "",
                groupname: "",
                ipaddr: "",
                manufacturer: "",
                contact: "",
                location: {
                    region: "", // <3-65>
                    address: "",
                    longitude: "", // float
                    latitude: "" // float
                },
                label: "",
                macaddr: "",
                username: "",
                account: "",
                userphone: "",
                btype: "",
                updatetime: "",
                updater: "",
                description: ""
            },
            rules: {
                devname: [
                    {
                        validator: validator.validatorName,
                        trigger: ["change", "blur"]
                    }
                ],
                groupname: [
                    {
                        validator: validator.validatorName,
                        trigget: ["change", "blur"]
                    }
                ],
                ipaddr: [
                    {
                        validator: validator.validatorIpAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                contact: [
                    { validator: valid4_33char, trigger: ["change", "blur"] }
                ],
                region: [
                    { validator: validRegion, trigger: ["change", "blur"] }
                ],
                address: [
                    {
                        validator: validator.validatorAddr,
                        trigger: ["change", "blur"]
                    }
                ],
                longitude: [
                    { validator: validLongitude, trigger: ["change", "blur"] }
                ],
                latitude: [
                    { validator: validLatitude, trigger: ["change", "blur"] }
                ],
                label: [
                    { validator: valid4_33char, trigger: ["change", "blur"] }
                ],
                btype: [{ validator: validBtype, trigger: ["chnage", "blur"] }],
                macaddr: [
                    {
                        validator: validator.validatorMac,
                        trigger: ["change", "blur"]
                    }
                ],
                username: [
                    { validator: valid4_33char, trigger: ["change", "blur"] }
                ],
                account: [
                    { validator: validRegion, trigger: ["chnage", "blur"] }
                ],
                userphone: [
                    { validator: valid4_33char, trigger: ["change", "blur"] }
                ],
                description: [
                    { validator: validDesc, trigger: ["change", "blur"] }
                ]
            }
        };
    },
    created() {},
    methods: {
        validForm() {
            var flag = false;
            this.$refs["devInfo"].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        getData() {
            let url, opt;
            if (this.dev === "olt") {
                url = "/api/device/olt";
                opt = { params: { devid: this.data.devid } };
            } else {
                url = "/api/device/epononu";
                opt = {
                    params: { devid: this.data.devid, termid: this.data.termid }
                };
            }
            this.$http
                .get(url, opt)
                .then(res => {
                    this.ip_pool = [];
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            for (var key in this.devInfo) {
                                if (key === "location") {
                                    if(res.data.data.location){
                                        for (var _key in this.devInfo.location) {
                                            this.devInfo[key][_key] =
                                                res.data.data[key][_key] !==
                                                undefined
                                                    ? res.data.data[key][_key]
                                                    : "";
                                        }
                                    }
                                } else {
                                    this.devInfo[key] =
                                        res.data.data[key] !== undefined
                                            ? res.data.data[key]
                                            : "";
                                }
                            }
                            this.devInfo.devname = res.data.data["name"];
                            (res.data.data.ipaddr) && this.ip_pool.push(res.data.data.ipaddr);
                            if(res.data.data.inbound){
                                res.data.data.inbound.forEach(item =>{
                                    this.ip_pool.push(item.ipaddr);
                                })
                            }
                        }
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>
