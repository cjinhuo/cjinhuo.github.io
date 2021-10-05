---
title: 'DefineProperty和Proxy的响应式'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2019-10-31
# 时间
tags:
- Vue2.6
- 响应式数据
---

::: tip 概览
本文是基于`DefineProperty`和`Proxy`写了两个简单的例子来讲解Vue2.6和Vue-next的数据响应式。
:::

## 从简单开始
比如一个单价和数量`let price = 5, quantity = 2`，算一个总数`total`，最简单的代码:
```js
    let price = 5
    let quantity = 2
    let total = price * quantity
    price = 20
    console.log(`total is ${total}`) // total is 10
```
结果显然是10，但是我们在最后执行的`price = 20`所以我们想要的效果是40

### 抛出问题
首先我们需要一些方法来保存这个算出总值的过程，当`price`或`quantity`更新时调用这个方法。

我们可以通过创建一个函数来存储这个过程：
```js
// 当price或quantity变化时运行这个函数
const target = function () {
  total = price * quantity
})
```

我们还需要一个栈来保存当数据变换时，需要运行的函数，也就是用来保存target，但是这个例子的`target`只有一个，不过还可以举个例子：当我们如果需要加个需求的结果是`num = price * quantity * 10`，这就出现了另一个`target`，所有storage就是为了保存所有当`price`或`quantity`更新时需要调用的函数。
```js
// 所有的target都放入这个栈中
    let storage = []
    function record () {
      storage.push(target)
    }
```
我们还需要一个函数来执行`storage`包含的所有`target`，
```js
    function notify (){
      storage.forEach(run => run())
    }
```
好了，下面是完整的代码：
```js
    let price = 5
    let quantity = 2
    let total = 0
    let target = null
    let storage = []

    function record () {
      // 这边是一个target，但是正常来说都是多个target
      storage.push(target)
    }

    function notify () {
      storage.forEach(run => run())
    }

    target = () => { total = price * quantity }

    record()
    target()

    price = 20
    console.log(total) // => 10
    notify()
    console.log(total) // => 40
```

### 优化
看起来貌似比一开始的好一点，但是还可以通过封装类来优化上面的代码，也就是将notify、record、封装成一个可以复用的类。
```js
class Dep {
  constructor(){
    this.subs = []
  }
  // 实现了上面例子的storage的功能
  depend() {
    if (target && !this.subs.includes(target)) {
      this.subs.push(target)
    }
  }
  // 实现了例子的notify功能
  notify() {
    this.subs.forEach(run => run())
  }
}
```
好了，现在利用这个类来实现上面的功能：
```js
class Dep {
  constructor(){
    this.subs = []
  }
  // 实现了上面例子的storage的功能
  depend() {
    if (target && !this.subs.includes(target)) {
      this.subs.push(target)
    }
  }
  // 实现了例子的notify功能
  notify() {
    this.subs.forEach(run => run())
  }
}

let price = 5
let quantity = 2
let total = 0
let target = null
const dep = new Dep()

target = () => { total = price * quantity }
// 记录target
dep.depend()
target()
console.log(`total:${total}`) // => 10
price = 20
console.log(`total:${total}`) // => 10
// 通知target更新
dep.notify()
console.log(`total:${total}`) // => 40
quantity = 20
dep.notify()
console.log(`total:${total}`) // => 400
```
可以看出，现在不管是`price`或`quantity`变换，只要运行一下`dep.notify()`就可以出发更新。
### 再次抛出问题
就上面讲过的一个问题，变量`price`或`quantity`可能对应多个target，比如多一个`num = price * quantity * 10`，上面的代码就需要在打印前多加三行：
```js
target = () => { num = price * quantity * 10 }
// 记录target
dep.depend()
target()
```
所以我们需要一个函数更便捷的保存`target`到`dep.depend`的函数：
```js
function watcher(myFunc) {
      target = myFunc // 设置为当前的target
      dep.depend()       // 添加当前target到dep订阅的栈中
      target()           // 调用这个方法，来初始化被响应式的值（total或num）的值
      target = null      // 完成订阅和执行后，置为null
    }
```
上面的例子的部分代码将变成：
```js
// 记录target
dep.depend()
target()
// =》 变成
watcher(target)
```
当然，执行的效果是一样的。
### Object.defineProperty让数据可响应式
上面例子的缺陷是每次`price`或`quantity`被赋值后需要手动调用`dep.notify`，这里就需要[Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。
```js
let data = { price: 5, quantity: 2 }

Object.defineProperty(data, 'price', {

  get() {  // Create a get method
    console.log(`I was accessed`)
    return 'price'
  },

  set(newVal) {  // Create a set method
    console.log(`I was changed`)
  }
})
data.price // => I was accessed
data.price = 20  // => I was changed
```
可以看到，当你调用data.price时`get()`会执行并且期望返回一个值，调用data.price = 20时`set()`会执行，并且有个参数newVal被传入，也就是你设置的20，所以需要有个临时的变量`internalValue`来保存`newVal`。
```js
let data = { price: 5, quantity: 2 }

let internalValue = data.price

Object.defineProperty(data, 'price', {

  get() {  // Create a get method
    console.log(`Getting price: ${internalValue}`)
    return internalValue
  },

  set(newVal) {  // Create a set method
    console.log(`Setting price to: ${newVal}`)
    internalValue = newVal
  }
})
data.price = 20 // price = 20
```
但是上面只设置了`price`，我们还需要设置`quantity`，所以通过`Object.keys`来遍历`data`并且设置，完整代码如下：
```js
let data = { price: 5, quantity: 2 }

Object.keys(data).forEach(key => {
  let internalValue = data[key]
  Object.defineProperty(data, key, {
    get() {
      console.log(`Getting ${key}: ${internalValue}`)
      return internalValue
    },
    set(newVal) {
      console.log(`Setting ${key} to: ${newVal}`)
      internalValue = newVal
    }
  })
})
data.price = 20 // => Setting price to: 20
data.quantity = 20 // => Setting quantity to: 20
console.log(data.price, data.quantity) // => 20 20
```
好了，现在`defineProperty`已经可以捕捉到变量被赋值时的动作，将上面的`Dep`类和`defineProperty`结合起来：
先屡一下思路：
1. defineProperty get: 触发时需要调用dep.depeng()来订阅当前的值所涉及到的所有`target`，当前例子就一个`target`
2. defineProperty set: 触发时需要调用dep.notify()来执行订阅中的所有`target`
完整代码如下：
```js
let data = { price: 5, quantity: 2  };
// 全局变量 target
let target = null;

// Dep class
class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
      // target不为空且不能重复添加
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify() {
    // 执行当前数据中所有订阅的target
    this.subscribers.forEach(sub => sub());
  }
}

// 遍历data的每个属性并添加get、set方法
Object.keys(data).forEach(key => {
  let internalValue = data[key];
  // 每个数据都新建一个dep类
  const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      // 当前dep类订阅target
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      internalValue = newVal;
      // 通知target更新
      dep.notify();
    }
  });
});

function watcher(myFunc) {
  target = myFunc;
  target(); // => total: 10
  target = null;
}

watcher(() => {
  data.total = data.price * data.quantity;
  console.log('total:', data.total)
});

data.price = 20 // => total: 40
data.quantity = 100 // => total: 2000
```

### 总结
在Vue2.6中，实现响应式数据类似上面的例子，总体架构是差不多的，但是考虑数据的多层和数组时，Vue做了更多的处理，说到数组，由于`Object.defineProperty`是需要传入`key`，所以监听不了数组的变换，Vue2.6是通过劫持原型链上面的这些方法:
```js
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
```
来手动更新页面数据。所以下面讲的是`Proxy`，纯天然的劫持数据的方法。
## Proxy
::: tip Proxy
与`Object.defineProperty`不同的是他只需要传入对象名，不用传`key`，再配合[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)使用，简直不要太爽。
:::
```js
let data = [1]
let _data = data
data = new Proxy(_data, {
  get(obj, key) {
    console.log(`get obj:${obj}, key: ${key}`)
    return Reflect.get(obj, key)
  },
  set(obj, key, newVal) {
    // 如果值插入成功返回true
    const result = Reflect.set(obj, key, newVal)
    if (result) {
      console.log(`set obj:${obj}, key: ${key},newVal:${newVal}`)
      return true
    }
    return false;
  }
})
data[1] = 2 // 直接在下标为1的数字上面改
// set obj:1,2, key: 1,newVal:2
data.push(10) // push操作
// get obj:1,2, key: push => 取得Array.prototype.push方法
// get obj: 1, 2, key: length => 然后取得array的length属性
// set obj: 1, 2, 10, key: 2, newVal: 10 => 再设置data[length] = 10
// set obj: 1, 2, 10, key: length, newVal: 3 => 再执行length++
```
可以看到，数组做的任何操作都显示出来，连push的过程都打印出来，这就是Vue-next用`Proxy`代替`defineProperty`的原因。
### 复用Dep类
用`Proxy`结合上面的Dep类出一个例子，实时算出数组中的所有数的和
```js

let data = [1]
// 全局变量 target
let target = null;
let sum = 0
// Dep class
class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
    // 当target不为空，且不能重复添加
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify() {
    // 通知对应的
    this.subscribers.forEach(sub => sub());
  }
}

// 为array实例一个Dep依赖
let arrayDep = new Dep()
let _data = data

data = new Proxy(_data ,{
  get(obj, key) {
    arrayDep.depend()
    return Reflect.get(obj, key)
  },
  set(obj, key, newVal, receiver) {
    // 如果值插入成功返回true
    const result = Reflect.set(obj, key, newVal)
    if (result) {
      if (key !== 'length') {
        arrayDep.notify()
      }
      return true
    }
    return false;
  }
})

function watcher(myFunc) {
  target = myFunc;
  target(); // => sum: 1
  target = null;
}
watcher(() => {
  sum = data.reduce((a, b) => a + b);
  console.log('sum:', sum)
});

data[0] = 10 // =>sum: 10
data.push(2) // =>sum: 12
```
Vue2.6的源码[点击链接](./Vue2.6-reactive-analysis.md)
