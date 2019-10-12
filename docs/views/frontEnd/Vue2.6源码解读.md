---
title: 'Vue2.6源码解读'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories:
- frontEnd
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- frontEnd
- 源码解读
- Vue
# 标签
---

::: tip 概述
。。。
:::

## 第一个大标题

### _init
```javascript
Vue.prototype._init = function (options) {
  var vm = this;
  // a flag to avoid this being observed
  // 做个标记，避免后面被Observer()实例化
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
[initProxy]()
[initLifecycle]()
### initProxy
```javascript
    var initProxy = function initProxy (vm) {
      if (hasProxy) {  //hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
        // determine which proxy handler to use
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

::: tip render._withStripped github issues
This is an internal flag that allows Vue's runtime to pick the correct Proxy strategy to detect variable reference errors during render, depending on whether with has been stripped by vue-template-es2015-compiler.
:::
### getHandler && hasHandler
看上面两个对象前先看一个工具函数:
```js
var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );
    // Make a map and return a function for checking if a key，is in that map.
    // 翻译：生成一个map对象和返回一个函数来检查是否含有某个键
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
        // allowedGlobals是一个映射表
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
// 针对读取代理对象的某个属性时进行的操作。
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
### initLifecycle
```js

```
### initState
```js
  function initState (vm) {
    // 定义vm的watchers
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
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


### initComputed
```js
  function initComputed(vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
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
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
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


## observe
::: tip
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
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}
```
### initData
```js
  function initData (vm) {
    var data = vm.$options.data;
    // 不管是函数还是对象，最终返回的都是纯对象，如果不是纯对象就抛出warn
    // 并且赋值给vm._data
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn();
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    // 判断data的key有没有在prop或methods已经定义过
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn();
        }
      }
      if (props && hasOwn(props, key)) {
        warn();
      } else if (!isReserved(key)) {
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


## defineReactive$$1
::: tip

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
    //   configurable: true
    //   enumerable: true
    //   value: "hello world!"
    //   writable: true
    // }
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    // 如果
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }
    // shallow => 浅，只在定义 $attrs和$listeners是true
    // 为true时不会向当前对象的值进行递归
    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
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
        // (newVal !== newVal && value !== value)用来判断 是否是NaN，如果是NaN就直接return
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }
```

## Observer
::: tip
附加到每个观察对象的观察者类。一旦附加，观察者将目标对象的属性键转换为`getter/setter`，用于收集依赖项和分配更新。与`Dep`类共同工作才能完成数据更新。
:::
```js
  var Observer = function Observer (value) {
    this.value = value;
    // 实例化一个dep
    this.dep = new Dep();
    this.vmCount = 0;
  // 在这个属性上面添加__ob__这个属性
  // function def(obj, key, val, enumerable) {
  //   Object.defineProperty(obj, key, {
  //     value: val,
  //     enumerable: !!enumerable,
  //     writable: true,
  //     configurable: true
  //   });
  // }
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        // protoAugment => value.__proto__ = arrayMethods
        // arrayMethods 重点分支
        protoAugment(value, arrayMethods);
      } else {
        // 忽略
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  // 遍历所有属性并将它们转换为getter/setter。此方法只应在值类型为Object时调用。
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

// 遍历数组调用observe
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };
```

## Array
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
    // 在
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
::: tip 用法与作用
传入一个变量，判断是否是`undefined`且`null`
:::
```js
  function isDef (v) {
    return v !== undefined && v !== null
  }
```
### def
::: tip def
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
::: tip
递归遍历一个对象来调用所有转换的对象的getter，为了让对象中的每个嵌套属性都被作为一个“深度”依赖。
:::
```js
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }
```



### hasOwn
::: tip
判断这个对象有没有这个属性
:::
```js
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

```
### shouldObserve
::: tip
在某些情况下，我们可能想要禁止组件中更新计算中的观察。
:::
```js
  var shouldObserve = true;
  function toggleObserving (value) {
    shouldObserve = value;
  }
```

### proxy
::: tip
将target的key属性的值代理到sourceKey中的属性key。结论：取target中的key就是取sourceKey中的key
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
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```
## Dep与Watcher
::: tip 联系
* dep与watcher是多对多的关系，watcher负责包含页面的变化函数，dep
* watcher：一个表达式对应一个Watcher，一个watcher可能对应多个Dep（多层表达式：foo.test.one）
* dep：一个dep可能对应多个watcher，属性可能在模板中被多次使用到(比如：<br>
<p>{{message}}</p><br>
<div>{{message}}</div><br>
computed:{test(){return this.message + '22'}}<br>
)<br>
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
```js
/*  */
  var uid = 0;
  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if (!config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // 当首次计算 computed 属性的值时，Dep将会在计算期间对依赖进行收集
  Dep.target = null;
  var targetStack = [];

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
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
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
  };
```

### 如何建立联系
::: tip

:::

## nexttick
### 全局变量
```js
  var isUsingMicroTask = false;
  var callbacks = []; // 用来存储回调函数的数组
  var pending = false;
```
### flushCallBacks
::: tip
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
::: tip
只需要记得timerFunc是一个微任务，下面代码是为了兼容多个浏览器和UIWebview，在正常谷歌浏览器时可把代码省略成下面这样，timerFunc的函数作用是将`flushCallbacks`函数推入微任务队列
```js
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
    };
```
:::
```js
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
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
::: tip
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


超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

