function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
//  时间格式化
export function formatDate(strTime, format) {
    format = format || "yyyy-MM-dd hh:mm:ss";
    var date = new Date(strTime);
    var dateMap = {
        yyyy: date.getFullYear(),
        MM: date.getMonth() + 1,
        dd: date.getDate(),
        hh: date.getHours(),
        mm: date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes(),
        ss: date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
    };
    for (var k in dateMap) {
        format = format.replace(new RegExp(k, "g"), dateMap[k]);
    }
    return format;
}
/*
 *   初始化echarts饼图数据
 *   @param  opt : object
 *   opt : name-> string, data-> object[]
 *   opt-> data : name-> string, value-> number
 *   @return object  echarts init data
 */
export function initPieData(opt) {
    if (!opt) return {};
    var name = opt.name || "";
    var data = [];
    if (isArray(opt.data)) {
        opt.data.forEach(item => {
            if (item.name) {
                data.push(item.name);
            }
        });
    }
    return {
        tooltip: {
            trigger: "item",
            //   {a}（系列名称-> series.name），{b}（数据项名称-> series.data.name），{c}（数值-> series.data.value）, {d}（百分比）
            formatter: name ? "{a} <br/> {b} : {c} ({d}%)" : "{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            left: "left",
            data
        },
        series: [
            {
                name,
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: opt.data || [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 5,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    };
}

/* 
    折线图
    ex:    {
            name: 'test1',  //  项标题
            xAxis: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'],  //  横坐标标记
            data: [820, 932, 901, 934, 1290, 1330, 120]     //  数据
        }
*/
export function initLineData(opt) {
    if (!opt) return {};
    var xAxis = opt.xAxis || [],
        data = opt.data || [];
    var name = opt.name || "";
    if (!isArray(xAxis) || !isArray(data)) {
        return {};
    }
    return {
        tooltip: {
            trigger: "item",
            formatter: " {b}&nbsp;&nbsp;&nbsp;{c} "
        },
        xAxis: {
            type: "category",
            data: xAxis
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                data: data,
                type: "line",
                name
            }
        ]
    };
}

export function removeUnderline(value) {
    if (!value) return "";
    var str = value.replace(/_/g, " ");
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

//  解析字符串为数组，范围类(1-5)展开
export function analysisPortList(str) {
    if (!str) return [];
    var result = [];
    var arr = str.split(",");
    for (var i = 0, len = arr.length; i < len; i++) {
        var substrs = arr[i];
        if (substrs.indexOf("-") !== -1) {
            var subArr = substrs.split("-");
            var min = Number(subArr[0]),
                max = Number(subArr[subArr.length - 1]);
            if (isNaN(min) || isNaN(max)) return [];
            for (var j = 0; j <= max - min; j++) {
                result.push(min + j);
            }
        } else {
            if (isNaN(Number(substrs))) return [];
            result.push(Number(substrs));
        }
    }
    return result;
}

export function generatorPortName(arr, baseObj) {
    var result = "";
    arr.forEach(item => {
        result += baseObj[item];
        result += ",";
    });
    return result.replace(/,$/, "");
}

/*
*  @method removeArrayItem
*  @param {Array} arr 要移除项的数组
*  @param {any} item 要移除的项
*  @returns 无返回，直接修改原数组，数组中不存在项时，不做任何修改
*/
export function removeArrayItem(arr, item) {
    var index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

/* 
*  @method 防抖函数
*  @param {Fucntion} func 需要执行防抖的回调
*  @param {Number} delay 执行延迟时间 
*  @param {Object} context 回调函数的this指向
*  @param {Event} event 回调的参数，event对象
*/
export function debounce(func, delay, context, event) {
    if (func.timer) {
        clearTimeout(func.timer);
        func.timer = setTimeout(_ => {
            func.apply(context, event);
            func.timer = null;
        }, delay);
    } else {
        func.timer = setTimeout(_ => {
            func.apply(context, event);
            func.timer = null;
        }, delay);
    }
}

/*
*  @method throttle 节流函数 
*  @param {Function} func 要执行节流的函数
*  @param {Number} wait 回调执行的间隔
*/
export function throttle(func, wait = 300){
    let last = 0, timer = null;
    return function(){
        let current = +new Date();
        clearTimeout(timer);
        if(current - last > wait){
            func.apply(this, arguments);
            last = current;
        }else{
            timer = setTimeout(_ => {
                func.apply(this, arguments);
                last = current;
            }, wait)
        }
    }
}