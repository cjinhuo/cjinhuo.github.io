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

## 打开一个页面至少需要4个进程
1. 浏览器进程:主要负责界面显示、用户交互、子进程管理，同时提供存储等功能
2. 网络进程:主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面
的，直至最近才独立出来，成为一个单独的进程
3. GPU进程:其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷
是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘
制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了
GPU 进程
4. 渲染进程:核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，
排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会
为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下
5. 插件进程(如果该页面包含插件的话):主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保
证插件进程崩溃不会对浏览器和页面造成影响

## 说说从输入URL到页面呈现发生了什么？
**在浏览器输入了`https://www.baidu.com`**
::: tip 注意
为什么在浏览器的地址栏里面输入了一个地址后，之前的页面没有立马消失，而是要加载一会儿才会更新页面：触发当前页面的卸载事件和收集需要释放内存，这也占用了一些时间，但大部分时间是构建请求到接受到请求
:::

1. URL请求过程
* 进入页面资源请求过程。此时，浏览器进程会通过进程间通信（IPC：Inter-Process Communication）把URL请求发送至网络进程，网络进程接收到URL请求后，会在这里发起真正的请求流程
* 先检查强缓存，如果命中直接使用，否则进入下一步
* DNS解析：以获取请求域名的服务器 IP 地址（值得注意的是浏览器提供了DNS数据缓存功能。即如果一个域名已经解析过，就会把解析的结果缓存下来，下次处理直接走缓存，不需要走DNS解析）
* 如果是https则先建立SSL（TLS）协议
* IP 地址和服务器建立 TCP （Transmission Control Protocol传输控制协议）连接
* 服务器接收到请求信息后，会根据请求信息生成响应数据（包括响应行、响应头和响应体等信息），发给网络进程。等网络进程接收了响应行和响应头之后，就开始解析响应头的内容
* 不同的响应体会对应做些不同的处理流程，比如 `Content-Type:text/html`，就是开始用渲染进程解析页面。如果是`Content-Type: application/octet-stream`类型，那么浏览器就会变成了一个下载文件。

2. 准备渲染进程
* Chrome 会为每个页面分配一个渲染进程，也就是说，每打开一个新页面就会配套创建一个新的渲染进程。但是，也有一些例外，在某些情况下，浏览器会让多个页面直接运行在同一个渲染进程中
* 构建DOM树：将HTML转成浏览器能理解和使用的结构
* 样式计算：计算出 DOM 节点中每个元素的具体样式。分为三个步骤。
  * 把CSS转换成浏览器能够理解的结构，也就是styleSheets
  * 转换样式表中的属性值，使其标准化，比如2em转成32px，颜色blue转成rgb(0, 0, 255)
  * 计算出DOM树中每个节点的具体样式
* 构建布局树
  * 创建布局树：遍历 DOM 树中的所有可见节点，并把这些节点加到布局中，而不可见的节点会被布局树忽略掉，比如display:none的节点
  * 布局计算

3. 分层：最终生成图层树
* 因为页面中有很多复杂的效果，如一些复杂的 3D 变换、页面滚动，或者使用 z-indexing、做 z 轴排序等，为了更加方便地实现这些效果渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）


4. 图层绘制：渲染引擎实现图层的绘制与之类似，会把一个图层的绘制拆分成很多小的绘制指令，然后再把这些指令按照顺序组成一个待绘制列表


5. 光栅化:它用于执行绘图指令生成像素的颜色值。实际上浏览器不是直接对整个图层进行光栅化，它会将图层分块，然后以块为单位进行光栅化。

6. 合成和显示
* 一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——“DrawQuad”，然后将该命令提交给浏览器进程。
* 浏览器进程里面有一个叫 viz 的组件，用来接收合成线程发过来的 DrawQuad 命令，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。









7. 构建请求
浏览器会构建请求行:浏览器进程检车url，组件协议，构成完整的url

GET / HTTP/1.1
2. 查找强缓存
先检查强缓存，如果命中直接使用，否则进入下一步。
3. DNS解析
数据包是通过IP地址传给对方的，但是我们输入的是域名，所以需要去域名系统(DNS)找到与当前域名对应的IP地址，找到具体的IP地址的这个过程就是DNS解析。

当然，值得注意的是浏览器提供了DNS数据缓存功能。即如果一个域名已经解析过，就会把解析的结果缓存下来，下次处理直接走缓存，不需要走DNS解析。
4. 建立TCP（Transmission Control Protocol传输控制协议）连接
建立TCP连接经历了下面三个阶段：
* 通过`三次握手`建立客户端和服务器之间的连接
* 进行数据传输。这里有个重要的机制，就是接受方接收到数据包后必须要向发生方`确认`，如果发送方没有接到这个`确认`消息，就判定为数据丢失，并重新发送该数据包。当然，发送的过程中还有一个优化策略，就是把`大的数据包拆成一个个小包`，依次传输到接收方，接收方按照这个小包的顺序把它们`组装`成完整数据包
* 断开连接的阶段。数据传输完成，现在要端开连接了，通过`四次握手`来断开连接。
5. 发送HTTP请求
现在TCP连接建立完毕，浏览器可以和服务器开始通信，即开始发送HTTP请求，浏览器发送HTTP请求要携带三样东西：请求行、请求头和请求体
请求行类似下面这样:
```js
// 请求方法:GET，路径:/list HTTP协议版本:1.1
`GET /list HTTP/1.1`
```
**网络响应**
HTTP到达服务器后，服务器进行对应的处理。最终把数据回传给浏览器，就是返回网络响应。

跟请求部分类似，网络响应具有三个部分：响应行、响应头和响应体。

响应行类似下面这样：
```js
// HTTP版本:1.1 状态码:200 状态描述:OK
`HTTP/1.1 200 OK`
```
响应完成之后怎么办？TC连接就断开了吗？

不一定。这时候要判断`Connection`字段，如果请求头或响应中包含`Connection: Keep-Alive`，表示建立了持久连接，这样TCP连接会一直保持，之后请求统一站点的资源会复用这个连接。

否则断开TCP连接, 请求-响应流程结束。

## 渲染进程
 要解决这个问题，我们就需要先了解下什么是同一站点。具体地讲，我们将“同一站点“定义为根域名加上协议。
```js
https://time.geekbang.org
https://www.geekbang.org
https://www.geekbang.org:8080
```
上面三个都是属于同一站点，因为他们的协议都是HTTPS，而且根域名也都是`geekbang.org`

Chrome 的默认策略是，每个标签对应一个渲染进程。但如果从一个页面打开了另一个新页面，而新页面和当前页面属于同一站点的话，那么新页面会复用父页面的渲染进程。官方把这个默认策略叫 process-per-site-instance。

### 算法篇
::: tip  Content-Type:text/html
完成了网络请求和响应，如果响应头中Content-Type的值是text/html，那么接下来就是浏览器的解析和渲染工作了。
:::
首先来介绍解析部分，主要分为以下几个步骤：
* 构建`dom`树
* 样式计算
* 生成布局树(layout tree)

构建dom树

由于浏览器无法直接理解`html字符串`，因此将这一系列的字节流转换为一种有意义并且方便操作的数据结构，这种数据结构就是dom树。dom树本质上一个以`document`为根节点的多叉树。

HTML文法的本质

