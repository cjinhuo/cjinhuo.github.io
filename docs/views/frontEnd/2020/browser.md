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
浏览器的一些原理
:::

<!-- more -->


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

## hashchange&&popstate
### hashchange
::: tip
当URL的片段标识符更改时，将触发hashchange事件 (跟在＃符号后面的URL部分，包括＃符号)，也就是说在history模式下，这个事件是不不会触发的。
:::
### popstate
::: tip
当活动历史记录条目更改时，将触发popstate事件。需要注意的是调用history.pushState()或history.replaceState()不会触发popstate事件。
在我自己测试的几种环境下，基本上`popstate`的事件是包含`hashchange`事件所反馈的。不管在history模式还是hash模型下，都会触发popstate事件。
:::
**触发情况**

**（hash模式下）：**

1. `location.hash += '123'`两者都能触发

2. 调用history.back()或者history.forward()方法时两者都能触发

**（history模式下）：**

1. 用pushState进入一个/test页面，然后用浏览器本身的返回时触发popstate

2. 调用history.back()或者history.forward()方法时触发popstate

3. `location.hash += '123'`两者都触发

::: tip 模式
并不是说在react或者vue中的route指定了哪一种模式，当前页面就一定永远是这种模式，判断这种模式要看路由地址后面是否跟了#，如果有则是hash模式，反之是history
:::

