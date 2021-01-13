 /**
  * 将时间戳转换为2020-12-16 18:01:19类型
  * @param {Number} timestamp -时间戳
  */
 function conversionTimestamp(timestamp) {
   var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
   var Y = date.getFullYear() + "-";
   var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
   var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
   var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
   var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
   var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
   return Y + M + D + h + m + s;
 }
 /**
  * 根据接口数据生成图表配置
  * @param {Array} data -接口返回数组数据
  * @return {Object} options -创建图表所需配置
  */
 function createOptions(data) {
   const xArr = toArr("createTime", data),
     dnsArr = toArr("dns", data),
     tcpArr = toArr("tcp", data),
     ttfbArr = toArr("ttfb", data),
     httpArr = toArr("responseTime", data),
     domArr = toArr("domInteractive", data),
     domContentLoadedEventArr = toArr("domContentLoadedEvent", data),
     domContentLoadedArr = toArr("DOMContentLoaded", data),
     domReadyArr = toArr("domReady", data),
     loadArr = toArr("loaded", data),
     urlArr = toArr("url", data);

   return {
     title: {
       show: false
     },
     tooltip: {
       trigger: "axis",
       axisPointer: {
         type: "cross", //十字准星指示器
         label: {
           backgroundColor: "#ff801f"
         }
       },
       extraCssText: "width: 300px;white-space: normal",
       formatter: (params) => {
         let str = "时间: " + params[0].axisValue + "<br/>";
         params.forEach((item) => {
           str +=
             "<span style='display: inline-block;background: " +
             item.color +
             ";width: 8px;height: 8px;border-radius: 50%;margin-right: 6px'></span>" +
             item.seriesName +
             ": " +
             item.data +
             "<br/>";
         });
         return str;
       }
     },
     legend: {
       data: [
         "DNS解析",
         "TCP完成握手",
         "TTFB首字节",
         "HTTP响应接收完成",
         "解析DOM",
         "脚本运行",
         "DOMContentLoaded",
         "readyState等于complete",
         "load"
         // "地址"
       ]
     },
     grid: {
       left: "3%",
       right: "4%",
       bottom: "3%",
       containLabel: true
     },
     xAxis: {
       type: "category",
       boundaryGap: false,
       nameLocation: "start",
       data: xArr
     },
     yAxis: {
       type: "value"
     },
     series: [{
         name: "DNS解析",
         type: "line",
         areaStyle: {
           color: "pink"
         },
         data: dnsArr
       },
       {
         name: "TCP完成握手",
         type: "line",
         //  stack: '总量',//数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
         data: tcpArr
       },
       {
         name: "TTFB首字节",
         type: "line",
         data: ttfbArr
       },
       {
         name: "HTTP响应接收完成",
         type: "line",
         data: httpArr
       },
       {
         name: "解析DOM",
         type: "line",
         data: domArr
       },
       {
         name: "脚本运行",
         type: "line",
         data: domContentLoadedEventArr
       },
       {
         name: "DOMContentLoaded",
         type: "line",
         data: domContentLoadedArr
       },
       {
         name: "readyState等于complete",
         type: "line",
         data: domReadyArr
       },
       {
         name: "load",
         type: "line",
         data: loadArr
       },
       {
         name: "地址",
         type: "line",
         data: urlArr
       }
     ]
   }
 }
 /**
  * 整合接口数据生成图表所需数组数据
  * @param {String} key -key值
  * @param {Array} data -接口返回数据值
  * @return {Array} -经过整合后的数据
  */
  function toArr(key, data) {
    let arr = [];
    data.forEach((item) => {
      key === "createTime" ? arr.push(conversionTimestamp(Number(item[key]))) : arr.push(item[key]);
    });
    return arr.reverse();
  }

  function toSelectArr(arr) {
    let newArr = [];
    arr.forEach(item => {
      let obj = {};
      obj.title = item;
      obj.value = item;
      newArr.push(obj);
    })
    return newArr;
  }


  export {
    createOptions, conversionTimestamp, toSelectArr
  }