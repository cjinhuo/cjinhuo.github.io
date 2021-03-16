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
nodo与nestjs的知识点
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
