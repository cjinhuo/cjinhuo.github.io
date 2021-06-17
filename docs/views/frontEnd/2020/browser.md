---
title: '浏览器基础知识'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2020-04-30
# 时间
tags:
- 浏览器
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

### browser history
1. 告诉浏览器这是一个history模式，不需重新加载页面资源
2. 需要配置服务器返回的index.html处理应用启动最初的 / 这样的请求应该没问题，但当用户来回跳转并在 /accounts/123 刷新时，服务器就会收到来自 /accounts/123 的请求

如果你的服务器是nginx，使用`try_files`
```js
server {
  ...
  location / {
    try_files $uri /index.html
  }
  // 不管根路径后面的参数是什么，都返回index.html文件
  // 按指定的file顺序查找存在的文件，并使用第一个找到的文件进行请求处理
}
```

### 内存泄露
1. 意外的全局变量
由于 js 对未声明变量的处理方式是在全局对象上创建该变量的引用。如果在浏览器中，全局对象就是 window 对象。变量在窗口关闭或重新刷新页面之前都不会被释放，如果未声明的变量缓存大量的数据，就会导致内存泄露。

* 未声明变量
```js
function fn() {
  // 此时this指向window
  a = 'global variable'
}
fn()
```
解决方法：

避免创建全局变量，使用严格模式,在 JavaScript 文件头部或者函数的顶部加上 use strict。


2. 闭包引起的内存泄漏
原因：闭包可以读取函数内部的变量，然后让这些变量始终保存在内存中。如果在使用结束后没有将局部变量清除，就可能导致内存泄露。
```js
function fn () {
  var a = "I'm a";
  return function () {
    console.log(a);
  };
}
```
解决：将事件处理函数定义在外部，解除闭包，或者在定义事件处理函数的外部函数中。

3. 没有清理的DOM元素引用
原因：虽然别的地方删除了，但是对象中还存在dom的引用
```js
// 在对象中引用DOM
var elements = {
  btn: document.getElementById('btn'),
}
function doSomeThing() {
  elements.btn.click()
}

function removeBtn() {
  // 将body中的btn移除, 也就是移除 DOM树中的btn
  document.body.removeChild(document.getElementById('button'))
  // 但是此时全局变量elements还是保留了对btn的引用, btn还是存在于内存中,不能被GC回收
}
```
还可以用weakMap的key作为引用
```js
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);
```
上面代码中，document.getElementById('logo')是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是这个节点对象。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

3. 被遗忘的计时器或回调函数
```js
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        // 处理 node 和 someResource
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```
这样的代码很常见，如果id为Node的元素从DOM中移除，该定时器仍会存在，同时，因为回调函数中包含对someResource的引用，定时器外面的someResource也不会被释放。

**注意：虽然逻辑上没有走到if条件的，但是引擎里面还是会将someResource的引用计数+1**

### 垃圾回收的使用场景优化
1. 数组array优化
将[]赋值给一个数组对象，是清空数组的捷径(例如： arr = []),但是需要注意的是，这种方式又创建了一个新的空对象，并且将原来的数组对象变成了一小片内存垃圾！实际上，将数组长度赋值为0（arr.length = 0）也能达到清空数组的目的，并且同时能实现数组重用，减少内存垃圾的产生。
```js
const arr = [1, 2, 3, 4];
console.log('浪里行舟');
arr.length = 0  // 可以直接让数字清空，而且数组类型不变。
// arr = []; 虽然让a变量成一个空数组,但是在堆上重新申请了一个空数组对象。
```
2. 对象尽量复用
对象尽量复用，尤其是在循环等地方出现创建新对象，能复用就复用。不用的对象，尽可能设置为null，尽快被垃圾回收掉。
```js
var t = {} // 每次循环都会创建一个新对象。
for (var i = 0; i < 10; i++) {
  // var t = {};// 每次循环都会创建一个新对象。
  t.age = 19
  t.name = '123'
  t.index = i
  console.log(t)
}
t = null //对象如果已经不用了，那就立即设置为null；等待垃圾回收。
```

3. 在循环中的函数表达式，能复用最好放到循环外面。
```js
// bad
// 在循环中最好也别使用函数表达式。
for (var k = 0; k < 10; k++) {
  var t = function(a) {
    // 创建了10次  函数对象。
    console.log(a)
  }
  t(k)
}
// good
function t(a) {
  console.log(a)
}
for (var k = 0; k < 10; k++) {
  t(k)
}
t = null
```
### 垃圾回收机制
找出不再使用的变量，然后释放掉其占用的内存，但是这个过程不是时时的，因为其开销比较大，所以垃圾回收器会按照固定的时间间隔周期性的执行。

#### 回收方法

* 标记清除
这是javascript常用的垃圾回收方式。当变量进入执行环境时，就标记这个变量为”进入环境“。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。

垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

```js
var m = 0,n = 19 // 把 m,n,add() 标记为进入环境。
add(m, n) // 把 a, b, c标记为进入环境。
console.log(n) // a,b,c标记为离开环境，等待垃圾回收。
function add(a, b) {
  a++
  var c = a + b
  return c
}
```

* 引用计数
所谓”引用计数“是指语言引擎有一张”引用表“，保存了内存里面的资源（通常是各种值）的引用次数。如果一个值的引用次数是0，就表示这个值不再用到了，因此可以将这块内存释放。

```js
var arr = [1, 2, 3, 4];
arr = [2, 4, 5]
console.log('浪里行舟');
```
上面代码中，数组`[1, 2, 3, 4]`是一个值，会占用内存。变量arr是仅有的对这个值的引用，因此引用次数为1。后续arr又被赋了一个值，则数组`[1,2,3,4]`的引用次数就减1，此时它引用次数变成0，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。

但是引用计数有个最大的问题：循环引用
```js
function func() {
    let obj1 = {};
    let obj2 = {};

    obj1.a = obj2; // obj1 引用 obj2
    obj2.a = obj1; // obj2 引用 obj1
}
```
当函数 func 执行结束后，返回值为 undefined，所以整个函数以及内部的变量都应该被回收，但根据引用计数方法，obj1 和 obj2 的引用次数都不为 0，所以他们不会被回收。

要解决循环引用的问题，最好是在不使用它们的时候手工将它们设为空。上面的例子可以这么做：
```js
obj1 = null;
obj2 = null;
```

