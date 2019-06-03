/*
 * 表单验证规则，
 * 所有表单验证都应集合在此文件内
 * 验证规则应可以单独引用，也可以作为一个整体导出
 */
//  MAC地址
import store from "./../vuex/store";

export function validatorMac(rule, value, callback) {
    var reg = /^([a-fA-F0-9]{2}\:){5}[a-fA-F0-9]{2}$/;
    if (!reg.test(value)) {
        return callback(new Error("xx:xx:xx:xx:xx:xx"));
    }
    callback();
}
//  IP地址
export function validatorIpAddr(rule, value, callback) {
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_ip_tips']));
    }
    callback();
}
//  设备型号
export function validatorModel(rule, value, callback) {
    //  <4-18>   dev-model
    var reg = /^.{4,18}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_model_tips']));
    }
    callback();
}
//  描述信息
export function validatorDesc(rule, value, callback) {
    //  < 4-256 >  description
    var reg = /^.{4,256}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_desc_tips']));
    }
    callback();
}
//  名称类验证
export function validatorName(rule, value, callback) {
    //  < 4 - 33 >   name  label  groupname  creater  contact  username
    var reg = /^.{4,33}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_name_tips']));
    }
    callback();
}
//  地址
export function validatorAddr(rule, value, callback) {
    // < 4-128 >  address
    // var reg = /^[a-zA-Z0-9,\-\(\)\u4e00-\u9fa5\（\）\《\》\—\；\，\。\“\”\<\>\！]{4,128}$/;
    var reg = /^.{4,128}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_addr_tips']));
    }
    callback();
}
//  用户排号帐号
export function validatorAccount(rule, value, callback) {
    //  < 4-65 >  account -> 客户拔号帐号
    var reg = /^.{4, 65}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_account_tips']));
    }
    callback();
}

export function validatorPassword(rule, value, callback) {
    //  < 4-33 > password
    var reg = /^.{4,33}$/;
    if (!reg.test(value)) {
        return callback(new Error(store.state.langMap['validator_pass_tips']));
    }
    callback();
}

export function validatorVlan(rule, value, callback){
    if(value < 1 || value > 4094 || isNaN(value)){
        return callback(new Error(store.state.langMap['vlanid_range_hit']));
    }
    callback();
}
export default {
    validatorMac,
    validatorIpAddr,
    validatorModel,
    validatorDesc,
    validatorName,
    validatorAddr,
    validatorAccount,
    validatorPassword,
    validatorVlan
};