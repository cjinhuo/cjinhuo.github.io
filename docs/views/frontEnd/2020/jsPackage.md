---
title: 'JS封装函数'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2020-04-09
# 时间
tags:
- JS
- 封装
---

::: tip 概述
常用的一些JS封装函数、精妙的函数封装
:::

### isInContainer
::: tip
判断当前元素是否在可视区域
:::
```js
/**
 *
 * @param {*} el container里面的元素节点
 * @param {*} container 最外面的div
 */
export const isInContainer = (el, container) => {
  if (isServer || !el || !container) return false;

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  );
};
```

## 防抖&节流
::: tip 防抖
防抖是用来制止某个事件在短时间内被连续触发，比如：用户在输入框输入文字的时候，需要请求后台来联想数据，如果没有加防抖时，用户每输入一个字或者每变换一个字时，都需要请求后端，有点浪费资源，这时可以加入防抖函数，在用户稍微停顿输入的时候再请求后端岂不是更好。
:::
```js
const antiShake = (fn, context, delay, args) => {
    clearTimeout(fn.timeoutID);
  //  在delay秒之内连续触发会刷新setTimeout，从而不能执行到fn
  fn.timeoutID = setTimeout(function () {
    fn.call(context, args);
  }, delay)
}
```
::: tip 节流
节流是让某个事件在执行完后过一段时间才能再次被触发，比如用来限制刷新按钮，当用户疯狂刷新，比如一秒刷新100次，我们就得向后端发送100次的请求，加了节流后端，可以自定义当第一次刷新后过几秒才能再次发起刷新事件。
:::
```js
const throttle = (fn, context, delay, args) => {
  // 判断是否是第一次执行，第一次执行给fn添加属性canRun:true
  if (!fn.hasOwnProperty('canRun')) {
    fn.canRun = true
  }
  if (!fn.canRun) {
    return
  }
  // 第一次直接执行
  fn.call(context, args)
  // 执通过关卡if(!canRun)，等于就拿到了通行证。然后下一步的操作就是立马将关卡关上canRun=false。
  // 这样，其他请求执行滚动事件的方法，就被挡回去了
  fn.canRun = false
  setTimeout(() => {
    // 执行完一次后delay秒后才能再执行一次
    fn.canRun = true
  }, delay)
}
```

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

