---
title: "前端监控:监控SDK手摸手Teach-微信小程序篇(已开源)"
description: "微信小程序监控SDK实现，包括网络请求监控、路由切换监控、onerror监听、tab/touch事件获取、埋点实现等"
tags: ['SDK', '前端监控', '微信小程序']
pubDate: '2021-10-20'
---

## 概要
已开源的前端监控SDK:[mitojs](https://github.com/mitojs/mitojs)，有兴趣的小伙伴可以去瞅瞅~([SDK在线Demo](https://mitojs.github.io/react-sdk-demo/#/page-one))


来到正文，本文分成三个部分

* 背景
* 微信小程序的监控实现
* 微信小程序的埋点实现
* 结尾


## 背景
接着前端监控系列的内容：
* [前端监控:监控SDK手摸手Teach-架构篇(已开源)](/blogs/2021/sdk-architecture)
* [前端监控:监控SDK手摸手Teach-实现篇(已开源)](/blogs/2021/sdk-principle)

本文的主要目的讲下`微信小程序(wx-mini)监控`与`Web监控`的区别，以及如何编写小程序的埋点和错误监控

## 微信小程序的监控实现
微信小程序监控也是通过劫持微信官方抛出全局对象的方法，由于小程序的运行环境并没有`window`和`document`对象，它只暴露了一个`wx`全局对象，比如我要拦截页面的`ajax`请求，在web端重写`window.XMLHttpRequest`和`fetch`，在微信小程序端则需要重写`wx.request`

### 监控微信小程序的网络请求
微信小程序常见的网络请求有：
* wx.request
* wx.downloadFile
* wx.uploadFile

所以我们就重写这三个进行重写，并拿到入参:
```js
enum WxXhrTypes {
  request = 'request',
  downloadFile = 'downloadFile',
  uploadFile = 'uploadFile'
}
function monitorWxXhr(this: WxClient, notify: (eventName: WxEventTypes, data: any) => void) {
  const hookMethods = Object.keys(WxXhrTypes)
  const that = this
  hookMethods.forEach((hook) => {
    const originRequest = wx[hook]
    Object.defineProperty(wx, hook, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function (...args: any[]) {
        const options = args[0]
        // 获取需要的数据信息
        const { url, method, header, reqData } = options
        // 收集小程序的请求信息
        const httpCollect = {
          request: {
            httpType: HttpTypes.XHR,
            url,
            method,
            data: reqData
          },
          response: {},
          time: Date.now()
        }
        // 成功回调
        const successHandler = function (res) {
          httpCollect.response.data = res.data
          // 通知订阅中心
          notify(WxBaseEventTypes.REQUEST, httpCollect)
          return options.success(res)
        }
        const _fail = options.fail
        // 失败回调
        const failHandler = function (err) {
          // 系统和网络层面的失败
          httpCollect.errMsg = err.errMsg
          // 通知订阅中心
          notify(WxBaseEventTypes.REQUEST, httpCollect)
          return _fail(err)
        }
        const actOptions = {
          ...options,
          success: successHandler,
          fail: failHandler
        }
        // return 原始函数
        return originRequest.call(this, actOptions)
      }
    })
  })
}

```

完整的代码请[点击这里](https://github.com/mitojs/mitojs/blob/master/packages/wx-mini/src/plugins/wxRequest.ts)

### 监控小程序路由切换
首先要列出可能触发小程序路由切换的事件：
```js
const enum WxRouteEvents {
  SwitchTab = 'switchTab',
  ReLaunch = 'reLaunch',
  RedirectTo = 'redirectTo',
  NavigateTo = 'navigateTo',
  NavigateBack = 'navigateBack',
  NavigateToMiniProgram = 'navigateToMiniProgram',
  RouteFail = 'routeFail'
}
```

下一步是对上面这些事件重写,就以`NavigateTo`为例：
```js
  const methods = [WxRouteEvents.NavigateTo]
  methods.forEach((method) => {
    const originMethod = wx[method] as Function
    Object.defineProperty(wx, method, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function (options) {
        const toUrl = (options as WechatMiniprogram.SwitchTabOption).url
        const data = {
          from: getCurrentRoute(),
          to: toUrl
        }
        notify(WxBaseEventTypes.ROUTE, data)
        return originMethod.call(this, options)
      }
    })
  })
```
其他的方法也是如此，不过需要注意失败回调信息的获取，完整代码请[点击这里](https://github.com/mitojs/mitojs/blob/master/packages/wx-mini/src/plugins/wxRoute.ts)

### 监控onerror
类似`Web`的`window.onerror`，不过小程序返回的是不是一个错误对象，而是一个字符串，需要自行解析其中的值（注意：[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onError-String-error)上写的是`string`，但是我也有在某个开发者电脑中出现过`Error`对象）
```js
const originApp = App
App = function (appOptions: WechatMiniprogram.App.Option) {
  replaceOld(
    appOptions,
    'onError',
    function (originMethod: voidFun) {
      return function (...args: any): void {
        // 让原本的函数比抛出的hooks先执行，便于埋点判断是否重复
        if (originMethod) {
          originMethod.apply(this, args)
        }
        // 拿到args信息
        // notify
      }
    },
    true
  )
  return originApp(appOptions)
}
```
重写App中的`onError`方法， 并拿到错误信息随后进行数据解析，[完整代码](https://github.com/mitojs/mitojs/blob/master/packages/wx-mini/src/plugins/wxApp.ts)

### 获取小程序的tab、touch等事件
由于小程序是不能全局监听`tab`、`touch`等事件和获取不到页面的dom结构的，所以只能从方法参数入手。主要思路：所有的事件会有个`e`的参数，这个`e`中会有类型、节点信息等等，这个`e`一般情况是函数的第一个参数，所以只要重写`Page`下的所有函数，并判断函数的第一个参数是否包含`type`和`currentTarget`，比如这样判断:`e && e.type && e.currentTarget`

```js
const originPage = Page
Page = function (options) {
  const linstenerTypes = [LinstenerTypes.Touchmove, LinstenerTypes.Tap]
  if (options) {
    Object.keys(options).forEach((m) => {
      if ('function' !== typeof options[m]) {
        return
      }
      // 公用方法，便于重写操作
      replaceOld(
        options,
        m,
        function (originMethod: (args: any) => void) {
          return function (...args: any): void {
            const e = args[0]
            // 判断是否是事件
            if (e && e.type && e.currentTarget && !e.mitoWorked) {
              if (linstenerTypes.indexOf(e.type) > -1) {
                // 拿到e，e会包括class id data属性
                // notify(e)
              }
            }
            return originMethod.apply(this, args)
          }
        },
        true
      )
    })
  }
  return originPage(pageOptions)
}

```
在小程序中测试可以收集到的信息，如下图所示：

![](https://files.catbox.moe/atgms4.jpg)

## 微信小程序的埋点实现
埋点其实就是在各种生命周期中存储信息和获取信息并将有用信息上报的过程。

场景一：需要上报页面的曝光时长和PV

做法：在页面刚加载时记录开始时间`startTime`并将当前路由记住，在页面切换时用当前时间减去开始时间:`Date.now() - startTime`，并连带上个页面的路由上报

这里需要用到两个钩子函数：
1. 页面加载时
2. 页面卸载时

所以[@mitojs/wx-mini](https://mitojs.github.io/mito-doc/#/sdk/guide/wx-mini#wxhookoptionstype)提供了一些列的hooks供开发者调用，比如上面的两个hooks对应小程序的
1. 页面加载时[pageOnLoad](https://mitojs.github.io/mito-doc/#/sdk/guide/wx-mini#pageonloadpage-iwxpageinstance-void)
2. 页面卸载时[pageOnUnload](https://mitojs.github.io/mito-doc/#/sdk/guide/wx-mini#pageonunloadpage-iwxpageinstance-void)

这时有人就要说了，这不是微信小程序自带的钩子函数么？是的，肯定是微信本身是自带了这些钩子，我在才能重写并且抛出。正常情况下是每个`Page`下面都有很多钩子函数，如果不稍作处理，你需要在很多`Page`下写很多个钩子，而用了[SDK](https://github.com/mitojs/mitojs/tree/master/packages/wx-mini)后，只需要写一遍即可

埋点示例:
```js
const MitoInstance = MITO.init({
  pageOnShow,
  pageOnHide
})
wx.MitoInstance = MitoInstance

const currentPage = {
  startTime: 0,
  page: null
}
function pageOnShow(page) {
  // 进入页面埋点
  wx.MitoInstance.trackSend({
    // 可自定义
    actionType: 'PAGE',
    route: page.route
  })
  currentPage.startTime = Date.now()
  currentPage.page = page
}
function pageOnHide(page) {
  // 离开页面埋点
  const endTime = Date.now()
  const elapsedTime = endTime - currentPage.startTime
  // 拿到信息并上报
  console.log('currentPage', currentPage)
  wx.MitoInstance.trackSend({
    // 可自定义
    actionType: 'DURATION',
    // 曝光时间
    elapsedTime,
    // 页面路由
    route: currentPage.page.route
  })
}
```

## 结尾

### 小结
小程序错误监控和web相似，注意下在重写原生事件时注意下返回值，避免篡改原始值。

埋点主要是在各个`hooks`中拿到埋点信息并上报的一个过程，所以先拿到大部分的`hooks`，然后就可以`DIY`你的埋点。

### 开源

[小程序监控文档](https://mitojs.github.io/mito-doc/#/sdk/guide/wxtrack)，目前有部分人在用[mitojs](https://github.com/mitojs/mitojs)在做自己的监控平台或者埋点相关业务，如果你感兴趣可以，不妨过来瞅瞅

### 联系&内推
如果你对字节前端（内推）、错误监控、埋点感兴趣、也直接联系我的**微信:cjinhuo**

**Have A Good Day!!!**
