export const pageSizes = [10, 20, 30, 50, 100];

export const SWITCH = {
    enable: true,
    disable: false
};

//  设备状态枚举
export const STATUS = [
    "none",
    "register",
    "register_failed",
    "deregister",
    "unauth",
    "ctc_discovery",
    "auth_success",
    "auth_limit",
    "auth_fail",
    "link_lost",
    "end"
];
//  ONU 状态枚举
export const ONU_STATUS = [
    "Initial",
    "Offline",
    "Register",
    "Auth-Fail",
    "Unauth",
    "Auth Limit",
    "Online"
];

//  告警类型
export const ALARM_TYPE = [
    "environ",
    "equipment",
    "process",
    "service",
    "comm",
    "tca"
];
//  告警级别
export const ALARM_LEVEL = ["critical", "major", "minor", "waring"];

export const MCLASS = {
    1: "EPON",
    2: "GPON"
};
//  olt 用户权限级别
export const USER_LEVEL = [
    "manu",
    "diag",
    "super",
    "admin",
    "operator",
    "common"
];
