---
title: 'Vue源码解读'
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
    initProxy = function initProxy (vm) {
      if (hasProxy) {
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
    // 如果应该观察 && 不是服务端渲染 && （这个值是个数组 || 这个值是个纯对象）&& 对象是可以扩展的
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
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
        proxy(vm, "_data", key);
      }
    }
    // observe data 观察data
    observe(data, true /* asRootData */);
  }
```


## 公用对象
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

  // The current target watcher being evaluated. 当前的target
  // This is globally unique because only one watcher这是全局唯一的，因为只要一个watcher
  // can be evaluated at a time.  可以一次评估
  Dep.target = null;
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
    // shallow =》 浅，只在定义 $attrs和$listeners是true
    //
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

## 公用函数
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
## dep与watcher

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

