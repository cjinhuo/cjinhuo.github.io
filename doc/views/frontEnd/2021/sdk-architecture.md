---
title: '前端监控:JS监控SDK手摸手教学-架构篇(已开源)'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2021-10-01
tags:
- 前端
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**


# 概要
已开源的前端监控SDK:[mitojs](https://github.com/mitojs/mitojs)，有兴趣的小伙伴可以去瞅瞅~

来到正文，本文分成四个部分

* 背景
* SDK的架构与迭代
* 结尾



# 背景

传统模式下，一个前端项目发到正式环境后，所有报错信息只能通过用户使用时截图、口头描述发送到开发者，然后开发者来根据用户所描述的场景去模拟这个错误的产生，这效率肯定超级低，所以很多开源或收费的前端监控平台就应运而生，比如:

* [sentry](https://github.com/getsentry/sentry)
* [webfunny](https://github.com/a597873885/webfunny_monitor)
* [fundebug](https://www.fundebug.com/)
* [阿里云前端监控(ARMS)](https://www.aliyun.com/product/arms)

等等一些优秀的监控平台



## 为什么不选择上面四个监控平台或者其他监控平台，为什么要自己搞？

1. `fundebug`需要投入大量金钱来作为支持，而`webfunny`和`sentry`虽是可以用`docker`私有化部署，但由于其源代码没有开源，二次开发受限
2. 自己开发可以将公司所有的SDK统一成一个，包括但不限于：埋点平台SDK、性能监控SDK
3. 统一SDK的好处是可以共享采集到的信息，比如错误信息可以和埋点信息联动，便可拿到更细的用户行为栈，更快的排查线上错误

## 监控平台的组成

![整体流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebf9ce746d034a209429a694655f1ffa~tplv-k3u1fbpfcp-zoom-1.image)

# SDK的架构与迭代
了解前端监控的原理其实就那么几个，比如拦截http请求就是重写原生函数:fetch、XMLHttpRequest，监控代码错误：window.onerror，但SDK也是一个工程，是需要不断迭代追加功能的，所以架构就尤为重要

## monorepo
借鉴了`sentry`和`vue-next`的代码结构，采用的也是[monorepo](https://en.wikipedia.org/wiki/Monorepo)

它的优势：

1. 分模块打包、分模块热更新（提高开发体验）
2. 抽离抽象类、工具类到某个包，代码结构清晰（降低耦合性，提高代码可读性）

### 包与包之间的关系

![包与包间的关系.png](https://tva1.sinaimg.cn/large/008i3skNly1guvmt3hysqj60uk0u075l02.jpg)


### 多包打包与发布
使用了[lerna](https://github.com/lerna/lerna)后，发现它的功能太多了，我想要的只是一个打包和发布的功能，所以就自己用脚步写了根据命令行的入参来调用`rollup`的`api`和`npm`的`api`来打包和发布，具体[打包脚本](https://github.com/mitojs/mitojs/blob/master/script/build.js)

## 可插拔的插件思路
该思路是从[rollup](https://rollupjs.org/guide/en/#plugins-overview)和监控开源库[dora](https://github.com/dora-projects/dora/tree/master/packages/browser/src/plugins)中借鉴。


我们需要监控:
* xhr
* fetch
* hashroute
* historyroute
* error
...等等

### 传统模式
1. 重写xhr
2. 在重写的过程中拿到想要的数据
3. 通过发布订阅回传
4. 在订阅中心中拿到数据，并处理

如果没有规范的约束，每个重写的过程都会变的杂乱无章，回传数据和处理数据可能到处都是。

如果我们借鉴了插件模式后，会变成什么样呢？

### 插件模式

```js
interface BasePluginType<T extends EventTypes = EventTypes, C extends BaseClientType = BaseClientType> {
  // 事件枚举
  name: T
  // 监控事件，并在该事件中用notify通知订阅中心
  monitor: (this: C, notify: (eventName: T, data: any) => void) => void
  // 在monitor中触发数据并将数据传入当前函数，拿到数据做数据格式转换
  transform?: (this: C, collectedData: any) => any
  // 拿到转换后的数据进行breadcrumb、report等等操作
  consumer?: (this: C, transformedData: any) => void
}
```
![baseplugin.png](https://tva1.sinaimg.cn/large/008i3skNly1guw5jsozvxj61t80g2gno02.jpg)

### 举个🌰：监听unhandlerejection的插件

![unhandlerejectionPlugin.png](https://tva1.sinaimg.cn/large/008i3skNly1guw648m4k4j60vu0u0q6l02.jpg)


### 插件实际在代码中的使用

![browserClient](https://tva1.sinaimg.cn/large/008i3skNly1guw8datft7j61d80ik0uk02.jpg)

### 在Vue3使用@mitojs/vue

```js
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { init } from "@mitojs/browser";
import { vuePlugin } from "@mitojs/vue";

const app = createApp(App)
const MitoInstance = init({
  vue: app,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
},[vuePlugin])
```
[vue3 接入指南](https://mitojs.github.io/mito-doc/#/sdk/guide/vue)

## @mitojs/core

上面讲完插件是构成整个`SDK`的主要链路，现在讲下最基本的一些工具类，来串联这些插件，由于需要支持多个端，每个端需要监听的事件、上报方式、可配置项的是不同的，所以需要抽离多个抽象类，方便扩展。如下是[@mitojs/core](https://github.com/mitojs/mitojs/tree/master/packages/core)的整体思维导图

![core.png](https://tva1.sinaimg.cn/large/008i3skNly1guw76vrmtsj611h0u0mzr02.jpg)


## 浏览器的整体思维导图

![browser-architecture](https://tva1.sinaimg.cn/large/008i3skNly1guw7f0b21zj60z40u0wh202.jpg)


## 微信小程序的整体思维导图

![wx-mini-architecture](https://tva1.sinaimg.cn/large/008i3skNly1guw87jvjjqj618f0u0whj02.jpg)

## 可迭代性
后续如果有人想`pull request` `node监控`或`其他小程序的监控`，只要按照这个插件模式开发，可迭代性便会大大提高

# 结尾

## 🧐 开源

老仓库[monitor](https://github.com/clouDr-f2e/monitor)的错误监控原作者已不再维护，推荐到新的仓库[mitojs](https://github.com/mitojs/mitojs)，新SDK重构后，包的体积更小、代码架构更清晰，耦合性更低，功能上完全包含了老仓库，也推出了最新的[mitojs文档](https://mitojs.github.io/mito-doc/#/sdk/guide/introduction)，目前有部分人在用[mitojs](https://github.com/mitojs/mitojs)在做自己的监控平台或者埋点相关业务，如果你感兴趣可以，不妨过来瞅瞅，顺便点个star 😘



## 🤔 预告

下篇将会发布：前端监控:JS监控SDK手摸手教学-实现篇



## 📞 联系&内推

如果你对前端错误监控、埋点、性能监控、前端八卦感兴趣可以点[联系我](https://mitojs.github.io/mito-doc/#/help)，里面有我的详细联系方式和前端交流群

**微信:**cjinhuo

字节架构前端大量招人，内推可帮助修改简历和实时查询面试进度，欢迎砸简历到我的邮箱:chenjinhuo@bytedance.com





