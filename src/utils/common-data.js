export const pageSizes = [10, 20, 30, 50, 100];

export const SWITCH = {
    enable: true,
    disable: false
};

//  设备状态枚举
export const STATUS = [
    'none',
    'register',
    'register_failed',
    'deregister',
    'unauth',
    'ctc_discovery',
    'auth_success',
    'auth_limit',
    'auth_fail',
    'link_lost',
    'end'
];
//  告警类型
export const ALARM_TYPE = [
    'environ',
    'equipment',
    'process',
    'service',
    'comm',
    'tca'
]
//  告警级别
export const ALARM_LEVEL = [
    'critical',
    'major',
    'minor',
    'waring'
]

export const MCLASS = {
    1: 'EOPN',
    2: 'GPON'
}