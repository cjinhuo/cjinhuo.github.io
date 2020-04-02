---
title: 'Vuex源码分析'
categories: frontEnd
date: 2019-12-17
# 时间
tags:
- Vue
- Vuex3.1.2
- 源码解读
---


::: tip 带着问题看源码
1. 为什么每个Vue组件都可以访问到`this.$store`，到底是怎么操作的？
:::

## Vuex intall
```js
function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}
```

## Vuex applyMixin
::: tip
我们在使用vuex的时候会在root组件放入store:
```js
new Vue({
  store
})
```
这样root组件就有了store属性，然后通过下面得代码：一级一级的传入到组件
:::
```js
function applyMixin(Vue) {
  var version = Number(Vue.version.split('.')[0]);
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  }
  function vuexInit() {
    var options = this.$options;
    // store 注入
    if (options.store) {
      // 判断是否含有store，有的话转换成$store，只在root组件触发
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      // 判断父组件是否含有$store，有的话将父组件的store赋值给当前组件，以此来赋值给所有组件
      this.$store = options.parent.$store;
    }
  }
}
```
超链接 [文本](URL)
<!-- ../../../.vuepress/public/line-height.png) -->
图片 ![](url)

