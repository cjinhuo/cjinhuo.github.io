---
title: 'IoC和DI'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories:
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- 依赖注入
- 控制反转
- nest
- IoC
- DI
- Martin Fowler
- 翻译
# 标签
---

::: tip 概述
IoC（Inversion of Control）即“控制反转”，不是什么技术，而是一种设计思想。尤其是在OOP的设计思想当中运用相当广泛。

DI（Dependency Injection），即“依赖注入”，是组件之间依赖关系由容器在运行期决定，即由容器动态的将某个依赖关系注入组件之中。
:::

::: tip
在Java社区有大量轻量级的容器来帮助不能的项目来选择的应用程序。这些容器运行的是一个公共的模式，这个概念通常叫做“控制反转（Inversion of Control）”，在这篇文章我讲解了这个模式是怎么运行的，还有一个更具体的名叫“注入依赖（Dependency Injection）”，对比它们两个之间的服务定位差异。它们之间的选择没有比将配置和使用分析的原则更重要。
:::

企业级Java的一个有趣的点是在构建大量主流J2EE技术的替代方案方面有大量的获取，且大部分都是在开源环境下发生的。这在很大程度上是对主流J2EE世界的重量级复杂性的一种反应，但它也在探索替代方案并提出创造性的想法。要解决一个常见的问题是怎么将不同的元素连接到一起，当web的controller层被互不了解的不同团队构建时，如果将它们与数据库接口相结合。（这应该就是DTO层出现的原因了）。许多框架尝试解决这个问题，部分框架正在扩展以提供从不同层封装组件的能力。这些都被称作为轻量级容器，例如包括[PicoContainer](http://picocontainer.com/)和[Spring](https://spring.io/)。

在这些容器有一部分有趣的设计原理，这些设计原理超越了一些特殊的容器和Java平台。这里我想探索一些一个原理。我使用的例子都是在Java中使用的，但就像我编写大多数原理一样，这些原理同样适用于其他OO环境，特别是.NET。
## 组件和服务(Components and Services)
围绕这些服务和组件把每个元素相连的部分立即让我陷入棘手的技术问题。你可以轻松的找到关于这些事情定义的冗长而又矛盾的文章。出于我的目的，这些是我目前的看法（ For my purposes here are my current uses of these overloaded terms.

）

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

