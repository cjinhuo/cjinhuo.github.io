---
title: 'node知识点'
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2020-11-18
# 时间
tags:
- node
- nest
---

::: tip 概述
node与nestjs的知识点
:::

<!-- more -->


## 概览

### CPU密集型(CPU-bound)
CPU密集型也叫计算密集型，指的是系统的硬盘、内存性能相对CPU要好很多，此时，系统运作大部分的状况是CPU Loading 100%，CPU要读/写I/O(硬盘/内存)，I/O在很短的时间就可以完成，而CPU还有许多运算要处理，CPU Loading很高。

在多重程序系统中，大部份时间用来做计算、逻辑判断等CPU动作的程序称之CPU bound。例如一个计算圆周率至小数点一千位以下的程序，在执行的过程当中绝大部份时间用在三角函数和开根号的计算，便是属于CPU bound的程序。

CPU bound的程序一般而言CPU占用率相当高。这可能是因为任务本身不太需要访问I/O设备，也可能是因为程序是多线程实现因此屏蔽掉了等待I/O的时间。

### IO密集型(I/O bound)
IO密集型指的是系统的CPU性能相对硬盘、内存要好很多，此时，系统运作，大部分的状况是CPU在等I/O (硬盘/内存) 的读/写操作，此时CPU Loading并不高。

I/O bound的程序一般在达到性能极限时，CPU占用率仍然较低。这可能是因为任务本身需要大量I/O操作，而pipeline做得不是很好，没有充分利用处理器能力。

## 进程
### 守护进程
后台运行的特殊进程，不受任何终端控制的进程

避免出现错误时，程序异常退出，可以开启守护进程，监控程序，若退出exit，立马重启服务程序，防止服务器崩掉

### 开启守护进程的方式
* pm2 pm2 start index.js
* forever forever start index.js
* node child_process cluster fork子进程

### nohup
nohup node XXX.js >/dev/null 2>&1 &

nohup不是严格意义上的守护进程，只是后台启动服务，当前终端停掉之后还是可以在后台运行的，需要kill端口才能终止该服务


### 事件循环
```
 ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

#### 阶段概述
1. 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
2. 待定回调：执行延迟到下一个循环迭代的I/O回调
3. idle，prepare：仅系统内部调用
4. 轮询：检索新的I/O事件；执行与I/O相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和`setImmediate`调度的之外），
其余情况node都将在适当的时候在此阻塞
5. 检测：setImmediate回调函数在这里执行
6. 关闭的回调函数：一些关闭的回调函数，如：socket.on('close',...)

在每次运行的事件循环之间，node.js检查它是否在等待任何异步I/O或计时器，如果没有的话，则完全关闭

#### setImmediate&nextTick
实质上，这两个名称应该交换，因为 process.nextTick() 比 setImmediate() 触发得更快，但这是过去遗留问题，因此不太可能改变

nextTick：在同一个阶段立即执行

setImmediate：在事件循环的接下来的迭代或'tick'上触发

#### 什么时候使用process.nextTick
1. 允许用户处理错误，清理任何不需要的资源，或者在事件循环继续之前重试请求。
2. 有时有让回调在栈展开后，但在事件循环继续之前运行的必要。

```js
const server = net.createServer();
server.on('connection', (conn) => { });

server.listen(8080);
server.on('listening', () => { });
```


## 中间件 - nestjs
中间件是在路由处理程序之前调用的函数。中间件函数可以访问请求和响应对象，以及next()应用程序请求-响应周期中的中间件函数。在接下来的中间件功能通常是由一个名为变量来表示next。

由于nestjs是基于express的，所以中间件用的是直线模型，比如：
```js
app.use(A)
app.use(B)
```
输出结果：
```js
A:before next
A:after next
B:before next
B:after next
```
因为是直线模型的，所以几个中间件中有

### koa的中间件
koa的中间件是洋葱模型的
```js
app.use(A)
app.use(B)
```
输出结果：
```js
A:before next
B:before next
B:after next
A:after next
```
**为什么要有洋葱模型的这个概念？**
看过一个评论，说的是这个世界的事情是异步的，但是单个人的处理能力是同步的，所以人只能单线程的处理后续的事情，我们能做的就是将事情按照优先级从高到底的等级排序排序后，一个一个的去完成。如果我们将精力放在事情的顺序上的话，就会分散我们的精神力，所以如果一些按照一个正常的回调并推入栈中，我们只管处理当前栈的第一个。

由于多个直线模型里面的异步函数执行的顺序可能不是我们意料的那样，所以洋葱模型出来的原因是为了让那些方法更有顺序的进入调用栈中。


## node 如何实现进程间的状态共享，或者数据共享
以下示例表明在公共同一个文件中不同进程是不会共享内存的
```js
var cluster = require('cluster')

var data = 0 //这里定义数据不会被所有进程共享，各个进程有各自的内存区域

if (cluster.isMaster) {
  //主进程
  var numCPUs = require('os').cpus().length
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork()
  }
  data++
  // 这边会打印 1
  console.log('DATA VALUE in MainProcess: %d ', data)
} else {
  //子进程,会被调用numCPUs次
  data++
  // 这边也会打印1 所以说明data不会共享
  console.log('DATA VALUE in ChildProcess %d: %d ' + cluster.worker.id, data)
}
```

所以只能通过process.send
















