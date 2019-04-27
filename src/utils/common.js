function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/* 
*   初始化echarts饼图数据
*   @param  opt : object
*   opt : name-> string, data-> object[]
*   opt-> data : name-> string, value-> number
*   @return object  echarts init data
*/
export function initPieData(opt){
    if(!opt) return {}
    var name = opt.name || '';
    var data = [];
    if(isArray(opt.data)){
        opt.data.forEach(item =>{
            if(item.name){
                data.push(item.name);
            }
        })
    }
    return {
        tooltip : {
            trigger: 'item',
            //   {a}（系列名称-> series.name），{b}（数据项名称-> series.data.name），{c}（数值-> series.data.value）, {d}（百分比）
            formatter: name ? "{a} <br/> {b} : {c} ({d}%)" : "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data
        },
        series : [
            {
                name,
                type: 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data: opt.data || [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 5,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
}


/* 
    折线图
    ex:    {
            name: 'test1',  //  项标题
            xAxis: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'],  //  横坐标标记
            data: [820, 932, 901, 934, 1290, 1330, 120]     //  数据
        }
*/
export function initLineData(opt){
    if(!opt) return {}
    var xAxis = opt.xAxis || [], data = opt.data || [];
    var name = opt.name || '';
    if(!isArray(xAxis) || !isArray(data)){
        return {}
    }
    return {
        tooltip : {
            trigger: 'item',
            formatter: " {b}&nbsp;&nbsp;&nbsp;{c} "
        },
        xAxis: {
            type: 'category',
            data: xAxis
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: data,
            type: 'line',
            name
        }]
    }
}