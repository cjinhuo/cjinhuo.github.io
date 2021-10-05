---
title: '初级前端工程师'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
tags:
- 前端基础
---
## js中for in与for of之间的差异

let aArray = ['a',123,{a:1,b:2}]

```
for(let index in aArray){
    console.log(index);
}
```

输出: 0 1 2 说明遍历的是index，

## 扩展运算符...

::: tip 对扩展运算符的理解
对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
:::

``` js
let bar = { a: 1, b: 2 };
let baz = { ...bar }; // { a: 1, b: 2 }
```
上面的方法实际上就等于
``` js
let bar = { a: 1, b: 2 };
let baz = Object.assign({}, bar); // { a: 1, b: 2 }
```
Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。(如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性)。<br>
同样，如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。
```js
let bar = {a: 1, b: 2};
let baz = {...bar, ...{a:2, b: 4}};  // {a: 2, b: 4}
baz.a = 10
console.log(bar) // {a: 1, b: 2};
console.log(baz) // {a: 10, b: 2};
```
### ...是浅拷贝
我们看个例子
```js
let bar = {a: 1, b: {one:1,two: 2}};
let baz = {...bar};
console.log(bar) // { a: 1, b: { one: 1, two: 2 } }
baz.b.one = 10
console.log('baz',baz) // baz { a: 1, b: { one: 10, two: 2 } }
console.log('bar',bar) // bar { a: 1, b: { one: 10, two: 2 } }
```
::: tip 基础数据类型与引用类型
javascript中有两种数据类型，分别是基础数据类型和引用数据类型。基础数据类型是按值访问的，常见的基础数据类型有`Number`、`String`、`Boolean`、`Null`、`Undefined`，这类变量的拷贝的时候会完整的复制一份；引用数据类型比如`Array`、`Object`,`symbol`，在拷贝的时候拷贝的是对象的引用，当原对象发生变化的时候，拷贝对象也跟着变化。
:::
为什么分成基础数据类型和引用类型，这就要扯到了栈内存和堆内存。
### 栈和堆
::: tip 栈和堆概述
栈区（stack）— 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
堆区（heap） — 一般由程序员分配释放， 若程序员不释放，程序结束时可能由OS回收 。注意它与数据结构中的堆是两回事，分配方式倒是类似于链表
:::
基础数据类型是放在栈内存，引用类型是放在堆内存，两个图就理解了:
栈内存：
![](../../../.vuepress/public/stack.jpg)
堆内存：
![](../../../.vuepress/public/heap.jpg)
这就引出了浅拷贝与深拷贝，正常拷贝基础数据类型（也称为值类型）时，是直接拷贝目标值，拷贝引用类型时是拷贝引用地址。
::: tip 浅拷贝与深拷贝
浅拷贝:拷贝对象的引用，而不是在内存新建一块内存。
深拷贝:将对象的所有值拷贝一份放在新建的内存，这样两块内存互不干涉。
:::

### 深拷贝
深拷贝也经常被用到，我常用的是JSON.parse(JSON.stringify())
```js
let bar = {a: 1, b: {one:1,two: 2}};
let baz = JSON.parse(JSON.stringify(bar))
baz.b.one = 10
console.log('baz',baz) // baz { a: 1, b: { one: 10, two: 2 } }
console.log('bar',bar) // bar { a: 1, b: { one: 1, two: 2 } }
```
现在就是深拷贝了。但是这样有很多问题，比如当对象里面的值是函数、正则表达式循环引用时就会出现BUG。

**简单版的深拷贝（大多在面试中写出来）**
```js
function deepClone(source) {
  // WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失
  const hashStack = new WeakSet()
  const recursion = obj => {
    const result = Array.isArray(obj) ? [] : {}
    if (hashStack.has(obj)) return obj
    hashStack.add(obj)
    for (const key in obj) {
      let value = obj[key]
      // 假设只考虑object array
      result[key] = typeof value === 'object' ? recursion(value) : value
    }
    return result
  }
  return recursion(source)
}
```


```js
// 构造函数
function person(pname) {
  this.name = pname;
}

const Messi = new person('Messi');

// 函数
function say() {
  console.log('hi');
};

const oldObj = {
  a: say,
  b: new Array(1),
  c: new RegExp('ab+c', 'i'),
  d: Messi
};

const newObj = JSON.parse(JSON.stringify(oldObj));

// 无法复制函数
console.log(newObj.a, oldObj.a); // undefined [Function: say]
// 稀疏数组复制错误
console.log(newObj.b[0], oldObj.b[0]); // null undefined
// 无法复制正则对象
console.log(newObj.c, oldObj.c); // {} /ab+c/i
// 构造函数指向错误
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: Object] [Function: person]
```
所以我们得自己来构造一个深拷贝函数
```js

const isType = (obj, type) => {
  if (typeof obj !== 'object') return false;
  const typeString = Object.prototype.toString.call(obj);
  let flag;
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]';
      break;
    case 'Date':
      flag = typeString === '[object Date]';
      break;
    case 'RegExp':
      flag = typeString === '[object RegExp]';
      break;
    default:
      flag = false;
  }
  return flag;
};

const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};


/**
* deep clone
* @param  {[type]} parent object 需要进行克隆的对象
* @return {[type]}        深克隆后的对象
*/
const clone = parent => {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;

    let child, proto;

    if (isType(parent, 'Array')) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, 'RegExp')) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i]);
    }
    return child;
  };
  return _clone(parent);
}
function person(pname) {
  this.name = pname;
}
const Messi = new person('Messi');
function say() {
  console.log('hi');
}
const oldObj = {
  a: say,
  c: new RegExp('ab+c', 'i'),
  d: Messi,
  f: [2,3]
};
oldObj.b = oldObj;
const newObj = clone(oldObj);
console.log(newObj.a, oldObj.a); // [Function: say] [Function: say]
console.log(newObj.b, oldObj.b); // { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] } { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] }
console.log(newObj.c, oldObj.c); // /ab+c/i /ab+c/i
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: person] [Function: person]
```



### 数组的扩展运算符

```js
function add(x, y) {
  return x + y;
}
const numbers = [4, 38];
add(...numbers) // 42
```
还可以复制数组，但还是浅复制，因为数组也是引用类型
```js
const arr1 = [1, 2];
const arr2 = arr1;
arr2[0] = 2;
arr1 // [2, 2]
```
ES6有个新特效是解构复制，配合扩展运算符很好用
```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```
::: danger
如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。
:::
```js
const [...rest, last] = [1, 2, 3, 4, 5];
// 报错
const [first, ...rest, last] = [1, 2, 3, 4, 5];
// 报错
```
扩展运算符还可以将字符串转为真正的数组
```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```
## JS 事件模式
::: tip 区别
共同点：两者都可订阅，然后接受消息<br>
发布/订阅:一种一对多的依赖关系，由发布者、订阅者、消息管理器三部分组成，松耦合的状态（有key值对应的回调函数）<br>
观察者:将订阅者依附在目标对象身上，在发布时直接调用目标内容进行输出，一种一对多的依赖关系，紧耦合的状态（无key值对应回调函数）<br>
:::
### 发布订阅
![](../../../.vuepress/public/subscibe.png)
```js
let event = {
  clientList: {},
  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)   // 订阅的消息添加进缓存列表
  },
  trigger(type, money) {
    let fns = this.clientList[type] // 相当于简单的消息管理，过滤订阅信息
    if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
      return false
    }
    fns.forEach(fn => {
      fn.apply(this, [money])
    })
  }
}

// 再定义一个installEvent函数，用于给所有对象动态安装发布-订阅功能
// 如：另一家售楼处也想要这个功能，就可以调用这个注册了，不同再写多一次这段代码
let installEvent = obj => {
  for (let i in event) {
    obj[i] = event[i]
  }
}

// 给售楼处对象salesOffices动态增加发布-订阅功能
let salesOffices = {}
installEvent(salesOffices)
// 小明订阅信息
salesOffices.listen('squareMeter88', price => {
  console.log('小明，你看中的88平方的房子，价格=' + price)
})
// 小光订阅信息
salesOffices.listen('squareMeter88', price => {
  console.log('小光，你看中的88平方的房子，价格=' + price)
})
// 小红订阅信息
salesOffices.listen('squareMeter100', price => {
  console.log('小红，你看中的100平方的房子，价格=' + price)
})
// 小明，你看中的88平方的房子，价格=2000000
// 小光，你看中的88平方的房子，价格=2000000
salesOffices.trigger('squareMeter88', 2000000)
// 小红，你看中的100平方的房子，价格=2500000
salesOffices.trigger('squareMeter100', 2500000)
```
### 观察者
```js
let Ob = {}
Ob.list = []
// 订阅后返回一个id，用于删除该订阅内容
Ob.subscibe = function (fn) {
  let id = Math.random() * 100000 + 1
  Ob.list.push({
    id,
    fn
  })
  return id
}
Ob.publish = function () {
  for(let v of this.list) {
    v.fn.apply(this, arguments)
  }
}
Ob.delete = function(id) {
  for(let i = 0; i < this.list.length; i++) {
    if (this.list[i].id === id) {
      this.list.splice(i, 1)
      return true
    }
  }
}
let one = Ob.subscibe(function(color){
  console.log('我想的颜色' + color)
})
// 我想的颜色red
Ob.publish('red')
Ob.delete(one)
// 没有输出
Ob.publish('blue')

```
## 去重数组
``` js
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]
```
## Vue兄弟间怎么检测数据变换
1. 在有些情况下可以用路由传参
2. 用Vuex作为载体传参、监听
3. 用兄弟的父元素来监听两个子组件的变换统一分配数据
## 用indexOf来实现简易版的include

```js
Array.prototype.myIncludes = function(e){
  return this.indexOf(e) !== -1
}
```

## 排序对象数组
```js
const compareAscending = function (propName) {
  return function (obj1, obj2) {
    var val1 = obj1[propName]
    var val2 = obj2[propName]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
const compareDescending = function (propName) {
  return function (obj1, obj2) {
    var val1 = obj1[propName]
    var val2 = obj2[propName]
    if (val1 > val2) {
      return -1
    } else if (val1 < val2) {
      return 1
    } else {
      return 0
    }
  }
}
// 调用
let t = [{
  a: 1,
  b: 2
}, {
  a: 2,
  b: 3
}]
// 传入属性名
t.sort(compareDescending('a'))
```

## 正则表达式
### 中文
::: tip 中文正则
“\u4e00”和“\u9fa5”是unicode编码，并且正好是中文编码的开始和结束的两个值，所以这个正则表达式可以用来判断字符串中是否包含中文
:::
匹配中文就可以用:`/^[\u4e00-\u9fa5]/`
### String.match
会返回一个有数组对象，下标0表示你的正则全匹配的值，如果你有在正则里面添加分组的话，就有新增下标1、下标2。。。，一个()就是一个分组
![](../../../.vuepress/public/reg_01.png)

## NaN
::: tip NaN
NaN是全局属性，初始值就是NaN和Number.NaN的值是一样的，NaN和任何值都不相等，包括自身。可以通过x!==x来判断是否为NaN，为true就是NaN
:::
基本都没用到NaN，只是有时判断的时候有用到
```js
parseInt("blabla") // NaN
Math.sqrt(-2) // NaN
'A' - 'B' // NaN
1 + -'1' + 1 // 1 负号把'1'数字化了
Number('abc') // NaN
```
## &lt;img>的title和alt有什么区别
- title是global attributes之一，用于为元素提供附加的advisory information。通常当鼠标滑动到元素上的时候显示。
- alt是&lt;img>的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。（理解，可以自己讲出就好）
## 跨域的问题
::: tip 什么情况下会产生跨域
- 协议不相同
- 域名不相同
- 端口不相同
:::
满足其中一个就会产生跨域。<br>
跨域通信：js进行DOM操作、通信时如果目标与当前窗口不满足同源条件，浏览器为了安全会阻止跨域操作。跨域通信通常有以下方法：
### 解决跨域的方法
* cors:最普遍的就是CORS，就是后端允许我们的本地的请求地址或线上域名
* jsonp:不经常用，通过script标签无视同源策略来向后端发送参数，后端返回类似函数的形式传给前端，然后前端就是调用这个函数
```js
function jsonp(url, callback){
    window.getData = callback
    let script = document.createElement('script')
    script.setAttribute('src', `${url}?callbackName=getData`)
    document.body.appendChild(script)
}
```
然后这个script里面的值就是`<script>getData(data)</script>`
## js有哪几种方式里检查数据类型：
```js
let a = "cjh";
let b = 222;
let c= [1,2,3];
let d = new Date();
let e = function(){alert(111);};
let f = function(){this.name="22";};
```
### typeof
::: tip
*可以判断function的类型；在判断除Object类型的对象时比较方便*
不能区分array和object
:::
```js
alert(typeof a)   ------------> string
alert(typeof b)   ------------> number
alert(typeof c)   ------------> object => array
alert(typeof d)   ------------> object => new Date
alert(typeof e)   ------------> function
alert(typeof f)   ------------> function
```
### instanceof
::: tip
*后面一定要是对象类型，并且大小写不能错，该方法适合一些条件选择或分支*
挺好用的，就是要区分大小写，自己写继承类的时候用这个比较好。<br>
instanceof在对象直接继承和间接继承的都会报true。
:::
```js
alert(c instanceof Array) ---------------> true
alert(d instanceof Date)  ---------------> true
alert(f instanceof Function) ------------> true
alert(f instanceof function) ------------> false
```

对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`。
```js
let a = {}
Object[Symbol.hasInstance](a) // true
```
```js
class MyClass {
  // foo就是[1,2,3]
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
[1, 2, 3] instanceof new MyClass() // true
```
### constructor *构造器*
```js
alert(c.constructor === Array) ----------> true
alert(d.constructor === Date) -----------> true
alert(e.constructor === Function) -------> true
注意： constructor 在类继承时会出错
eg：
      function A(){};
      function B(){};
      A.prototype = new B(); //A继承自B
      var aObj = new A();
      alert(aobj.constructor === B) -----------> true;
      alert(aobj.constructor === A) -----------> false;
// 而instanceof方法不会出现该问题，对象直接继承和间接继承的都会报true：
      alert(aobj instanceof B) ----------------> true;
      alert(aobj instanceof B) ----------------> true;
// 言归正传，解决construtor的问题通常是让对象的constructor手动指向自己：
      aobj.constructor = A; //将自己的类赋值给对象的constructor属性
      alert(aobj.constructor === A) -----------> true;
      alert(aobj.constructor === B) -----------> false;
//基类不会报true了;不过规范一点的话，继承后必须把constructor指向它的父类
```
### prototype.toString
::: tip
*大小写不能写错，比较麻烦，但胜在通用*
:::
```js
alert(Object.prototype.toString.call(a) === ‘[object String]’) -------> true;
alert(Object.prototype.toString.call(b) === ‘[object Number]’) -------> true;
alert(Object.prototype.toString.call(c) === ‘[object Array]’) -------> true;
alert(Object.prototype.toString.call(d) === ‘[object Date]’) -------> true;
alert(Object.prototype.toString.call(e) === ‘[object Function]’) -------> true;
alert(Object.prototype.toString.call(f) === ‘[object Function]’) -------> true;
```
## WEB安全
### DNS欺骗攻击
::: tip DNS欺骗攻击
DNS欺骗就是攻击者冒充域名服务器的一种欺骗行为。 原理：如果可以冒充域名服务器，然后把查询的IP地址设为攻击者的IP地址，这样的话，用户上网就只能看到攻击者的主页，而不是用户想要取得的网站的主页了，这就是DNS欺骗的基本原理。DNS欺骗其实并不是真的“黑掉”了对方的网站，而是冒名顶替、招摇撞骗罢了
:::
例如更改电脑的host文件。
### DDOS攻击
::: tip
分布式拒绝服务(DDoS:Distributed Denial of Service)攻击指借助于客户/服务器技术，将多个计算机联合起来作为攻击平台，对一个或多个目标发动DDoS攻击，从而成倍地提高拒绝服务攻击的威力，通过大量互联网流量压倒目标或其周围的基础架构来破坏目标服务器，服务或网络的正常流量。DDoS攻击通过利用多个受损计算机系统作为攻击流量来源来实现有效性。被利用的机器可以包括计算机和其他网络资源，例如物联网设备。从高层次来看，DDoS攻击就像堵塞高速公路的交通堵塞，阻止了常规交通到达其所需的目的地。

由于简历TCP连接需要三次握手，DDOS会大量与服务器建立TCP半开连接（半开连接指的是没有完全三次握手的连接：SYN攻击利用TCP协议三次握手的原理，大量发送伪造源IP的SYN包也就是伪造第一次握手数据包，服务器每接收到一个SYN包就会为这个连接信息分配核心内存并放入半连接队列，如果短时间内接收到的SYN太多，半连接队列就会溢出，操作系统会把这个连接信息丢弃造成不能连接，当攻击的SYN包超过半连接队列的最大值时，正常的客户发送SYN数据包请求连接就会被服务器丢弃，每种操作系统半连接队列大小不一样所以抵御SYN攻击的能力也不一样）
:::
![](../../../.vuepress/public/ddos.jpeg)
DDoS攻击需要攻击者控制在线计算机网络才能进行攻击。计算机和其他计算机（如物联网设备）感染了恶意软件，将每个计算机转变为机器人（或僵尸）。然后，攻击者可以远程控制僵尸程序组，这称为僵尸网络。
### XSS

跨站脚步注入。xss攻击的主要目的是想办法获取目标攻击网站的cookie，因为有了cookie相当于有了session，有了这些信息就可以在任意能接进互联网的PC登陆该网站，并以其他人的身份登陆做破坏。预防措施防止下发界面显示html标签，把</>等符号转义。
### CSRF攻击
::: tip
CSRF（Cross-site request forgery）跨站请求伪造,跨站点伪装请求。csrf攻击的主要目的是让用户在不知情的情况下攻击自己已登录的一个系统，类似于钓鱼。如用户当前已经登陆了邮箱或bbs，同时用户又在使用另外一个，已经被你控制的网站，我们姑且叫它钓鱼网站。这个网站上面可能因为某个图片吸引你，你去点击一下，此时可能就会触发一个js的点击事件，构造一个bbs发帖的请求，去往你的bbs发帖，由于当前你的浏览器状态已经是登陆状态，所以session登陆cookie信息都会跟正常的请求一样，纯天然的利用当前的登陆状态，让用户在不知情的情况下，帮你发帖或干其他事情。预防措施，请求加入随机数，让钓鱼网站无法正常伪造请求。
:::
[CSRF攻击和防御](https://www.bilibili.com/video/av33502871?from=search&seid=1913949786887349692)
### SYN Flooding攻击
::: tip SYN Flooding攻击
由于 TCP基于连接的，为了在服务端和客户端之间传送TCP数据，必须先建立一个虚拟电路，也就是TCP连接，建立TCP连接的过程也就是我们熟悉的“三次握手”过程：首先，请求端（客户端）发送一个包含SYN标志的TCP报文，表示客户端欲发起通信连接；第二步，服务器在收到客户端的SYN报文后，将返回一个SYN+ACK的报文，表示客户端的请求被接受；第三步，客户端也返回一个确认报文ACK给服务器端，到此一个TCP连接完成。问题就出在TCP连接的三次握手中，假设一个用户向服务器发送了SYN报文后突然死机或掉线，那么服务器在发出SYN+ACK应答报文后是无法收到客户端的ACK报文的，这种情况下服务器端一般会重试（再次发送SYN+ACK给客户端）并等待一段时间后丢弃这个未完成的连接，这段时间的长度我们称为SYN Timeout，一般来说这个时间是分钟的数量级（大约为30秒-2分钟）；如果有一个恶意的攻击者大量模拟这种情况，服务器端将为了维护一个非常大的半连接列表而消耗非常多的资源，最终导致服务器端忙于处理攻击者伪造的 TCP 连接请求而无暇理睬客户的正常请求，此时从正常客户的角度看来，服务器失去响应，这种情况我们称作：服务器端受到了SYN Flooding攻击。
:::
## dom事件中target，currentTarget的区别
target:当前被涉及到的对象<br>
currentTarget:事件绑定的元素
## vue的双向绑定
::: tip
Object.defineProperty的getter和setter机制
:::
```js
//object.defineProperty()
var obj = new Object();
var value;
Object.defineProperty(obj,'name',{
    get: function () {
        console.log('get it');
        return value;//必须return一个值，作为name属性的值
    },
    set: function (newvalue) {
        console.log('set it');
        value = newvalue;//同步把value的值进行更新
    }
});
console.log(obj);
console.log(obj.name);//get it
obj.name = 1234;//set it
console.log(obj.name);//get it
```
 Vue3.0更新后，用ES6的proxy代替了Object.defineProperty。
 ## Array.prototype.sort
 Google Chrome 对 sort 做了特殊处理，对于长度 <= 10 的数组使用的是插入排序(稳定排序算法) ，length >10 的数组使用的是快速排序。快速排序是不稳定的排序算法。

[详解文章](https://segmentfault.com/a/1190000010648740)
## 闭包
::: tip 闭包
变量的作用域与非就是两种：全局变量、局部变量<br>
函数内部可以直接读取全局变量<br>
作用：使私有变量（局部变量）能够转换被多个函数共享，而不被能解析器从内存中释放掉
:::

## 编写一个Javascript函数，传入一个数组，对数组中的元素进行去重并返回一个无重复元素的数组，数组的元素可以是数字、字符串、数组和对象。举例说明：
::: tip
1. 如传入的数组元素为[123, "meili", "123", "mogu", 123],则输出：[123, "meili", "123", "mogu"]
2. 如传入的数组元素为[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"],则输出：[123, [1, 2, 3], [1, "2", 3], "meili"]
3. 如传入的数组元素为[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"],则输出：[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
:::
```js
Array.prototype.unique = function(){
  let hash = new Map()
  let result = []
  let item
  for (let i = 0; i < this.length; i++) {
    console.log(Object.prototype.toString.call(this[i]))
    if (Object.prototype.toString.call(this[i]) === '[object Object]'
      || Object.prototype.toString.call(this[i]) === '[object Array]') {
      item = JSON.stringify(this[i])
    } else {
      item = this[i]
    }
    if (!hash.has(item)) {
      hash.set(item, true)
      result.push(this[i])
    }
  }
  return result
}
```

## ===和==运算符判断相等的流程是怎样的
### ===
- 如果两个值不是相同类型，它们不相等
- 如果两个值都是null或者都是undefined，它们相等
- 如果两个值都是布尔类型true或者都是false，它们相等
- 如果其中有一个是NaN，它们不相等
- 如果都是数值型并且数值相等，他们相等， -0等于0
- 如果他们都是字符串并且在相同位置包含相同的16位值，他它们相等；
- 如果在长度或者内容上不等，它们不相等；两个字符串显示结果相同但是编码不同==和===都认为他们不相等
- 如果他们指向相同对象、数组、函数，它们相等；如果指向不同对象，他们不相等
### ==
- 如果两个值类型相同，按照===比较方法进行比较
- 如果类型不同，使用如下规则进行比较
- 如果其中一个值是null，另一个是undefined，它们相等
- 如果一个值是数字另一个是字符串，将字符串转换为数字进行比较
- 如果有布尔类型，将true转换为1，false转换为0，然后用==规则继续比较
- 如果一个值是对象，另一个是数字或字符串，将对象转换为原始值然后用==规则继续比较
- 其他所有情况都认为不相等

### Object.js和===
Object.is() 判断两个值是否相同。如果下列任何一项成立，则两个值相同：
* 两个值都是`undefined`
* 两个值都是null
* 两个值都是`true`或都是`false`
* 两个值是由相同个数的字符相同的顺序组成的字符串
* 两个值指向同一个对象
* 两个值都是数字并且
 * 都是正零`+0`
 * 都是正零`-0`
 * 都是`NaN`
 * 都是除零和NaN外的

结论：

这与 === 运算符的判定方式也不一样。=== 运算符（和== 运算符）将数字值 -0 和 +0 视为相等，并认为 Number.NaN 不等于 NaN。

## async/await
::: tip
为什么要使用async/await，常用promise（当你没有彻底理解promise，请先看这篇文章）的人都知道每次都需要写`new Promise()`，代码整体看起来没那么优雅，但是两个作用都是一样的，都是处理异步操作。
:::
先看一段Promise的用法

``` js
function timeout(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('timeout',ms)
			resolve('我是传递的信息')
		}, ms);
	});
}

function print (value, ms) {
	return new Promise((resolve, reject) => {
		timeout(ms).then(v => {
			resolve(v)
		})
	});
}

print('hello', 2000).then(v => {
	console.log('print', v)
})
```
两秒后出现输出一下结果:
```
timeout 2000
print 我是传递的信息
```
现在我们用async来代替上面print函数的代码

``` js
function timeout(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('timeout',ms)
			resolve('我是传递的信息')
		}, ms);
	});
}

async function print (value, ms) {
	let msg = await timeout(2000)
	return msg
}

print('hello', 2000).then(v => {
	console.log('print', v)
})
```
输出的结果和执行的过程都是一样的，但是代码简便了很多
## null && undefined
::: tip
在JavaScript规范中提到，要比较比较相等之前，不能将nullundefined转换成其他任何值，并且规定null和undefined是相等。null和undefined都代表无效的值。
:::
全等于状态下，是false，这个很好理解了。它们不属于同一类型数据。
```js
console.log( undefined === null ) // false
typeof null        //object
typeof undefined       //undefined
```
## Number && parseInt && parseFloat
### Number
如果是Boolean值，true和false值将分别被转换为1和0。<br/>
如果是数字值，只是简单的传入和返回。<br/>
如果是null值，返回0。<br/>
如果是undefined，返回NaN。<br/>
如果是字符串：<br/>
* 如果字符串中只包含数字时，将其转换为十进制数值，即“1”变成1，“123”变成123，而“011”会变成11
* 如果字符串中包含有效的浮点格式，如“1.1”，则将其转换为对应的浮点数值
* 如果字符串中包含有效的十六进制格式，例如“0xf”，则将其转换为相同大小的十进制整数值
* 如果字符串是空的（不包含任何字符），则将其转换为0
* 如果字符串中包含除上述格式之外的字符，则将其转换成NaN
### parseInt
在转换字符串时，更多的是看是否符合数值模式。会忽略字符串前面的空格，直至找到第一个非空格字符。
* 如果第一个字符不是数字字符或负号，`parseInt()`就会返回NaN，也就是说用`parseInt()`转换空字符时会返回NaN
* 如果第一个字符串是数字字符，parseInt()会继续解析第二个字符，直到解析完所有后续字符或者遇到一个非数字字符。例如，“123blue”会被转换为123，因为“blue”会被完全忽略，类似低“22.5”会被转换成22，因为小数点不是有效数字字符
* 如果字符串以“0x”开头且后跟数字字符，就会将其当作一个十六进制整数
* 如果字符串以“0”开头且后跟数字字符，就会将其当作一个八进制整数
* parseInt()函数增加了第二参数用于指定转换时使用的基数（即多少进制）
`parseInt("10",16)//按十六进制解析`
`parseInt("10",8)//按八进制解析`
### parseFloat
与parseInt类似，parseFloat也是con第一个字符开始解析每个字符，而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符。也就是说，字符串的第一个小数点是有效的，而第二个小数点就是无效的，因此它后面的字符串将被忽略。例如“22.34.5”将会转换为22.34。<br/>
除了第一个小数点有效之外，parseFloat与parseInt的第二个区别在与它始终都会忽略前导的零。<br/>
parseFloat()只解析十进制值，因此它没有用第二个参数指定基数的用法。
```js
var num1=parseFloat("1234blue");  //1234

var num2=parseFloat("0xA");                  //0

var num3=parseFloat("0908.5");      //908.5

var num4=parseFloat("3.125e7");             //31250000
```
::: tip
ECMAScript定义了isNaN()函数。这个函数接受一个参数，该参数可以是任何类型，而函数会帮我们确定这个参数是否“不是数值”。isNaN()在接收到一个值之后，会尝试将这个值转换为数值。不能转换为数值的参数会返回true。
:::

## Event Loop
::: tip
在`JavaScript`中，任务被分为两种，一种宏任务（MacroTask）也叫Task，一种叫微任务（MicroTask）。JS会创建一个类似while(true)的循环，每执行一次循环体的过程称之为Tick。每次Tick的过程就是查看是否有待处理事件，如果有则取出相关事件及回调函数放入执行栈中有主线程执行。待处理的事件会存储在一个任务队列中，也就是每次Tick会查看任务队列中是否有需要执行的任务。

异步操作会将相关回调添加到任务队列中。而不同的异步操作添加到任务队列的时机也不同，如onClick、setTimeout、ajax处理的方式都不同，这些异步操作是由浏览器内核的`webcore`来执行的，`webcore`包含`DOM Binding`、`network`、`timer`模块

比如: onClick由浏览器内核的DOM Binding模块来处理，当事件触发的时候，回调函数会立即添加到任务队列中。
:::
### MacroTask（宏任务）
`script`全部代码、setTimeout、setINterval、I/0、UI Rendering、setImmediate
### MicroTask（微任务）
Process.nextTick（Node独有）、Promise、MutationObserver（具体使用方式[查看](http://javascript.ruanyifeng.com/dom/mutationobserver.html)）
### 浏览器中的Event Loop
JS有一个`main thread`主线程和`call-stack`调用栈（执行栈），所有的任务都会被放到调用栈等待主线程执行。
### JS调用栈
JS调用栈采用的是后进先出的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。
![](../../../.vuepress/public/event_loop1.png)
### 同步任务和异步任务
`JS`单线程任务被分为同步任务和异步任务，同步任务会在调用栈按照顺序等待主线程依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。

任务队列`Task Queue`，是一种先进先出的数据结构。
![](../../../.vuepress/public/event_loop2.png)
* 选择当前要执行的任务队列，选择任务队列中最先进进入的任务，如果任务队列为空时，则执行跳转到微任务(MicroTask)的执行步骤。
* 将事件循环中的任务设置为已选择任务。
* 执行任务
* 将事件循环中当前运行任务设置null
* 将已经运行完成的任务从任务队列在删除。
* MicroTasks步骤：进入MicroTask检查点
* 更新页面渲染（人工赋值）
* 返回第一步
**举个例子**
```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
console.log('script end');
```
打印结果：
```
script start =》 先执行宏任务中script
script end =》 先执行宏任务中script
promise1 =》 再执行微任务中的promise,执行完又将then推到微任务
promise2  =》 检查微任务队列，再次执行微任务
setTimeout =》 微任务为空回来执行宏任务
```

**再来看个例子**
```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
Promise.resolve().then(function() {
  console.log('promise11');
}).then(function() {
  console.log('promise22');
});
console.log('script end');
```
打印结果：
```
script start =》 先执行宏任务中script

script end =》 先执行宏任务中script

promise1 =》 再执行微任务中的promise，然后将then再次推到微任务队列

promise11 =》 promise11在promise2的前面是因为，执行完promise1才会执行then，而promise11是一开始就和promise1一起放在微任务队列的
promise2
promise22
setTimeout =》 微任务为空回来执行宏任务
```

**再来看个例子**
```js
let onePromise = new Promise((resolve, reject) => {
  console.log('请求数据...')
  setTimeout(() => {
    reject(1)
  }, 100);
})
// 同步代码执行到这里时 twoPromise的状态为pending
const twoPromise = onePromise.then(res => {
  console.log(myPromise)
  return 2
})
twoPromise.catch(error => {
  console.log('catch', error)
})
onePromise.catch(error => {
  console.log('another', error)
})
```
代码从头执行到尾：
1. 执行到`new Promise`时直接里面的函数，打印`console.log('请求数据...')`，将`setTimeout`放入`宏队列`['setTimeout']
2. 执行`onePromise.then`，将函数放入onePromise的resolve状态队列中
3. 执行到`twoPromise.catch`，将函数放入twoPromise的reject状态队列中
4. 执行到`onePromise.catch`，将函数放入onePromise的reject状态队列中
5. 执行宏任务队列中['setTimeout']的setTimeout，执行reject(1)，
6. 导致`onePromise`状态改变为rejected，执行reject状态队列，也就是执行`onePromise.catch`，把`console.log('another', error)`放入微队列中，此时twoPromise的状态也随着onePromise的改变过渡过来，
7. twoPromise的状态改变后触发reject状态队列，把`twoPromise.catch`放入微队列中。
8. 执行微队列中的任务
执行结果：
```js
请求数据...
another 1
catch 1
```

## 形参&&默认参数
函数作用域里面优先找变量
```js
const data = {test:1}
function test(data) {
    console.log(data)
}
test() // undefined
```

`data={...data}`相当于`let a = a`导致定义`a`变量时同时赋值`a`变量所以会报错
```js
const data = {test:1}
function test(data={...data}) {
    console.log(data)
}
test() // {...data} => data is not defined
```

默认参数相当于是赋值，向上函数外面寻找变量
```js
const data = {test:1}
function test(x={...data}) {
    conso
    console.log(x)
}
test() // { test: 1 }
```

## JS中的捕获和冒泡
::: tip Dom事件流
don事件流分成三个阶段：

捕获阶段：通过从目标的祖先中的事件对象传播窗口到目标的父。此阶段也称为捕获阶段。

目标阶段：本次活动对象到达事件对象的事件的目标。此阶段也称为目标阶段。如果事件类型指示事件不会冒泡，则事件对象将在此阶段完成后停止。

气泡阶段：通过以相反的顺序目标的祖先中的事件对象传播，开始与目标的父和与所述结束窗口。此阶段也称为冒泡阶段。
:::
捕获阶段：首先只有在`addEventListener`的第三个参数为true时才能触发事件捕获，从当前设置的true的元素，一直往下找并且触发同类型事件。

目标阶段： 捕获一直往下找，直到当前点击的元素。

冒泡阶段：执行完目标本身事件后就开始冒泡阶段，冒泡事件是比较常见的，因为默认`addEventListener`的第三个参数为false，所以平常的所写的ele.onclick事件都是默认冒泡的，冒泡就是从当前点击的元素一级一级往上同类型的事件并且触发。

看个例子：
```html
  <div id="div1">
    <div id="div2">
      <button id="button1">click me</button>
    </div>
  </div>
  <script>
    　　var div = document.getElementById("div1");
      var btn = document.getElementById("button1");
      var div2 =  document.getElementById("div2");
      div.addEventListener("click", function () {  alert("1 div1"); }, true);
      div.addEventListener("click", function () { alert("2 div1"); }, false);
      div2.addEventListener("click", function () { alert("1 div2"); }, false);
      btn.onclick = function() {
        alert("1 button");
      }
      btn.addEventListener("click", function () { alert("2 button"); }, false);
  </script>
```
::: tip 点击按钮后，结果：
捕获阶段：1 div1
目标阶段：1 button -> 2 button
冒泡阶段：1 div2 -> 2 div1
:::
让我们再改改`addEventListener`的第三个参数:
```html
  <div id="div1">
    <div id="div2">
      <button id="button1">click me</button>
    </div>
  </div>
  <script>
    　var div = document.getElementById("div1");
      var btn = document.getElementById("button1");
      var div2 =  document.getElementById("div2");
      div.addEventListener("click", function () {  alert("1 div1"); }, true);
      div.addEventListener("click", function () { alert("2 div1"); }, false);
      div2.addEventListener("click", function () { alert("1 div2"); }, true);
      btn.onclick = function() {
        alert("1 button");
      }
      btn.addEventListener("click", function () { alert("2 button"); }, true);
  </script>
```
::: tip 点击按钮后，结果：
捕获阶段：1 div1 -> 1 div2
目标阶段：1 button -> 2 button  // 到了目标阶段，也就是`target`本身，不管`useCapture`是否为true，都不能提升代码中顺序事件的触发
冒泡阶段：2 div1
:::
## seal && freeze && preventExtensions
### Object.seal
::: tip
`Object.seal`方法可以密封对象，从而防止向其添加新属性，并将所有现有属性标记为**不可配置**，只要可写，当前属性的值仍可以更改。所以还是可以在`__proto__`添加属性。
:::
返回值:
被密封的对象。
例子：
```js
const object1 = {
  property1: 42
};

Object.seal(object1);
object1.property1 = 33;
console.log(object1.property1);
// expected output: 33

delete object1.property1; // cannot delete when sealed
console.log(object1.property1);
// expected output: 33

let bb = new Object()
Object.seal(bb)
bb.__proto__.test = 1
console.log(Object.prototype.test)
//expected output: 1
```
### Object.freeze
::: tip
冻结的对象无法再更改。冻结对象可防止向其添加新属性、删除现有属性、更改现有属性的可枚举性，可配置或可写性、更改现有属性的值。之外，冻结对象还可以防止更改其原型（`__proto__`不能被更改）。
:::
返回值:<br>
被冻结的对象（与传入值一样）。<br>
例子：<br>
```js
const obj = {
  prop: 42
};
Object.getOwnPropertyDescriptor(obj, 'prop')
// expected output:
// configurable: true
// enumerable: true
// value: 42
// writable: true
Object.freeze(obj);
Object.getOwnPropertyDescriptor(obj, 'prop')
// expected output:
// configurable: false
// enumerable: true
// value: 42
// writable: false
obj.prop = 33;
// Throws an error in strict mode
obj.test = 1

console.log(obj.test)
// expected output: undefined

console.log(obj.prop);
// expected output: 42

obj.__proto__ = {test:1}
// expected output: Uncaught TypeError: #<Object> is not extensible
```


### Object.preventExtensions
::: tip
防止将新属性添加到对象
:::
例子：
```js
const object1 = {};

Object.preventExtensions(object1);

try {
  Object.defineProperty(object1, 'property1', {
    value: 42
  });
} catch (e) {
  console.log(e);
  // Expected output: TypeError: Cannot define property property1, object is not extensible
}
```
### 结论
* Object.seal: 防止向其添加新属性，并将所有现有属性标记为不可配置
* Object.freeze: 止向其添加新属性、删除现有属性、更改现有属性的可枚举性，可配置或可写性、更改现有属性的值,`__proto__`也不让更改
* Object.preventExtensions: 防止向其添加新属性

那么可以用`Object.isExtensible()`判断是否可以为其添加新属性，不要是不可扩展的就会返回`false`

## 伪类&&伪元素
### 伪类
::: tip
1. 伪类存在的意义是为了通过选择器找到那些不存在与DOM树中的信息以及不能被常规CSS选择器获取到的信息。
2. 伪类由一个冒号:开头，冒号后面是伪类的名称和包含在圆括号中的可选参数。
3. 任何常规选择器可以再任何位置使用伪类。伪类语法不区别大小写。一些伪类的作用会互斥，另外一些伪类可以同时被同一个元素使用。并且，为了满足用户在操作DOM时产生的DOM结构改变，伪类也可以是动态的。
:::

### 伪元素
::: tip
1. 伪元素在DOM树中创建了一些抽象元素，这些抽象元素是不存在于文档语言里的，比如：document接口不提供访问元素内容的第一个字或者第一行的机制，而伪元素可以使开发者可以提取到这些信息。并且，一些伪元素可以使开发者获取到不存在于源文档中的内容（比如常见的::before,::after）。
2. 伪元素的由两个冒号::开头，然后是伪元素的名称。
3. 使用两个冒号`::`是为了区别伪类和伪元素（CSS2中并没有区别）。当然，考虑到兼容性，CSS2中已存的伪元素仍然可以使用一个冒号`:`的语法，但是CSS3中新增的伪元素必须使用两个冒号`::`。
:::

## JSON.parse
::: tip
参数:
1. text： 要被解析成JavaScript值的字符串，关于JSON的语法格式
2. reviver：转换器, 如果传入该参数(函数)，可以用来修改解析生成的原始值，调用时机在parse函数返回之前。注意：解析值本身以及它所包含的所有属性，会按照一定的顺序（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本省）
:::
例子：
```js
JSON.parse('[1, 2, 3, 4]', function (k, v) {
	console.log('k', k, 'v',v)
    if(k === '') return v;     // 如果到了最顶层，则直接返回属性值，
    return v * 2;              // 否则将属性值变为原来的 2 倍。
});
// Expected output
// k 0 v 1
// 2 k 1 v 2
// 2 k 2 v 3
// 2 k 3 v 4
// 2 k  v (4) [2, 4, 6, 8]
JSON.parse('{"p": 5}', function (k, v) {
	console.log('k', k, 'v',v)
    if(k === '') return v;     // 如果到了最顶层，则直接返回属性值，
    return v * 2;              // 否则将属性值变为原来的 2 倍。
});
// Expected output
// k p v 5
// 2 k  v {p: 10}
{p: 10}
JSON.parse('{"p":{"test":1}}', function (k, v) {
	console.log('k', k, 'v',v)
    return v;
});
// Expected output
// k test v 1
// k p v {test: 1}
// k  v p: {test: 1}
```
## JSON.stringify
::: tip
参数：
1. value：将要序列化成一个JSON字符串的值
2. replacer(可选)：如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为null或者未提供，则对象所有的属性都会被序列化；
3. space(可选)：指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格。如果该参数没有提供（或者为null）将没有空格。
:::
例子：
```js
function replacer(key, value) {
  console.log('key', key, 'value', value)
  return value;
}

let foo = { foundation: "Mozilla", model: "box", month: 7 }
JSON.stringify(foo, replacer)
// 可以看出来JSON.stringify是从外层向内层进行遍历的，而JSON.parse是从最内层开始往外遍历
// Expected output
// key  value { foundation: 'Mozilla', model: { test: 1 }, month: 7 }
// key foundation value Mozilla
// key model value { test: 1 }
// key test value 1
// key month value 7
```
如果replacer是一个数组，数组的值代表将被序列化成JSON字符串的属性名。

```js
let replacer = ['foundation', 'model']

let foo = { foundation: "Mozilla", model: "box", month: 7 }

console.log(JSON.stringify(foo, replacer))
// 只保留'foundation'和'model'属性值。
// Expected output
// {"foundation":"Mozilla","model":"box"}
```
如果一个被序列化的对象拥有 toJSON 方法，那么该 toJSON 方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用 toJSON 方法后的返回值会被序列化
```js
var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  }
};
JSON.stringify(obj);      // '"bar"'
JSON.stringify({x: obj}); // '{"x":"bar"}'
```

## 浏览器缓存
::: tip
强缓存：不与服务器沟通，直接拿浏览器本地的缓存使用：expires、Cache-Control:max-age
协商缓存：与服务器沟通，对比hash或者时间，看看是否要取浏览器本地的数据：ETag,Last-Modify
:::
### Last-Modify
::: tip
`Last-Modified`是一个响应头部，其中包含源头服务器认定的资源做出修改的日期及时间。 它通常被用作一个验证器来判断接收到的或者存储的资源是否彼此一致。由于精确度比`ETag`要低（因为日期只能精确到秒，而服务器更改文件可以在一秒内更改多次），所以这是一个备用机制。包含有`If-Modified-Since`或`If-Unmodified-Since`首部的条件请求会使用这个字段。
::
在server端我们还需要加上头Last-Modified。收到带Last-Modified这个头，下次浏览器发送request就会带上If-Modified-Since或者If-Unmodified-Since，服务器收到这个request的If-Modified-Since后，通过读取它的值对比资源存在的地方的Last-Modified，服务器就告诉浏览器是否可以使用缓存。
### Expires
无效的日期，比如 0, 代表着过去的日期，即该资源已经过期。

如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。
### Cache-Control
经常用的以下指令：
#### no-cache
在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证。比如响应头的`ETag`和客户端发送的`If-None-Match`字段互相校验判断是否是304状态。
#### no-store
缓存不应存储有关客户端请求或服务器响应的任何内容。就是每次都是请求服务器的数据。
#### max-age=<`seconds`>
设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。与Expires相反，时间是相对于请求的时间。会覆盖Expires属性。

### ETag
::: tip
ETagHTTP响应头是资源的特定版本的标识符。这可以让缓存更高效，并节省带宽，因为如果内容没有改变，Web服务器不需要发送完整的响应。而如果内容发生了变化，使用ETag有助于防止资源的同时更新相互覆盖（“空中碰撞”）
:::
Etag是一个更加严格的验证，它是根据文件的内容生成Etag（数据签名，最常用做法是对资源内容进行哈希计算），收到带Etag这个头，下次浏览器发送request就会带上If-Match或者If-Non-Match，服务器收到这个request的上If-Match或者If-Non-Match后，通过读取它的值对比资源存在的地方的Etag，服务器就告诉浏览器是否可以使用缓存





