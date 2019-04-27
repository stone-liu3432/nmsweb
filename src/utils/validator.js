/* 
* 表单验证规则，
* 所有表单验证都应集合在此文件内
* 验证规则应可以单独引用，也可以作为一个整体导出
*/
//  设备名称
export function validatorDevName(rule, value, callback){
    if(!value){
        return callback(new Error('device name'));
    }
    callback();
}
//  MAC地址
export function validatorMac(rule, value, callback){
    var reg = /([a-fA-F0-9]{2}\:){5}[a-fA-F0-9]{2}/g;
    if(!reg.test(value)){
        return callback(new Error('mac'));
    }
    callback();
}
//  IP地址
export function validatorIpAddr(rule, value, callback){
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if(!reg.test(value)){
        return callback(new Error('ip address'));
    }
    callback();
}
//  IP掩码
export function validatorIpMask(rule, value, callback){
    var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if(!reg.test(value)){
        return callback(new Error('ip mask'));
    }
    callback();
}
//  设备型号
export function validatorModel(rule, value, callback){
    //  <4-18>   dev-model
    var reg = /^[a-zA-Z0-9\-]{4, 18}$/;
    if(!reg.test(value)){
        return callback(new Error('device model'));
    }
    callback();
}
//  设备类型
export function validatorMclass(rule, value, callback){
    if(!value){
        return callback(new Error('class'));
    }
    callback();
}
//  分组名称
export function validatorGroupName(rule, value, callback){
    if(!value){
        return callback(new Error('group name'));
    }
    callback();
}
//  用户名
export function validatorUserName(rule, value, callback){
    if(!value){
        return callback(new Error('user name'));
    }
    callback();
}
//  密码
export function validatorPassword(rule, value, callback){
    if(!value){
        return callback(new Error('password'));
    }
    callback();
}
//  SNMP community
export function validatorCommunity(rule, value, callback){
    if(!value){
        return callback(new Error('community'));
    }
    callback();
}
//  网络协议
export function validatorProtocol(rule, value, callback){
    if(!value){
        return callback(new Error('protocol'));
    }
    callback();
}
//  端口号
export function validatorPort(rule, value, callback){
    if(!value){
        return callback(new Error('port '));
    }
    callback();
}
//  任务名
export function validatorTaskName(rule, value, callback){
    if(!value){
        return callback(new Error('task name'));
    }
    callback();
}
//  描述信息
export function validatorDesc(rule, value, callback){
    //  < 4-256 >  description  
    var reg = /^.{4, 256}$/;
    if(!reg.test(value)){
        return callback(new Error('desc'));
    }
    callback();
}

export function validatorName(rule, value, callback){
    //  < 4 - 33 >   name  label  groupname  creater  contact  
    var reg = /^\w{4,33}$/;
    if(!value || !reg.test(value)){
        return callback(new Error('name'));
    }
    callback();
}

export function validatorAddr(rule, value, callback){
    // < 4-128 >  address
    // var reg = /^[a-zA-Z0-9,\-\(\)\u4e00-\u9fa5\（\）\《\》\—\；\，\。\“\”\<\>\！]{4, 128}$/;
    var reg = /^.{4, 128}$/;
    if(!reg.test(value)){
        return callback(new Error('address'));
    }
    callback();
}

export function validatorAccount(rule, value, callback){
    //  < 4-65 >  account -> 客户拔号帐号
    var reg = /^[a-zA-Z0-9@_\.]{4, 65}$/;
    if(!reg.test(value)){
        return callback(new Error('account'));
    }
    callback();
}
const validator = {
    validatorDevName,
    validatorMac,
    validatorIpAddr,
    validatorModel,
    validatorClass,
    validatorGroupName,
    validatorUserName,
    validatorPassword,
    validatorIpMask,
    validatorCommunity,
    validatorProtocol,
    validatorPort,
    validatorTaskName,
    validatorDesc,
    validatorName,
    validatorAddr,
}

export default validator;
