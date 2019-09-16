---
title: 'watchAndComputed源码分析'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: frontEnd
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- Vue
- 前端
- Vue源码分析
# 标签
---

::: tip 概述
。。。
:::

## Vue源码解读流程
1. new Vue调用的是Vue.prototype._init
2. 经过$options参数合并之后
3. initLifeCycle 初始化生命周期
4. 初始化事件
5. 初始化渲染函数
6. 初始化状态
7. 将数据添加到观察者中实现双数据绑定

模板编译
数据劫持

## 双向数据绑定原理
observe()方法判断value中有没有_ob_属性并且是不是Observe实例化的，value是不是Vnode实例化的，如果不是则调用Observe去把数据添加到观察者中，为数据添加_ob_属性，Observe则调用defineReacive

## Watch






