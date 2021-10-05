---
title: 'Vue的一些理解'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2019-02-12
# 时间
tags:
- Vue2.6
# 标签
---

::: tip Vue概述
国产好用的MVVM框架（View的状态和行为抽象化），相对于react比较好入门，一些是一些自己的理解和笔记。
:::

## filters
###
获取当前组件的filters`this.$options.filters`，获取全局filters`this.$root.constructor.options.filters`或者`Vue..options.filters`，可以看出来全局filters是放在Vue的原型链上，而不是在根实例上。


## 点击事件
### 鼠标右击事件
```js
@contextmenu.stop.prevent="rightClick($event)"
@contextmenu.prevent = "rightClick($event)"
```
### 双击事件
```
@dblclick="navDblclick(data)"
```
## request
::: tip
封装axios
:::
```js
import axios from 'axios'
import baseUrl from '../services/index'

axios.defaults.withCredentials = true

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  this.$notify.error({
    title: `请求错误 ${response.status}`,
    message: `${errortext}`
  })
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(api, options = {}) {
  const url = api.replace('/api', baseUrl)
  const defaultOptions = {
    credentials: 'include',
  }
  const newOptions = { ...defaultOptions, ...options }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      }
      newOptions.body = JSON.stringify(newOptions.body)
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      }
    }
  }

  return axios(url, newOptions)
    .then(checkStatus)
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text()
      }
      return response.data
    })
    .catch(e => {
      console.error('请求错误', e)
    })
}

```

## pug
### vue cli2
安装命令
`npm install pug pug-loader pug-filters -D`<br/>
在`webpack.base.conf`文件，在`module`的`rule`对象添加以下代码:
```js
  {
    test: /\.pug$/,
    loader: 'pug'
  }
```
### vue cli3
`npm i -D pug pug-html-loader pug-plain-loader`<br/>
和cli2比多了一个pug-plain-loader<br/>
在`vue.config.js`添加代码：
```js
module.exports = {
    chainWebpack: config => {
        config.module.rule('pug')
            .test(/\.pug$/)
            .use('pug-html-loader')
            .loader('pug-html-loader')
            .end()
    }
}
```
## .eslintrc
```js
rules: {
    // 强制 “for” 循环中更新子句的计数器朝着正确的方向移动
    'for-direction': 'warn',
    // 强制 getter 函数中出现 return 语句
    'getter-return': 'error',
    // 禁止空块语句
    'no-empty': 'error',
    // 关闭强制 generator 函数中 * 号周围使用一致的空格
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ["error", 2],
    // 禁止使用 空格 和 tab 混合缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 一些风格指南不允许使用 tab 字符，包括在注释内
    'no-tabs': 'off',
    // 禁止使用分号
    'semi': ['error', 'never'],
    // ["error", "never"]不允许函数括号之间存在空格
    "space-before-function-paren": ["error", "never"]
  }
```

## pingyin
::: tip
讲文字转化为拼音
npm install pinyin
:::

```js
    userPinyin() {
      let name = this.userName

      if (!name) {
        return '系统根据用户姓名给出'
      }

      let toPinyin = this.$pinyin(name, {
        style: this.$pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: false
      })
      if (toPinyin.length === 1) {
        return toPinyin.join()
      }

      return toPinyin.reduce((previousValue, value) => {
        return previousValue + value
      })
    }
```
## slot
::: tip slot
slot是父组件与子组件的通讯方式，可以将父组件的内容显示在子组件当中。
:::
普通slot的用法，只有一个slot。<br>
新建slot.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.js"></script>
  <title>Document</title>
</head>
<body>
  <div id="app">
    <say-to p-name="豆豆">你是睿智吧</say-to>
    <say-to p-name="水水">你也是睿智</say-to>
    <say-to p-name="大大">你管管他们两</say-to>
  </div>
  <script src="./testSlot.js"></script>
</body>
</html>
```
新建slot.js
```js
const SayTo = {
  props: {
    pName: String
  },
  template: `
    <div>
      你好<strong>{{ pName }}</strong>
      <slot></slot>
    </div>
  `
}

let app = new Vue({
  el: '#app',
  components: {
    SayTo
  }
})
```
组合slot的用法，多个slot的组合，也叫具名slot。<br>
新建combinedSlot.index
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.js"></script>
  <title>Document</title>
</head>
<body>
  <div id="app">
    <nba-all-start c="奥尼尔" pf="加内特">
      <span slot="sf">皮尔斯</span>
      <span slot="sg">雷阿伦</span>
      <span slot="pg">隆多</span>
    </nba-all-start>
  </div>
  <script src="./combinedSlot.js"></script>
</body>
</html>
```
新建combinedSlot.js
```js
const NbaAllStart = {
  props: {
    c: String,
    pf: String
  },
  template: `
    <div>
      <div>中锋： {{ c }}</div>
      <div>大前： {{ pf }}</div>
      <div>小前： <slot name="sf"></slot></div>
      <div>大前： <slot name="sg"></slot></div>
      <div>大前： <slot name="pg"></slot></div>
      <slot></slot>
    </div>
  `
}
let app = new Vue({
  el: '#app',
  components: {
    NbaAllStart
  }
})
```
### Vue2.6废除前两个slot用法，新增的用法
新建newSlot.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.js"></script>
  <title>newSlot</title>
</head>
<body>
  <div id="app">
    <test-new-slot></test-new-slot>
  </div>
  <script src="./combinedSlot.js"></script>
</body>
</html>
```
新建newSlot.js
```js
const NbaAllStart = {
  props: {
    c: String,
    pf: String
  },
  data(){
    return {
      test: {
        one: 1,
        two: 2
      }
    }
  },
  template: `
  <div class="container">
  <header>
    <slot name="header" v-bind:test="test"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
  `
}
const TestNewSlot = {
  components: {
    NbaAllStart
  },
  data(){
    return {
      test1: {
        one: 11,
        two: 22
      }
    }
  },
  template: `
  <nba-all-start>
  <template v-slot:header="test">
    <h1>Here might be a page title{{ test.test.one }}</h1>
  </template>
  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</nba-all-start>
  `
}

let app = new Vue({
  el: '#app',
  components: {
    TestNewSlot
  }
})

```
## router
::: tip
Vue router的用处就是在单页应用中通过router与component的交互，演变成类似多页面，但是路由变化时并没有重新刷新页面和请求后端资源，只是页面div的替换，因此页面切换速度非常快。
:::
### 嵌套路由
新建index.html文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
  <title>Document</title>
</head>
<body>
  <div id="app">
    <router-view></router-view>
  </div>
  <script src="./testRouter.js"></script>
</body>
</html>
```
新建index.js
```js
const index = {
  template: `
    <div>
    <h1>this is index</h1>
    <router-link to='/foo'>go to foo</router-link>
    <router-link to='/bar'>go to bar</router-link>
    <router-view></router-view>
    </div>
  `
}
const foo = {
  template: `
    <div>
    <h1>this is foo</h1>
    </div>
  `
}
const bar = {
  template: `
    <div>
    <h1>this is bar</h1>
    <router-link to='/bar/barchild'>go to barchild</router-link>
    <router-view></router-view>
    </div>
  `
}
const barchild = {
  template: `
    <div>
      <h1>this is barchild</h1>
      <router-link to='/bar/barchild/one'>go to one</router-link>
      <router-link to='/bar/barchild/two'>go to two</router-link>
      <router-view></router-view>
    </div>
  `
}
const barchildOne = {
  template: `
  <div>
    <h1>this is barchildOne</h1>
  </div>
`
}
const barchildTwo = {
  template: `
  <div>
    <h1>this is barchildTwo</h1>
  </div>
`
}
const routes = [{
  path: '/',
  name: 'index',
  component: index,
  children: [{
      path: '/foo',
      name: 'foo',
      component: foo
    },
    {
      path: '/foo',
      name: 'foo',
      component: foo
    },
    {
      path: '/bar',
      name: 'bar',
      component: bar,
      children: [{
        path: '/bar/barchild',
        name: 'barchild',
        component: barchild,
        children: [{
            path: '/bar/barchild/one',
            name: 'one',
            component: barchildOne
          },
          {
            path: '/bar/barchild/two',
            name: 'two',
            component: barchildTwo
          }
        ]
      }]
    }
  ]
}]
const router = new VueRouter({
  routes
})
let app = new Vue({
  el: '#app',
  router
})
```
上面代码讲的是路由嵌套的使用，也是基本项目最常用到的结构。
## 工作中一些可以直接套的样式与组件
::: tip element
用之前先全局改字体为12px，因为系统大部分都是12px
:::
### el-select
```html
        <div class="cjh-input-select">
          <div class="cjh-input-box-label">项目</div>
          <el-select v-model="manager" @change="filterChange">
            <!-- <el-option v-for="item in managerList" :key="item.key" :value="item.loginName" :label="item.userName"></el-option> -->
          </el-select>
        </div>
```
```css
  .cjh-input-select {
    display: flex;
    justify-content: flex-start;
    margin-right: 12px;
    align-content: center;
    .cjh-input-box-label {
      line-height: 28px;
      margin-right: 5px;
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input__suffix {
      top: 4px;
    }
  }
```
## clipBoard

```js
// codes 就是复制的内容
<button id="copy-code" :data-clipboard-text="codes" @click="click"></button>
  click()
  {
let clipBoard = new Clipboard('#copy-code')
      clipBoard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        clipBoard.destroy()
      })
      clipBoard.on('error', e => {
        this.$message({
          message: '复制失败',
          type: 'error'
        })
        clipBoard.destroy()
      })
  }

```

## 取出全局filter
::: tip
vue是挂在到Vue的跟根实例上，也就是`Vue.options.filters`，如果子组件想获取的话需要用`this.$root.constructor.options.filters`来获取
:::

## minxin vue
::: tip
值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件`自己`对象的键值对。
:::
```js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```
## vue router地址栏传参
```js
// 用来传参
this.$router.push({ name: 'page', query: { type: -1, name: 'rootRadar' } })
// 用来接收参数
this.$route.query.type
```
::: tip 注意事项
可以传对象，但是地址栏会出现一些乱码，目标页也可以接收的到对象，但是目标页刷新下就会失去这个对象因为地址栏不支持保存对象，所以传过去的时候用JSON.stringify转成字符串，接收的时候再转成对象。
:::

## extends vue
类似mixin，允许声明扩展另一个组件(可以是一个简单的选项对象或构造函数)

## 父组件与子组件的钩子函数执行顺序：
父beforeCreated->父created->父beforeMount->子created->子beforeMount->子mounted->父mounted
### 子组件更新过程
父beforeUpdate->子beforeUpdate->子updated->父updated
### 父组件更新过程
父beforeUpdate->父updated
### 销毁过程
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

## 什么时候用到Vuex
如果数据传到后台，不同的组件使用的话，都可以从后台拿到数据，只是网络请求开销比较大，父子组件通信的话，可以直接emit,而多层嵌套组件通信就需要有vuex这样的解决方案，公共数据托管在state里，不同的组件都可以拿到这个数据。





