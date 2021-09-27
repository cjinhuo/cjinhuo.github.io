---
title: 'JS监控SDK手摸手教学-架构篇（已开源）'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2021-10-01
# 时间
tags:
- 前端
# 标签
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**


# 概要
已开源的前端监控SDK:[mitojs](https://github.com/mitojs/mitojs)，有兴趣的小伙伴可以去瞅瞅~

来到正文，本文分成四个部分

* 背景
* SDK的架构与迭代
* 前端监控的具体功能实现
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

## 架构
借鉴了`sentry`和`vue-next`的代码结构，采用的也是[monorepo](https://en.wikipedia.org/wiki/Monorepo)

### monorepo
它的优势有：

1. 分模块打包、分模块热更新（提高开发体验）
2. 抽离抽象类、工具类到某个包，代码结构清晰（降低耦合性，提高代码可读性）

### 包与包之间的关系

![包与包间的关系.png](https://tva1.sinaimg.cn/large/008i3skNly1guvmt3hysqj60uk0u075l02.jpg)

### 设计模式
为了减少文件与文件之间的循环引用，所以**发布订阅模式**是必不可少的

![subscrib](https://tva1.sinaimg.cn/large/008i3skNly1guvmtio2hwj311y0dytad.jpg)








