;(function(param) {
  //version:1.0
  function decode( str ) {
      return decodeURIComponent(escape(window.atob( str )))
  }

  var baseURL = param.svr.indexOf('http') > -1 ? param.svr : decode(param.svr || 'Ly9kZXNpZ24uaHN6cTguY29tL2JlYWNvbg==') 

  var ua = navigator.userAgent,
      isIphone = /(iphone)/.test(ua.toLowerCase()),
      inIosApp = /(hstong)/.test(ua.toLowerCase())

  window.beaconError = []
  window.beaconError.add = function(e){
      this.push({
          type:'report',
          msg:'' + e
      })
  }

  var data = {
      total: 0,
      link: 0,
      script: 0,
      img: 0,
      css: 0,
      xmlhttprequest: 0,
      navigation: 0,
      iframe: 0,
      fetch: 0,
      errorTotal: 0,
      errorContent: window.beaconError
  }

  function addError(err) {
      var errStr = JSON.stringify(err),
          flag = true
      beaconError.forEach(function(item){
          if(JSON.stringify(item) === errStr){
              flag = false
          }
      })
      // 没找到重复的记录才添加
      if(flag){
          beaconError.push(err)
      }
  }


  function addEvent(type, fn) {
      return window.addEventListener ? window.addEventListener(type, fn) : window.attachEvent('on' + type, fn)
  }    

  function getInfo() {        
      try {
          var time = performance.timing    
          var loadTime = (time.loadEventEnd - time.loadEventStart)

          if(loadTime < 0) {
              setTimeout(function() {
                  getInfo()
              }, 0)
              return
          }

          //url地址
          data['url'] = location.href
          //用户ID
          data['agentId'] = param.agentId || location.host
          //userAgent
          data['userAgent'] = navigator.userAgent
          //操作系统平台
          data['platform'] = navigator.platform
          //浏览器供应商time.domContentLoadedEventEnd - time.navigationStart
          data['vendor'] = navigator.vendor
          //屏幕密度比
          data['devicePixelRatio'] = devicePixelRatio
          //屏幕宽度
          data['width'] = screen.width
          //屏幕高度
          data['height'] = screen.height
          //HTML字体大小
          data['fontSize'] = window.getComputedStyle(document.documentElement).fontSize
          //重定向时间
          data['redirect'] = (time.redirectEnd - time.redirectStart)
          //DNS解析时间
          data['dns'] = (time.domainLookupEnd - time.domainLookupStart)
          //TCP完成握手时间
          data['tcp'] = (time.connectEnd - time.connectStart)
          //TTFB首字节时间
          data['ttfb'] = (time.responseStart - time.navigationStart)
          //HTTP响应全部接收完成时间
          data['responseTime'] = (time.responseEnd - time.requestStart)
          //解析DOM耗时（下一步加载内嵌资源）
          data['domInteractive'] = (time.domInteractive - time.domLoading)
          //脚本运行耗时（下一步DomReady）
          data['domContentLoadedEvent'] = (time.domContentLoadedEventEnd - time.domContentLoadedEventStart)
          //DOMContentLoaded时间(domReady)
          data['DOMContentLoaded'] = (time.domContentLoadedEventEnd - time.navigationStart)
          //readyState等于complete时间(domReady)
          data['domReady'] = (time.domComplete - time.navigationStart)
          //onload时间(所有资源加载完成)
          data['loaded'] = (time.loadEventEnd - time.navigationStart)            

          if(performance.getEntries){
              var entriesArr = performance.getEntries()               
              // 总请求数
              data['total'] = entriesArr.length
              
              entriesArr.forEach(function(item,idx){
                  // 各请求类型计数
                  item.initiatorType && data[item.initiatorType] ++                   
              })
              
          }            

          if(isIphone && inIosApp){
              sendLogData()
          }

      } catch(e) {
          console.log(e)
      }
  }

  function sendLogData() {
      if(!data['agentId']){
          return
      }
      // 在提交前才赋值，因为改变beaconError的地方太多了
      data['errorTotal'] = beaconError.length
      data['errorContent'] = JSON.stringify(beaconError)
      navigator.sendBeacon(baseURL, JSON.stringify(data))
  }

  // 捕捉Promise没有处理reject时的错误
  window.addEventListener('unhandledrejection', function(event) {
      //console.log('unhandledrejectionEvent:',event)
      
      addError({
          type: event.type,
          reason: event.reason
      })
      
  },false)

  // 可以捕获图片\JS\CSS加载失败的错误
  window.addEventListener('error', function(event) {
      var ele = event.target || event.srcElement,
      nodeName = ele.nodeName && ele.nodeName.toLowerCase()
      //console.log('addEventListener-Error:',event)
      if(nodeName === 'img'
       || nodeName === 'script'
       || nodeName === 'link'
       || nodeName === 'video'
       || nodeName === 'audio'
       ){
          //console.log('图片、JS、CSS、视频、音频加载错误！')

          var errData = {
                  type: event.type,
                  target: ele.nodeName,
                  baseURI: ele.baseURI                    
              }
          if(nodeName === 'link'){
              errData.href = ele.href
          }else{
              errData.src = ele.src
          }

          addError(errData)
      }

  }, true);

  window.onerror = function(msg, url, line,column,error) {
      // console.log("错误信息：" , msg);
      // console.log("出错文件：" , url);
      // console.log("出错行号：" , line);
      // console.log("出错列号：" , column);
      // console.log("错误详情：" , error);

      var errData = {
              msg: msg,
              url: url,
              line: line
          }
      if(column){
          errData.column = column
      }
      if(error){
          errData.error = error
      }

      addError(errData)
    }

  addEvent('load', getInfo)
  addEvent('unload', sendLogData)

})(function(){
  var scripts =  document.getElementsByTagName('script'),
  svr='',agentId='',
  length = scripts.length,
  src = scripts[length - 1].src
  if(!src){
      throw new Error("未获得自身路径信息，请联系开发者！")
  }

  var param = src.split('?')[1]
  var getVal = function(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
          r = param.match(reg)
      if(r!=null){
          return  r[2]
      }
      return ''
  }

  if(!param){
      console.warn("未获得参数信息，将使用默认值！")
  }else{
      svr = getVal('svr')
      agentId = getVal('agentId')

      //console.log('svr:',svr)
      //console.log('agentId:',agentId)
  }
  

  return {
      svr: svr,
      agentId: agentId
  }
}());