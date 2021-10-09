---
title: '前端监控:监控SDK手摸手Teach-架构篇(已开源)'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2021-10-01
tags:
- SDK
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**


# 概要
本文的主要目的是介绍一种可扩展性较好的SDK架构，让后续业务迭代的代码更清晰明朗。这种架构已经在开源监控SDK:[mitojs](https://github.com/mitojs/mitojs)实践，有兴趣的小伙伴可以去瞅瞅~

来到正文，本文分成三个部分

* 背景
* SDK的架构与迭代
* 结尾


# 背景
传统模式下，前端项目发到正式环境后就变成了一个黑盒子，所有报错信息只能通过用户使用时截图、口头描述发送到开发者，然后开发者来根据用户所描述的场景去模拟这个错误的产生，这效率特低，所以很多开源或收费的前端监控平台就应运而生，比如:

* [sentry](https://github.com/getsentry/sentry)
* [webfunny](https://github.com/a597873885/webfunny_monitor)
* [fundebug](https://www.fundebug.com/)
* [阿里云前端监控(ARMS)](https://www.aliyun.com/product/arms)

等等一些优秀的监控平台

## 自研的优势

1. `阿里云前端监控(ARMS)`和`fundebug`需要投入大量金钱来作为支持，而`webfunny`和`sentry`虽是可以用`docker`私有化部署，但由于其源代码没有开源，二次开发受限
2. 可以将公司所有的SDK统一成一个，包括但不限于：埋点平台SDK、性能监控SDK、录屏SDK
3. 可以无缝共享采集到的信息，比如错误信息可以和埋点信息联动，便可拿到更细的用户行为栈，更快的排查线上错误
4. 可以设计更好的服务端结构，相同服务器的性能，不同的架构可以抗住不同的QPS

## 监控平台的组成

![整体流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebf9ce746d034a209429a694655f1ffa~tplv-k3u1fbpfcp-zoom-1.image)

# SDK的架构与迭代
前端监控的原理其实就那么几个，比如拦截http请求就是重写原生函数:fetch、XMLHttpRequest，监控代码错误：window.onerror，但SDK也是一个工程，是需要不断迭代追加功能的，所以良好的架构可以为后期迭代打下不错的地基

## monorepo
借鉴了`sentry`和`vue-next`的代码目录结构，最终也是采用[monorepo](https://en.wikipedia.org/wiki/Monorepo)

它的优势：

1. 分模块打包、分模块热更新、分包发布（提高开发体验）
2. 抽离抽象类、工具类到某个包，代码结构清晰（降低耦合性，提高代码可读性）

### 包与包之间的关系

![包与包间的关系.png](https://files.catbox.moe/00of0w.png)


### 多包打包与发布
试用了[lerna](https://github.com/lerna/lerna)后，发现它的功能太多，我想要的只是一个打包和发布的功能，最终是用js脚步编写根据命令行的入参来调用`rollup`的`api`和`npm`的`api`来打包和发布，具体[打包脚本](https://github.com/mitojs/mitojs/blob/master/script/build.js)

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
![baseplugin.png](https://files.catbox.moe/tti6z1.png)


这时就会有人说了，如果我的业务比这复杂多了，那这个架构还能撑住吗？是可以的，将上面插件中的3个hooks:`monitor、transform、consumer`分成更多hooks，可以是5个也可以是10个，只要你分的颗粒度足够细，且完全按照这些hooks的对应功能来编写代码，不管你的项目代码有多几十万行，你的代码层次结构都是很清晰的
### 举个🌰：监听unhandlerejection的插件

![unhandlerejectionPlugin.png](https://files.catbox.moe/86e8gp.png)


### 插件实际在代码中的使用

![browserClient](https://files.catbox.moe/8k4tdh.png)

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
可以去[vue3 Demo](https://mitojs.github.io/vue3-sdk-demo/#/page-one)体验一下sdk收集的数据，更多信息可以访问[vue3 接入指南](https://mitojs.github.io/mito-doc/#/sdk/guide/vue)

## @mitojs/core

上面讲完插件是构成整个`SDK`的主要链路，现在讲下最基本的一些工具类，来串联这些插件，由于需要支持多个端，每个端需要监听的事件、上报方式、可配置项的是不同的，所以需要抽离多个抽象类，方便扩展。如下是[@mitojs/core](https://github.com/mitojs/mitojs/tree/master/packages/core)的整体思维导图

![core.png](https://files.catbox.moe/rtv75h.png)


## 浏览器的整体思维导图

![browser-architecture](https://files.catbox.moe/g57hci.png)


## 微信小程序的整体思维导图

![wx-mini-architecture](https://files.catbox.moe/bsl1h2.png)

## 可迭代性
后续如果有人想`pull request` `node监控`或`其他小程序的监控`，只要按照这个插件模式开发，可迭代性便会大大提高

# 结尾

## 🤔 小结

该架构的思想可适用于任何SDK，不同SDK中对应插件的个数和作用不同。总而言之，把一个大功能分隔成几个小功能区域，在指定的区域写指定功能的代码，让代码逻辑有规律可循。

下一篇「监控SDK手摸手Teach-实现篇」会讲具体在插件代码的编写，敬请期待~

## 🧐 开源

老仓库[monitor](https://github.com/clouDr-f2e/monitor)的错误监控原作者已不再维护，推荐到新的仓库[mitojs](https://github.com/mitojs/mitojs)，新SDK重构后，包的体积更小、代码架构更清晰，耦合性更低，功能上完全包含了老仓库，也推出了最新的[mitojs文档](https://mitojs.github.io/mito-doc/#/sdk/guide/introduction)，目前有部分人在用[mitojs](https://github.com/mitojs/mitojs)在做自己的监控平台或者埋点相关业务，如果你感兴趣可以，不妨过来瞅瞅 😘


## 📞 联系&内推

字节架构前端大量招人，内推可帮助修改简历和实时查询面试进度，欢迎砸简历到我的**邮箱:chenjinhuo@bytedance.com**

如果你对字节架构前端、错误监控、埋点感兴趣、也直接联系我的**微信:cjinhuo**

**Have A Good Day!!!**




