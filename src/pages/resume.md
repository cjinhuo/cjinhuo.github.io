---
layout: '../layouts/resume.astro'
title: '陈金伙的简历'
description: '陈金伙的简历'
---

## 个人信息
福建理工大学-软件工程
Email：cjinhuo@qq.com [开源前端监控 SDK](https://github.com/mitojs/mitojs)
[掘金](https://juejin.cn/user/1210958492176284) [个人网站](https://cjinhuo.netlify.app/)

---

# 技能清单

- 熟悉 React Hook、jotai、
- 熟悉 小程序、Web、node.js 监控领域、nestjs、redis(hash、set、list、bitmap)、mysql
- 熟悉全栈开发，
- 熟悉大型 SDK 架构搭建、jest 单测编写、puppetter 或 cypress 的 e2e 编写
- 了解 HTTP/TCP 协议与数据结构、docker、nginx
---

### 字节跳动-APM（2021 年 8 月 ~ 至今 资深前端工程师）

### 智云健康（2020 年 4 月 ~ 至今 高级前端工程师）

### 前端监控系统

**项目概述：收集线上报错信息、自定义埋点、接口报错（关联网关层）、用户行为栈、PvUv、录制页面操作并告警到对应前端开发者，支持 h5、微信小程序。覆盖公司 95%的 h5 项目，解决线上故障至少 5 次**

负责内容：上报数据、数据消费、数据聚合的可行性方案调研、产出表结构和技术方案思维导图、prd 设计、全栈核心代码开发

**SDK：rollup+ts，[github 已开源](https://github.com/clouDr-f2e/mitojs)，目前有 1000+star**

主要功能：收集页面的用户操作行为栈、路由跳转、接口报错、代码报错（Js、Vue、react 代码错误）,微信小程序:生命周期 hooks 暴露、全局用户行为事件拦截、请求和资源拦截、代码报错。目前至少 5 家公司正在使用该 SDK 进行错误收集并自主搭建公司内部监控系统

**服务端：nestjs+Sequelize+redis+mysql+rocketMq+docker**

主要功能：接收客户端上报信息，存入 redis.list 与 rocketMq，并定时批量处理错误日志，将计算后的结果批量入库并通知对应开发者。以及错误等级配置与告警规则引擎、sourcemap 还原、错误查询、可配置团队成员、项目成员等等接口

**前端：react + ts + recoil**

主要功能：展示项目的 PvUv、错误列表、错误详情、接口信息、资源信息、代码错误信息、线上 sourcemap 代码还原、录制回放、错误标签集合（手机型号、浏览器型号、地理位置、ip 等等）

## 公司战略项目

owner 过两个公司战略项目需求，带过三人小团队在一个月半的时间里面按时完成业务需求，并得到该战略项目奖金

## 技术氛围&社区

主导团队内部技术分享机制。个人输出四篇高质量原创文章，并推动团队其他成员输出原创和翻译文章，年底获得掘金社区的 2020 年度人气团队 No.3

## rollup monorepo 打包模板

**项目概述：基于 rollup 的多包打包、发布、e2e、单测的模板，[github 已开源](https://github.com/cjinhuo/rollup-monorepo-ts-jest-boilerplate)**

主要功能：配有 jest 的单测、jest+puppetter（无头浏览器）的 e2e 测试、多包打包的脚本、多包发布的脚本、多包版本更改与验证的脚本

在内部被其他业务组接入两次并完成开发上线

## 奇点云 （ 2019 年 3 月 ~ 2020 年 4 月份 前端工程师）

### 数据中台（Web）
技术栈：Vue + Vuex + Vue Router + Element 等

负责内容：

1.设计基于 Vue router 的侧边栏、头部、面包屑的一体化配置中心，以便其他开发人员开发新需求时仅需关注业务功能的开发。

2.设计基于 swagger 生成 services 层代码的[工具](https://github.com/TypeInfos/groot-front)，统一 services 层代码规范和减少人工代码量。

