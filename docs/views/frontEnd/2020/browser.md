---
title: '浏览器基础知识'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2020-04-30
# 时间
tags:
- 模板
# 标签
---

::: tip 概述
。。。
:::

## 第一个大标题

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

## EventTarget
::: tip
EventTarget是一个DOM接口，由可以接受事件、并且可以创建侦听器的对象实现。Element，document 和 window 是最常见的 event targets ，但是其他对象也可以作为 event targets，比如 XMLHttpRequest，AudioNode，AudioContext  等等。

许多 event targets （包括 elements， documents 和 windows）支持通过 onevent 特性和属性设置事件处理程序 (event handlers)。
:::
### 实例化
```js
class MyEventTarget extends EventTarget {
  constructor(mySecret) {
    super();
    this._secret = mySecret;
  }

  get secret() { return this._secret; }
};

let myEventTarget = new MyEventTarget(5);
let value = myEventTarget.secret;  // == 5
// 在当前事件目标上添加名为foo的事件侦听器
myEventTarget.addEventListener("foo", function(e) {
  this._secret = e.detail;
});
// 创建名为foo的事件
let event = new CustomEvent("foo", { detail: 7 });
// 派发名为foo的事件，并且把参数传入进去
myEventTarget.dispatchEvent(event);
let newValue = myEventTarget.secret; // == 7
```
### 原型链&&方法
`window.EventTarget.prototype`的方法：

* addEventListener
* removeEventListener
* dispatchEvent
