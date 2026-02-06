---
title: "Vue2.6响应式分析"
description: "深入分析 Vue2.6 响应式原理，包括 defineReactive、Dep、Watcher 等核心概念"
pubDate: '2019-11-01'
tags: ['源码解读', 'Vue', '前端']
---

:::tip
1. message为data中定义的对象，vm._data.message和vm.message有什么区别？
2. 为什么Vue中不能通过索引来修改数组以更新视图？为什么有时候莫名其妙就可以触发视图更新？
3. 为什么只能通过官网指定的几个方法(push、splice...)才能出发数组数据更新？
4. 为什么通过this.$set就可以触发数组下标更新导致更新视图？
5. computed和watch的区别有哪些，computed的缓存是怎么做到的？
6. 社区经常提到的watcher和dep到底为响应式数据提供了怎么样的逻辑？
:::

<!-- more -->


需要解答上面一系列问题，需要从Vue的_init开始走起。下面得是Vue2.6的源码照搬过来的，基本上每一行都会有注释，但是有一些通过命名就看出来的就没有注释了，可能源码较多，所以我画了流程图，推荐是拿着Vue提供的开发版源码[Vue开发版源码地址](https://cdn.jsdelivr.net/npm/vue/dist/vue.js)，然后在new Vue()断点，慢慢的走一遍，然后再回来看这边文章，可能会解答更多的困惑。
## _init
:::tip
初始化函数，option就是你定义的data、methods、created等等Vue提供的一些属性。
:::
```javascript
Vue.prototype._init = function (options) {
  var vm = this;
  // 做个标记，避免后面被Observer()实例化，因为组件不用观察，需要观察的是数据
  vm._isVue = true;
  {
    initProxy(vm);
  }
  // expose real self
  vm._self = vm;
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  // beforeCreate 函数调用
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  // created 函数调用
  callHook(vm, 'created');
  // 查询是否有节点，并挂载到当前节点
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```
先走<a style="color:rgb(122, 214, 253);" href="#initproxy">initProxy</a>
## initProxy
:::tip
首先判断Proxy(<a style="color:rgb(122, 214, 253);" href="#proxy的traps">了解Proxy</a>)是否可用，如果可用就定义`has`或`get`traps放入Proxy，返回给vm._renderProxy。改方法只在开发环境下才会运行，主要是为了检查当前编写的Vue组件是否有错误，如果有就会在控制台报错。
:::
```javascript
    var initProxy = function initProxy (vm) {
      // hasProxy => typeof Proxy !== 'undefined' && isNative(Proxy);
      if (hasProxy) {
        // 决定使用哪个代理handler
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }
```
判断当前环境Proxy是否可用。如果可用就是执行:
```js
vm._renderProxy = new Proxy(vm, handlers);
```
然后看这个`handlers`是啥。

```js
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
```
上面的`render._withStripped`搜了一下是内部标志，用来正确选择proxy，大部分情况都是undefined，所有`handles`基本都是`hasHandler`
:::tip[render._withStripped github issues]
This is an internal flag that allows Vue's runtime to pick the correct Proxy strategy to detect variable reference errors during render, depending on whether with has been stripped by vue-template-es2015-compiler.
:::
## getHandler && hasHandler
:::tip
这两种方法主要是为了当用户错误操作vm的属性提示报错。比如调用for in循环遍历vm实例属性时，会触发hasHandler方法，调用vm._data就会触发gethandler方法。
:::
看上面两个对象前先看一个工具函数:
```js
    // allowedGlobals是一个映射表，映射下面列出的类型，
    // allowedGlobals('Infinity') => true
    // allowedGlobals('test') => false
var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );
    // 生成一个map对象和返回一个函数来检查是否含有某个键
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }
```
```js
// 这个对象包含一个方法has，用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
    var hasHandler = {
      has: function has (target, key) {
        var has = key in target;
        // allowedGlobals('Infinity') => true
        // 当访问的属性是一些js默认定义（allowedGlobals）的类型之一
        // 或者不是string类型且key不是_开头的且属性不在target.$data上返回true
        var isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
          // 如果属性不在target上且没有通过isAllowed判断，就抛出错误提示
        if (!has && !isAllowed) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed
      }
    };
// 针对读取代理对象的某个属性时进行的操作
// 当访问的属性不是string类型或者属性值在被代理的对象不存在，则抛出错误提示，否则就返回该属性值
    var getHandler = {
      get: function get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return target[key]
      }
    };
```
## proxy的traps
:::tip
proxy所有的traps是可选的。如果某个trap没有定义，那么默认的行为会应用到目标对象上
:::
上面当两个handles处理好后，将要执行`vm._renderProxy = new Proxy(vm, handlers);`，getHandle对应的是get方法，hasHandler对应的是has方法。
* handler.has()<br>
在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。
* handler.get()<br>
在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。
## initProxy的流程
![](./vue2-init-proxy.jpg)
## initState
自己理解initState后面的一些流程，省略了其他的模块：
![](./vue2-initState.png)
```js
  function initState (vm) {
    // 定义vm的watchers，便于在new Watcher时收集已经实例化的watcher
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
    // 继续走initData
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }
```
## initData
:::tip
 初始化data对象，这里面包括定义响应式数据，重点是会新建vm._data属性里面，然后里面放入的是你预定的属性，再将_data的所有属性代理到vm上面，将`vm[key]`代理到`_data[key]`
 下面的流程推荐在源码中断点走一遍，不理解的再回来看看注释。
:::
```js
  function initData (vm) {
    var data = vm.$options.data;
    // 不管是函数还是对象，最终返回的都是纯对象，如果不是纯对象就抛出warn，因为我们只需要data里面预定的属性
    // 并且赋值给vm._data
    data = vm._data = typeof data === 'function'
      ? getData(data, vm) : data || {};
      // getData(data, vm) =>  return data.call(vm, vm)
    if (!isPlainObject(data)) {
      data = {};
      warn();
    }
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        // 判断data的key有没有在prop或methods已经定义过
        if (methods && hasOwn(methods, key)) {
          warn();
        }
      }
      if (props && hasOwn(props, key)) {
        warn();
      } else if (!isReserved(key)) { // isReserved判断字符串是否是$开头,
        // 将vm[key]代理到_data[key]
        // 取vm[key]的值就是取_data[key]的值
        // vm.message  => vm._data.message
        proxy(vm, "_data", key);
      }
    }
    // observe data 观察data
    observe(data, true /* asRootData */);
  }
```
`proxy(vm, "_data", key);`这里的实现很巧妙，点击<a style="color:rgb(122, 214, 253);" href="#proxy">proxy函数</a>跳到函数实现。

`observe(data, true /* asRootData */);`是观察data里面的所有属性，也是开始定义响应式数据的入口点了。点击<a style="color:rgb(122, 214, 253);" href="#observe（判断是否需要观察）">observer</a>函数实现
## initComputed
:::tip[initComputed流程]
```js
computed:{
  result() {
    return this.message + 'computed'
  }
}
```
假设computed是上面的数据，首先创建不带任何的原型链的空对象赋值到当前vm上`var watchers = vm._computedWatchers = Object.create(null);`，然后遍历computed，跟watch一样，computed也可以是多种写法，经过一系列判断，最终导出set（如果没有就为noop），get函数，然后实例化Watcher，和watch不同的是，是实例化Watcher的时候最后一个参数变成`{ lazy: true }`，这个是缓存的标志，在实例化watcher的过程中并不会执行到`watcher.get`，但是在后续会给当前计算属性`result`设置getter方法，在页面获取值时就会触发getter方法，判断`watcher.dirty`是否是true，如果是的话就执行`watcher.evaluate()`，在`evaluate()`中重新获取`watcher.get()`。可以知道计算属性是通过`watcher.dirty`来判断是否需要重新获取值，在`this.message`更改值时会触发notify，然后执行对应的`watcher.update`，在`update`中`watcher.dirty`变成true。
:::
```js
  function initComputed(vm, computed) {
    // 创建不带任何的原型链的空对象并且挂载到当前组件的实例上
    var watchers = vm._computedWatchers = Object.create(null);
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // 针对option.computed中的每个key进行Watcher
        // watcher 用来存储计算值，判断是否需要重新计算
        watchers[key] = new Watcher(
          vm,
          getter || noop, // 用watcher保存getter函数
          noop,
          computedWatcherOptions
          // computedWatcherOptions = { lazy: true };作用是初始化watcher的第一次不执行this.get()，也就是不会获取当前值，只在用到的时候获取
        );
      }
      // 如果key不在vm属性在指定的对象或其原型链中，就执行defineComputed
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }
```
### defineComputed
```js
  function defineComputed(
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      // 当计算属性是对象时，判断用户有没有设置set，有的话将用户的set赋值
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```
### computed流程图
![](./vue2-init-computed.png)

### createComputedGetter
```js
  function createComputedGetter(key) {
    return function computedGetter() {
      // _computedWatchers在Vue
      // this指的是vm，即当前组件实例
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        // 缓存控制
        if (watcher.dirty) {
          // 调用evaluate后dirty会变成false
          watcher.evaluate();
          // dep.notify => update() => this.dirty=true
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }
```
### createGetterInvoker
```js
  function createGetterInvoker(fn) {
    return function computedGetter() {
      return fn.call(this, this)
    }
  }
```


## initWatch
:::tip[initWatch流程]
```js
watch:{
  message(newVal, oldVal){
    console.log(newVal, oldVal)
  }
}
```
假设`watch`是上面的数据，遍历`key`，由于`watch`可以多种写法，字符串、函数、对象、数组形式，最终导出回调函数，并取到表达式`message`，然后实例化一个`Watcher`，在实例化的过程成中会调用`this.get()`，然后就执行`message`的`getter`，就执行`dep.depend`，依赖就被存储了，然后判断`immediate`是否为`true`，是的话直接执行回调函数。
:::
```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    // 判断是否是数组，是的话就遍历，可以写成
    // watch: {
    //   message: {
    //     [{
    //       handle: 'init'
    //     },
    //     {
    //       handle: 'init'
    //     }]
    //   }
    // }
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

### createWatcher
```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // 说明handle可以传字符串 handle: 'init'，init是method中的一函数
  if (typeof handler === 'string') {
    // 从当前组件中获取属性
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```
### vm.$watch
```js
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      // 如果handle是对象的话就再次执行createWatcher,看下面代码有三层handler，
      // 其实再多几层也可以，这边会递归handle，所以最终传入到$watch的时候，cb肯定不是个对象了
      // watch:{
      //   message:{
      //     handler: {
      //       handler: {
      //         handler: 'init'
      //         immediate: true
      //         },
      //       },
      //     },
      //   },
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 在dep为message的对象中添加订阅，dep.subs添加该watcher
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```
![](./vue2-init-watch.png)
## observe（判断是否需要观察）
:::tip
尝试为value创建一个观察者实例，如果成功就返回新Observer的实例或返回当前已存在Observer
:::
```js
function observe(value, asRootData) {
  // 判断是否是对象 || 这个对象是否是 VNode
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  // 如果这个对象有__ob__属性 && __ob__属性是Observer的实例，就将__ob__赋值给ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    // 如果应该观察 && 不是服务端渲染 && （这个值是个数组 || 这个值是个纯对象）&& 对象是可以扩展的 && value._isVue的值是false(只有根vm._isVue = true)
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}
```
如果符合上面一系列条件后会跳到Observe进行实例化,点击<a style="color:rgb(122, 214, 253);" href="#observer（观察属性，并替换数组的-proto-）">Observer</a>跳到函数实现。
## defineReactive$$1
:::tip
传入对象和属性名，来设置`defineProperty`的`setter`、`getter`，每次定义前都会new Dep来定义当前数据的Dep，用来保存该数据对应更新user watcher、computed、渲染watcher。
:::
```js
// 声明一个响应式对象
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    // 实例化一个dep
    var dep = new Dep();
    // // 获取对应属性的描述符
    // getOwnPropertyDescriptor
    // {
    //   configurable: Boolean
    //   enumerable: Boolean
    //   value: ''
    //   writable: Boolean
    // }
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }
    // 获取预设定的getter、setter
    var getter = property && property.get;
    var setter = property && property.set;
    // 如果传入参数只有两个，说明没有传val，就调用obj[key]
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }
    // shallow表示浅的意思，只在定义 $attrs和$listeners是true，其他都默认为false，便会递归观察对象
    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        // 判断是否有getter，有getter优先调用，在data中定义的是没有getter的
        var value = getter ? getter.call(obj) : val;
        // 在Watcher.get中会触发pushTarget(this);然后将当前的watcher推入全局栈targetStack中，并且将静态变量Dep.target赋值为当前的watcher
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        // 如果旧值和新值全等直接return
        // (newVal !== newVal && value !== value)用来判断 是否是NaN，如果是NaN直接return
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        // 如果有自定义setter就执行setter
        if (customSetter) {
          customSetter();
        }
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        // 如果shallow为undefined或false就把新值扔进observer判断是否需要观察
        childOb = !shallow && observe(newVal);
        // 通知当前dep依赖的watcher更新
        dep.notify();
      }
    });
  }
```
**上面在data里面每个对象挂载了setter、getter方法，但是在之前的proxy也有挂载getter、setter方法，会不会被覆盖呢？**

答案是不会，因为`Object.defineProperty(obj, key)`中虽然key相同，但是obj是不同的，所以两次挂载是不重复，第一次在proxy中设置getter、setter是为了新建一个内存空间来放入getter、setter的值用的，这边是为了截取用户调用data中属性而设置的getter、setter。
![](./Vue2-defineReactive-getter&setter.png)
* 如果你是按照流程走，现在已经走完`initData()`了，返回<a style="color:rgb(122, 214, 253);" href="#initstate">initState</a>继续走<a style="color:rgb(122, 214, 253);" href="#initcomputed">initComputed</a>

* 如果你是从`this.getter.call`跳过来的话，执行的是`getter`函数，里面先判断Dep.targt是否存在，然后就开始建立关系<a style="color:rgb(122, 214, 253);" href="#dep-prototype-depend">dep.depend()</a>
## Observer（观察属性，并替换数组的__proto__）
:::tip
附加到每个观察对象的观察者类。一旦附加，观察者将目标对象的属性键转换为`getter/setter`，用于收集依赖项和分配更新。与`Dep`类共同工作才能完成数据更新。
:::
```js
  var Observer = function Observer (value) {
    this.value = value;
    // 实例化一个dep
    this.dep = new Dep();
    this.vmCount = 0;
    // 在value上面添加__ob__这个属性并指向this
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        // protoAugment => value.__proto__ = arrayMethods
        // arrayMethods 重点分支，基于Array.__proto__新建一个原型链，然后劫持用户对数组的操作
        protoAugment(value, arrayMethods);
      } else {
        // 忽略
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };
```
上面用到的函数:
1. <a style="color:rgb(122, 214, 253);" href="#def">def</a>在对象上面添加或修改属性
2. <a style="color:rgb(122, 214, 253);" href="#arraymethods">arrayMethods</a>拦截用户对数组的操作，并且通知这些数据变换依赖的watcher
3. <a style="color:rgb(122, 214, 253);" href="#observearray">Observer.observeArray</a>遍历数组调用observe
4. <a style="color:rgb(122, 214, 253);" href="#walk">Observer.walk</a>遍历对象中所有属性来调用`defineReactive$$1`
### walk
```js
  // 遍历所有属性并将它们转换为getter/setter。此方法只应在值类型为Object时调用。
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };
```
`defineReactive$$1()`给对象设置getter、setter，点击<a style="color:rgb(122, 214, 253);" href="#definereactive-1">defineReactive$$1</a>跳转函数实现。

### observeArray
```js
// 遍历数组调用observe
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };
```
## arrayMethods
:::tip
基于`Array.prototype`新建一个原型链，拦截用户对数组的操作，并且通知这些数据变换依赖的watcher。
:::
```js
    // 获取原生Array中提供的所有方法
  var arrayProto = Array.prototype;
    // 将原生提供的方法创建一个新的对象，以免修改原生的方法，造成全局污染
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];
  /**
   * 截取上面这些方法，然后实现相应的操作
   */
  methodsToPatch.forEach(function (method) {
    // 缓存原始方法，也就是Array的原型方法原本的实现
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      // 截取用户调用Array.methods传入的参数args
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      // 在函数体内优先调用了缓存下来的数组变异方法
      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      // 可以看到这个switch里面的方法:push、unshift、splice都是增加数组元素的方法
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      // // 如果有修改的数据，则添加observer监听器
      if (inserted) { ob.observeArray(inserted); }
      // 通知更新
      ob.dep.notify();
      return result
    });
  });
```
## 公用函数
### setScope
```js
// 给scoped CSS 设置范围id属性
//
    function setScope(vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }
```
### isDef
:::tip[用法与作用]
传入一个变量，判断是否是`undefined`且`null`
:::
```js
  function isDef (v) {
    return v !== undefined && v !== null
  }
```
### def
:::tip[def]
传入`obj, key, val, enumerable`<br>
在对象上面添加或修改属性
:::
```js
/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
```

### traverse
:::tip
递归遍历一个对象中的所有属性，取到当前值时就触发了getter，在getter中建立依赖。
:::
```js
  function traverse (val) {
    // seenObjects是一个set，在递归的过程中存入depId，碰到已经监听的dep就跳过
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    // 在这里调用val，触发了getter => dep.depend
    var isA = Array.isArray(val);
    // isFrozen判断不可扩展，响应式数据都是可扩展的
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      // 碰到已经监听过的dep就跳过
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    // 遍历数组，递归数组的值
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      // 遍历对象的每个属性
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }
```

### hasOwn
:::tip
判断这个对象有没有这个属性
:::
```js
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }
```
### shouldObserve
:::tip
在某些情况下，我们可能想要禁止组件中更新计算中的观察。
:::
```js
  var shouldObserve = true;
  function toggleObserving (value) {
    shouldObserve = value;
  }
```
### proxy
:::tip
将target的key属性的值代理到sourceKey中的属性key。结论：取target中的key就是取sourceKey中的key,例如`vm.message = '123'`触发set函数`vm._data.message = '123'`
:::
```js
  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    // 这边的target是vm，在defineReactive$$1中也有设置get、set，那里面的target是我们定义的data对象
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```

下面这个例子讲的是，我们平时在取`this.message`的时候其实取的是`this._data.messgae`，当前setter也是一样的效果。
![](./Vue2-proxy-getter&setter.png)

## Dep与Watcher
:::tip[联系]
* dep与watcher是多对多的关系，watcher负责包含页面的变化函数，dep
* watcher：一个表达式对应一个Watcher，一个watcher可能对应多个Dep（多层表达式：foo.test.one）
* dep：一个dep可能对应多个watcher，属性可能在模板中被多次使用到(比如：<br>
<!-- <p>{{message}}</p><br> -->
<!-- <div>{{message}}</div><br> -->
<!-- computed:{test(){return this.message + '22'}}<br> -->
<br>
:::
```js
data:{
  message: 'hello'
}
this.message = 'world'
// 上面的执行顺序是：
// 1. vm.message = 'world' => 在initData中已经代理过，vm._data.message 和 vm.message引用地址是一个
// 2. vm._data.message = 'world'
// 3. 触发vm._data的setter函数
// 4. 在setter函数中触发dep.notify();引发页面更新
```

### Dep
:::tip
defineReactive方法将data中的数据进行响应式后，可以监听到数据的变化了,然后Dep就是帮我们收集依赖究竟要通知到哪里。每单个对象（递归遍历）对应一个Dep类。
:::
```js
// 为了让更好的订阅watcher，每个数据对象都有唯一的uid，
  var uid = 0;
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };
```
### addSub&&removeSub
```js
 Dep.prototype.addSub = function addSub (sub) {
    // 将watcher放入该数据订阅的subs数组中，当该数据更新会通知所有已订阅的watcher更新。
    this.subs.push(sub);
  };
  Dep.prototype. = function removeSub (sub) {
    remove(this.subs, sub);
  };
```
### Dep.prototype.depend
```js
  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      // 执行Watcher.prototype.addDep并把当前dep实例作为参数带入
      Dep.target.addDep(this);
    }
  };
```
`Dep.target`指的是当前`watcher`，继续走<a style="color:rgb(122, 214, 253);" href="#watcher-prototype-adddep">Dep.target.addDep(this)</a>
### Dep.prototype.notify
```js
  Dep.prototype.notify = function notify () {
    var subs = this.subs.slice();
      // 异步执行更新 默认情况下config.async = true，异步更新性能较好
    if (!config.async) {
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };
```
### pushTarget&&popTarget
```js
  // 当首次计算 computed 属性的值时，Dep将会在计算期间对依赖进行收集
  Dep.target = null;
  // 设置成数组的原因是：可能会有对象嵌套
  var targetStack = [];
  // target指的是watcher
  function pushTarget(target) {
    // 在一次依赖收集期间，如果有其他依赖收集任务开始（比如：当前 computed 计算属性嵌套其他 computed 计算属性），
    // 那么将会把当前 target 暂存到 targetStack，先进行其他 target 的依赖收集，
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget() {
    // 当嵌套的依赖收集任务完成后，将target恢复为上一层的Wacther
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }
```

## Watcher
:::tip

Watcher负责
:::
```js
var Watcher = function Watcher(
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    //  lazy 表示一种固定描述，不可改变，表示这个 watcher 需要缓存
    // dirty 表示缓存是否可用，如果为 true，表示缓存脏了，需要重新计算，否则不用
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    // 接收计算函数的getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }

    this.value = this.lazy
      ? undefined
      : this.get();
      // get是个重要分支
  };
  // 调用this.get方法，并将dirty设置成false，防止再次调用
    Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
  };
```

### watcher.prototype.get
```js
  get () {
    // 将当前的watcher推入栈中，为后面的添加依赖做铺垫
    // Dep.target = this
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 调用getter =》 dep.depend(); 这一步将是将Dep.target推入到dep中
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      // 撤销当前Dep.target
      popTarget()
      // 代码解释在下面
      this.cleanupDeps()
    }
    return value
  }
```
`value = this.getter.call(vm, vm)`最终会跳到会跳到`defineReactive`中定义的getter函数，<a style="color:rgb(122, 214, 253);" href="##definereactive-1">definereactive-get</a>

### watcher.prototype.addDep
:::tip[addDep]
在执行`dep.depend()`之前一般都会先执行`pushTarget()`，将当前的`watcher`推到全局变量`targetStack`的栈中，并且把`Dep.target`赋值为当前推入的`watcher`，然后就开始想户建立建立关系，建立关系的代码就在下面。
:::
```js
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      // watcher中放入dep
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        // dep中放入watcher
        dep.addSub(this);
      }
    }
  };
```
执行到<a style="color:rgb(122, 214, 253);" href="#addsub-removesub">dep.addSub(this)</a>
### cleanupDeps
:::tip
`addDep`的作用是将关系放入`newDepIds`、`newDeps`中，而`cleanupDeps`是将新的Dep与旧的Dep做判断，如果新的依赖集合里面没有以前旧的，就把dep已经订阅的watcher移除，然后将`newDepIds`、`newDeps`转到`depIds`,`deps`，并置空`newDepIds`、`newDeps`。听起来有点绕口，下面有个例子:<a style="color:rgb(122, 214, 253);" href="#如何建立联系">如何建立联系</a>
:::
```js
    var i = this.deps.length;
    while (i--) {
      // 判断最新的
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    // 利用一个额外空间来newDepIds 转到 depIds，并清空newDepIds
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    // 利用一个额外空间来newDeps 转到 deps，并清空newDeps
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
```

### queueWatcher
:::tip
* 推入一个watcher到当前队列queue
* 根据watcher的id来判断，确保不会重复
:::
```js
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if (!config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }
```
举个例子：
```html
<body>
    <div id="app">
        <p ref="message">{{message}}</p>
        <p ref="code">{{code}}</p>
        <p>{{realArr}}</p>
        <button @click="onClick">click</button>
    </div>
    <script>
        var app = new Vue({
            el:'#app',
            data: {
                message: 'origin',
                code: 1,
            },
            watch:{
                message(newVal, oldVal) {
                    console.log(newVal, oldVal)
                },
                code(value){
                    console.log('t:', value)
                }
            },
            methods:{
                onClick() {
                    this.message = 'changed'
                    this.$nextTick(() => console.log(this.$refs.code))
                    this.code = 2'
                }
            }
        })
    </script>
</body>
```
点击按钮时（注意queue = []、callBack = []是全局变量）
1. 执行到`this.message = 'changed'`

`queue`会`push`两个watcher，一个是`message`对应的`user watcher`，一个是`render wacther`，`callBack`有一个包含执行`queue`的函数

2. 执行到`this.$nextTick(() => console.log(this.$refs.code))`

`queue`还是两个`watcher`，`callBack`会`push`一个函数也就是`() => console.log(this.$refs.code)`

3. 执行到`this.code = 2`

`queue`增加一个`code`对应的`user watcher`，想再次加入`render watcher`时，发现里面已经有一个`render watcher`就不会重复添加（根据`watcher.id`来判断）

4. 这时同步代码都执行完，现在开始执行`flushCallbacks()`，里面依次执行`callBack`函数，`callBack[0]`包含执行queue的函数，执行`queue`里面的所有的`watcher.run`，这个时候页面节点就已经发生改变了，由于`this.code`对应的`watcher`也在当前`queue`里面，所以执行`callBack[1]`时，就可以取到最新的节点内容。
### flushSchedulerQueue
```js
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  // 排序watcher队列
      // 1. 组件更新是从父到子的过程，因为组件创建过程也是从父到子的
      // 2. 为了让user watcher比render watcher更早执行
      // 3. 当一个组件在父组件的watcher中销毁时，这个组件的watcher应该被跳过。
  queue.sort((a, b) => a.id - b.id)
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    // 更新页面节点数据前调用beforeUpdate钩子函数
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    // 更新页面节点
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```

### 如何建立联系
:::tip[代码例子]
```js
  computed: {
      firstComputed() {
          if (this.toggle) {
              return this.message + this.num + 33
          }
          return this.message + this.anotherNum + 33
      }，
      secondComputed(){
        return this.message
      }
  }
```
我们知道在data中的每个属性都会实例化一个Dep类，假设下面试实例化出来的Dep类:<br>
`message => dep.id = 3`<br>
`num => dep.id = 4`<br>
`anotherNum => dep.id = 5`<br>
`toggle => dep.id = 6`<br>
计算属性`firstComputed`对应的`watcher.id = 1`<br>
计算属性`secondComputed`对应的`watcher.id = 2`<br>
:::
首先要明白一点，watcher和dep是多对多的关系，可以这样理解：在计算属性中可以有多个数据，比如:

* 当`toggle=true`时`firstComputed`的watcher对应多个`depIds:[6,3,4]`
* `message`的dep中订阅了多个`watcherIds:[1, 2]`

**现在来看看`depIds:[6,3,4]`是怎么放入的？**

1. 执行到firstComputed时，会先判断dirty是否为`true`,然后会走`watcher.get => pushTarget => this.getter.call(vm,vm)`也就是从`if (this.toggle)`开始走下去
2. 从而进入到toggle的getter函数，触发了`dep.depend => Dep.target.addDep(this)`，这时候开始建立关系，newDepIds先判断已经含有`newDepIds.add(6)`，`newDeps.push(dep:{id:6})`，`dep.addSub(watcher:{id:1})`，这边为了更好的看清怎么添加关系的，所以我在实例后面加了个id作为识别，真正情况下只是添加这个实例。执行完这一步后，结果如下：
```js
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      // watcher中放入dep
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        // dep中放入watcher
        dep.addSub(this);
      }
    }
  };
```
:::tip[watcher:{id:1}]
newDepIds: [6]<br>
newDeps: [dep:{id:6}]<br>
deps:[]<br>
depIds:[]<br>
:::
:::tip[dep:{id:6}]
dep.subs[watcher:{id:1}]<br>
:::
3. 从`if (this.toggle)`执行完到`return`后结果就会变成:
:::tip[watcher:{id:1}]
newDepIds: [6,3,4]<br>
newDeps: [dep:{id:6},dep:{id:3},dep:{id:4}]<br>
deps:[]<br>
depIds:[]<br>
:::
:::tip[dep:{id:6}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:3}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:4}]
dep.subs[watcher:{id:1}]<br>
:::
4. 执行完`this.getter.call(vm,vm)`后就又回到`watch.get`，执行<a style="color:rgb(122, 214, 253);" href="#cleanupdeps">watcher.cleanupDeps</a>，由于这是第一次执行这个步骤。所以没有旧的deps，只是简单的转移数据和置空数据，结果如下所示:
:::tip[watcher:{id:1}]
newDepIds: []<br>
newDeps: []<br>
deps:[dep:{id:6},dep:{id:3},dep:{id:4}]<br>
depIds:[6,3,4]<br>
:::
5. 当我们将toggle改为false时：又从`firstComputed`执行到`if (this.toggle)`了，又进来toggle的getter函数，触发了`dep.depend => Dep.target.addDep(this)`，开始建立关系，这一次if条件变了，return变成第二个了，所以执行完所有的getter，最终的结果如下所示：
:::tip[watcher:{id:1}]
newDepIds: [6,3,5]<br>
newDeps: [dep:{id:6},dep:{id:3},dep:{id:5}]<br>
deps:[6,3,4]<br>
depIds:[dep:{id:6},dep:{id:3},dep:{id:4}]<br>
:::
:::tip[dep:{id:6}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:3}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:4}]
dep.subs[watcher:{id:1}]<br>
这个`dep`已经不需要订阅`watcher:{id:1}`了，需要在cleanupDeps里面移除
:::
:::tip[dep:{id:5}]
dep.subs[watcher:{id:1}]<br>
:::
6. 走完后开始走`watcher.cleanupDeps`,这次旧的`deps`是有数据的，看到`dep:{id:4}`还在订阅这个`computed watcher`，所以`cleanupDeps`需要移除这个订阅，并且将最新的数据转移到`deps`，`depIds`，最终的结果如下所示：
:::tip[watcher:{id:1}]
newDepIds: []<br>
newDeps: []<br>
deps:[6,3,5]<br>
depIds:[dep:{id:6},dep:{id:3},dep:{id:5}]<br>
:::
:::tip[dep:{id:6}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:3}]
dep.subs[watcher:{id:1}]<br>
:::
:::tip[dep:{id:4}]
dep.subs[]<br>
这个`dep`已经不订阅`watcher:{id:1}`了
:::
:::tip[dep:{id:5}]
dep.subs[watcher:{id:1}]<br>
:::

上面的过程用一个流程图表示：

![](./Vue2-addDep-cleanupDeps.png)

#### 总结dep&&watcher
为了在每次更新时都保持dep与watcher都有相同的依赖和订阅，所以dep和watcher都有相互的变量可以访问到对方，做到你中有我，我中有你的状态。


## $set
```js
 function set(target, key, val) {
  //  如果target是null、undefined、基础类型就报错。计算属性是
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    //
    // 如果目标是数组的话就用splice来插入，因为Vue本身有劫持数组的方法，其中包括splice，这样就会触发数据响应
    // 这里假设的情况是target是data里面的数组
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    // 如果key是在target的属性里面的属性，直接在该属性上面改动，然后触发defineReactive$$1的setter
    // 这里假设的情况是target是data里面的对象
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    // 如果target._isVue是true就说明vue实例，不能添加属性
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    // 计算属性是没有__ob__的，所以计算属性是不会直接进来这个分支，然后在内存里面值是变了，但是页面没有更新的。
    if (!ob) {
      target[key] = val;
      return val
    }
    //如果都没有命中上面的条件，那么就是认为是用户想定义新的响应式数据
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }
```
## nexttick
### 全局变量
```js
  var isUsingMicroTask = false;
  var callbacks = []; // 用来存储回调函数的数组
  var pending = false;
```
### flushCallBacks
:::tip
调用全局变量`callbacks`中的所有函数
:::
```js
  function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0); // 拷贝数组
    callbacks.length = 0;  // 清空数组
    for (var i = 0; i < copies.length; i++) {
      // 运行数组里的所有函数
      copies[i]();
    }
  }
```
### timerFunc
:::tip
只需要记得timerFunc是一个微任务，，如果不懂微任务的话可以看着这一篇文章:[微任务和宏任务](./interview.md#event-loop)，下面代码是为了兼容多个浏览器和UIWebview，在正常谷歌浏览器时可把代码省略成下面这样，timerFunc的函数作用是将`flushCallbacks`函数推入微任务队列
```js
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
    };
```
:::
```js
  var timerFunc;
  // Promise is available, we will use it:
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Techinically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }
```
### nextTick
:::tip
调用Vue.$nextTick(cb())，会将cb推入到全局变量callbacks，只有当pending为false时才可以调用timerFunc()，所以callback的length等于0和pending为false只能是同时成立的，因为这段代码是同步的。
:::
```js
  function nextTick(cb, ctx) {
    var _resolve;
    // 将回到函数cb推入全局变量callbacks
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    // 判断当前微任务是否正在执行，pending会在flushCallbacks函数执行时复制成false
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // 如果没有传入cb时，返回Promise 调用方式:Vue.$nextTick().then(resolve => {})
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
```


![](./Vue2-nexttick-arrayDemo1.png)

看上图，点击按钮后页面是不会重新渲染的，这很正常，因为前面讲过，Vue只提供那些变异方法才能促使页面更新，vm.$Set也是这样的，但是看下面一张图

![](./Vue2-nexttick-arrayDemo2.png)
点击测试，页面数据变换了，为什么？可以看出代码多加了一行`this.message = 'hello'`，当执行到这一句时会调用`dep.notify`，触发`render watcher`，但是没有马上执行只是放在nexttick队列中，等待宏任务执行完在执行nexttick宏任务，再执行到`this.realArr[0] = '111'`，没有触发`dep.notify`，但是对应的引用地址中的值确实变了，所以在后面执行render watcher时，再次调用this.realArr的时候值就变了。

## 原理图
![](./Vue2-theory.png)

解读：
在实例化`data`对象时，递归遍历，将每个数据都对应的实例化一个`Dep`类，并且在`defineReactive`的get函数中设置`dep.depend`,在`set`函数设置`dep.notify`，在页面渲染、`computed`或`watch`的时候会触发`get`然后就会设置依赖，在数据更新时就通过`set`中的`dep.notify`来通知在`get`中设置的依赖，达到响应式更新数据的效果，更新数据或页面这一操作是放到全局变量`callback`栈中，当宏任务结束后就以微任务的形式挨个执行`callback`的更新回调。所以数据是部分更新的，并不是单个更新的。

## 问题解答
:::tip[message为data中定义的对象，vm._data.message和vm.message有什么区别？]
本质上vm._data和vm.data是没有区别的，在`initData`中`vm._data = typeof data === 'function'? getData(data, vm) : data || {};`，因为设置`defineProperty`中的`getter`、`setter`需要临时变量来保存用户设置的值，所以新建了`_data`。
:::
:::tip[为什么Vue中不能通过索引来修改数组以更新视图？为什么有时候莫名其妙就可以触发视图更新？]
从根源上来讲，Vue2.6通过更改数组索引的方式来更改数组的数据是不会触发`defineProperty`的`set`函数，也就不会触发页面更新，但是数组的引用地址对应的数据确实被改了，当你也一起修改某个响应式数据，对应更新的`watcher`的推到`nexttick`队列，当宏任务结束后，就会执行nexttick中的队列，页面重新渲染时获取的是数组的最新的数据，有时响应式数据更新在数据修改的后面就会导致页面数组重新获取数据。
:::
:::tip[为什么只能通过官网指定的几个方法(push、splice...)才能出发数组数据更新？]
在源码`arrayMethods`可以看出来，Vue2.6是先截取了原生的Array.prototype的方法，然后重写方法获取用户传入的参数，在重写方法内部先是调用原方法，然后调用`ob.dep.notify()`来更新对应`watcher`。
:::
:::tip[为什么通过this.$set就可以触发数组下标更新导致更新视图？]
在这一篇[DefineProperty和Proxy](./DefineProperty&&Proxy.md)中讲过它们两个的区别，因为Vue2.6中用的是`DefineProperty`，而这个方法必须要传入目标对象`obj`,目标对象的键`Key`，这就造成了很难动态的添加属性，为什么说很难呢？因为这个是可以实现的，比如本来data里面有数据message，message是执行过`defineReactive`的，所以可以监听到getter、setter，但是你想新建一个flag，直接`data.flag = 10`，每次调用前都需要判断是否定义过，没有定义的就执行`defineReactive`，无疑是很费性能的，数据也是一样，数组是没有key的，所以更是监听不了的，Vue.$Set也是通过判断是否是数组，是的话再调用那些变异方法来执行更新。
:::
:::tip[computed和watch的区别有哪些，computed的缓存是怎么做到的？]
watch和computed一个重要区别就是，监听的属性发生改变时就执行watch函数，计算属性和data里面属性一样，只有在某个地方用到时才会调用计算属性的getter，而getter中包含表达式。然后计算属性是可以缓存的，这个缓存指的是基于它们的响应式依赖进行缓存的，`defin·Reactive`中set中`oldValue`和`newValue`如果不等时就会触发`dep.notify=>dep.update=>this.dirty=true`，在获取计算属性的时候，判断dirty会true时就会调用`this.get`重新获取对应的值。
:::
:::tip[社区经常提到的watcher和dep到底为响应式数据提供了怎么样的逻辑]
Vue2.6中只会在computed、watch、页面渲染时实例化Watcher，具体看dep与watcher是如何建立联系的可以看<a style="color:rgb(122, 214, 253);" href="#如何建立联系">dep与watcher是如何建立联系</a>
:::



