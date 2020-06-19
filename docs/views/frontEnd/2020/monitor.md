---
title: '手撸前端监控SDK'
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2020-06-19
tags:
- 前端
- TS
- 监控SDK
---

::: tip
前端监控SDK主要作用用来获取用户操作页面时出现错误的bug并上传到服务端，服务端拿到这些数据就可以做一些数据可视化、线上错误提醒、还原用户操作场景
:::

<!-- more -->
## 思路
比如我们想要获取页面接口报错的信息，可以重写`XMLHttpRequest`的原生事件，从中截取当前错误接口的信息，以此类推，window.onerror、fetch等等事件
## 选取工具
我这次选取得技术栈是TS+rollup，为什么要用ts而不用js，一方面是为了学习一下ts，另一方面是为了更好迭代。打包工具选了rollup而不是webpack，毫无疑问rollup能做的事webpack都能做，但是目前我只想用TS和热更新，rollup的配置更加轻便，所以就用了rollup
## 流程
### 需要重写的事件
1. xhr
2. fetch
3. error（不重写windo.onerror，而是监听window的error事件）
4. console
5. history
6. unhandlerejection
7. dom（监听document的click事件、重写addEventListener事件）

### 封装重写函数
既然上面需要重写这么多事件，那就封装一个可以复用的函数来重写这些事件。

1. nativeTryCatch
```js
/**
 * 原生try函数
 * @param fn try中执行的函数体
 * @param errorFn 报错时执行的函数体，将err传入
 */
export function nativeTryCatch(fn: Function, errorFn?: Function): void {
  try {
    fn()
  } catch (err) {
    console.log('err', err)
    if (errorFn) {
      errorFn(err)
    }
  }
}
```
2. replaceOld
```js
/**
 *
 * 重写对象上面的某个属性
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @returns void
 */
export function replaceOld(
  source: {
    [key: string]: any
  },
  name: string,
  replacement: (...args: any[]) => any
): void {
  if (!(name in source)) return
  const original = source[name]
  const wrapped = replacement(original)
  if (typeof wrapped === 'function') {
    nativeTryCatch(() => {
      if (!original.__MITO__) {
        wrapped.prototype = wrapped.prototype || {}
        Object.defineProperty(wrapped, '__MITO__', {
          value: original
        })
      }
    })
    source[name] = wrapped
  }
}
```


超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

