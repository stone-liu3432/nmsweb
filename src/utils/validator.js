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
    if(!value){
        return callback(new Error('mac'));
    }
    callback();
}
//  IP地址
export function validatorIpAddr(rule, value, callback){
    if(!value){
        return callback(new Error('ip address'));
    }
    callback();
}
//  IP掩码
export function validatorIpMask(rule, value, callback){
    if(!value){
        return callback(new Error('ip mask'));
    }
    callback();
}
//  设备型号
export function validatorModel(rule, value, callback){
    if(!value){
        return callback(new Error('device model'));
    }
    callback();
}
//  设备类型
export function validatorClass(rule, value, callback){
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
    if(!value){
        return callback(new Error('desc'));
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
}

export default validator;
