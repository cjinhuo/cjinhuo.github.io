---
title: '前端监控:JS监控SDK手摸手教学-实现篇(已开源)'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2021-10-12
tags:
- SDK
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**

# 概要

已开源的前端监控SDK:[mitojs](https://github.com/mitojs/mitojs)，有兴趣的小伙伴可以去瞅瞅~

来到正文，本文分成四个部分

* 背景
* 前端监控的原理
* 结尾

# 背景
上一篇[前端监控:监控SDK手摸手Teach-架构篇(已开源)](./sdk-architecture.md)讲的是SDK的整体架构，这篇讲的是监控代码实现，也就是插件里面代码的实现

# 前端监控的原理
监控原生事件，如果不支持`addEventListener`，那么就是重写原生函数拿到入参，再将原函数返回。
## replaceOld
我们需要重写很多原生函数，预先定义一个公共函数便于减少冗余代码

```js
/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} [isForced=false] 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced = false): void {
  if (source === undefined) return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }
}
```
## fetch
所有的请求第三方库都是基于`xhr`、`fetch`二次封装的，只需要重写这两个事件就可以拿到所有的接口请求的信息。举个例子，重写`fetch`的代码操作：

```js
replaceOld(_global, BrowserEventTypes.FETCH, (originalFetch: voidFun) => {
  return function (url: string, config: Partial<Request> = {}): void {
    const sTime = getTimestamp()
    const method = (config && config.method) || 'GET'
    // 收集fetch的基本信息
    const httpCollect: HttpCollectedType = {
      request: {
        httpType: HttpTypes.FETCH,
        url,
        method,
        data: config && config.body
      },
      time: sTime,
      response: {}
    }
    const headers = new Headers(config.headers || {})
    Object.assign(headers, {
      setRequestHeader: headers.set
    })
    return originalFetch.apply(_global, [url, config]).then(
      (res: Response) => {
        // 需要克隆一下对象，不然会被标记该对象已经被使用过
        const resClone = res.clone()
        const eTime = getTimestamp()
        httpCollect.elapsedTime = eTime - sTime
        httpCollect.response.status = resClone.status
        resClone.text().then((data) => {
          // 收集响应体
          httpCollect.response.data = data
          // 收集到需要的数据 notify函数用来通知订阅中心
          notify(BrowserEventTypes.FETCH, httpCollect)
        })
        return res
      },
      (err: Error) => {
        const eTime = getTimestamp()
        httpCollect.elapsedTime = eTime - sTime
        httpCollect.response.status = 0
        // 收集到需要的数据 notify函数用来通知订阅中心
        notify(BrowserEventTypes.FETCH, httpCollect)
        throw err
      }
    )
  }
})
```
**关于接口跨域、超时的问题**：这两种情况发生的时候，接口返回的响应体和响应头里面都是空的，`status`等于0，所以很难区分两者，但是正常情况下，一般项目中都的请求都是复杂请求，所以在正式请求会先进行`option`进行预请求，如果是跨域的话基本几十毫秒就会返回来，可以以此作为临界值来判断跨域与超时的问题（如果是接口不存在也会被判断成接口跨域）。


上面代码就是重写`fetch`的基本操作，拿到收集到数据后就可以做一步数据处理，数据下面再讲。同理可得**以下列表**的重写方式都是如此，重写的过程中拿到入参并收集到你想要的数据，具体代码实现点击下面的链接

1. [console](https://github.com/mitojs/mitojs/tree/master/packages/browser/src/plugins/console.ts)
2. [xhr](https://github.com/mitojs/mitojs/tree/master/packages/browser/src/plugins/xhr.ts)
3. [onpopstate、pushState、replaceState](https://github.com/mitojs/mitojs/blob/master/packages/browser/src/plugins/historyRoute.ts)

## onerror
`onerror`是可以通过`addEventListener`来监听的，当出现资源错误或代码错误时会触发该回调函数
```js
/**
 * 添加事件监听器
 *
 * @export
 * @param {{ addEventListener: Function }} target 目标对象
 * @param {TotalEventName} eventName 目标对象上的事件名
 * @param {Function} handler 回调函数
 * @param {(boolean | unknown)} [opitons=false] useCapture默认为false
 */
function on(
  target: { addEventListener: Function },
  eventName: TotalEventName,
  handler: Function,
  opitons: boolean | unknown = false
): void {
  target.addEventListener(eventName, handler, opitons)
}
on(
  _global,
  'error',
  function (e: ErrorEvent) {
    // 收集到需要的数据 notify函数用来通知订阅中心
    notify(BrowserEventTypes.ERROR, e)
  },
  true
)
```
同理可得**以下列表**的监听方式都是如此：

1. [click](https://github.com/mitojs/mitojs/tree/master/packages/browser/src/plugins/dom.ts)
2. [hashchange](https://github.com/mitojs/mitojs/tree/master/packages/browser/src/plugins/hashRoute.ts)
3. [unhandlerejecttion](https://github.com/mitojs/mitojs/tree/master/packages/browser/src/plugins/unhandlerejecttion.ts)

## Vue2 和 Vue3的错误
`Vue`提供了一个函数`errorHandler`供开发者来获取框架层面的错误，所以直接重写该方法并拿到入参即可
```js
const originErrorHandle = Vue.config.errorHandler
Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
  const data: ReportDataType = {
    type: ErrorTypes.VUE,
    message: `${err.message}(${info})`,
    level: Severity.Normal,
    url: getUrlWithEnv(),
    name: err.name,
    stack: err.stack || [],
    time: getTimestamp()
  }
  notify(BaseEventTypes.VUE, { data, vm })
  const hasConsole = typeof console !== 'undefined'
  // vue源码会判断Vue.config.silent，为true时则不会在控制台打印，false时则会打印
  if (hasConsole && !Vue.config.silent) {
    silentConsoleScope(() => {
      console.error('Error in ' + info + ': "' + err.toString() + '"', vm)
      console.error(err)
    })
  }
  return originErrorHandle?.(err, vm, info)
}
```

当然Vue2和Vue3拿到的数据格式是不一样的，具体的处理逻辑可以[点击这里](https://github.com/mitojs/mitojs/blob/master/packages/vue/src/vuePlugin.ts)


## react的错误
React16.13中提供了[componentDidCatch](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch)钩子函数来回调错误信息，所以我们可以新建一个类`ErrorBoundary`来继承React，然后然后声明`componentDidCatch`钩子函数，可以拿到错误信息

```js
interface ErrorBoundaryProps {
  fallback?: ReactNode
  onError?: (error: Error, componentStack: string) => void
}

interface ErrorBoundaryState {
  hasError?: boolean
}
class ErrorBoundaryWrapped extends PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  readonly state: ErrorBoundaryState
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false
    }
  }
  componentDidCatch(error: Error, { componentStack }: ErrorInfo) {
    // error 和 componentStack就是我们需要的错误信息
    const { onError } = this.props
    const reactError = extractErrorStack(error, Severity.Normal)
    reactError.type = ErrorTypes.REACT
    onError?.(error, componentStack)
    this.setState({
      hasError: true
    })
  }
  render() {
    return (this.state.hasError ? this.props.fallback : this.props.children) ?? null
  }
}
```

然后将组件抛出来，具体的[代码实现](https://github.com/mitojs/mitojs/blob/master/packages/react/src/components/ErrorBoundary.tsx)


## 插件
实现差不多就这了，具体代码可以去[仓库](https://github.com/mitojs/mitojs/tree/master/packages)里面看看，上一篇[前端监控:监控SDK手摸手Teach-架构篇(已开源)]((./sdk-architecture.md))中有讲过插件这个概念，插件是用来规范代码分层的一个思想，在指定的区域编写指定功能的代码，可读性和可迭代性会大大提高
```js
export interface BasePluginType<T extends EventTypes = EventTypes, C extends BaseClientType = BaseClientType> {
  // 事件枚举
  name: T
  // 监控事件，并在该事件中用notify通知订阅中心
  monitor: (this: C, notify: (eventName: T, data: any) => void) => void
  // 在monitor中触发数据并将数据传入当前函数，拿到数据做数据格式转换(会将tranform放入Subscrib的handers)
  transform?: (this: C, collectedData: any) => any
  // 拿到转换后的数据进行breadcrumb、report等等操作
  consumer?: (this: C, transformedData: any) => void
}
```

那么上面的**重写逻辑**就放在`monitor`层，可以看出来有个入参`notify`，它是用通知订阅中心的，让我们看个简单且完整的例子（[具体代码点击这里](https://github.com/mitojs/mitojs/blob/master/packages/browser/src/plugins/dom.ts)）：
```js
const domPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.DOM,
  // 监听事件
  monitor(notify) {
    if (!('document' in _global)) return
    // 添加全局click事件
    on(
      _global.document,
      'click',
      function () {
        notify(BrowserEventTypes.DOM, {
          category: 'click',
          data: this
        })
      },
      true
    )
  },
  // 转换数据
  transform(collectedData: DomCollectedType) {
    /**
     * 返回包含id、class、innerTextde字符串的标签
     * @param target html节点
     */
    function htmlElementAsString(target: HTMLElement): string {
      const tagName = target.tagName.toLowerCase()
      let classNames = target.classList.value
      classNames = classNames !== '' ? ` class="${classNames}"` : ''
      const id = target.id ? ` id="${target.id}"` : ''
      const innerText = target.innerText
      return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`
    }
    // 将拿到的数据activeElement转换成类似<button class="btn-one">click me</button>
    const htmlString = htmlElementAsString(collectedData.data.activeElement as HTMLElement)
    return htmlString
  },
  // 消费已转换的数据
  consumer(transformedData: string) {
    // 转换后的数据添加到用户行为栈 breadcrumb中
    addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.CLICK)
  }
}
```
## 使用插件
定义完插件后，需要在browserClient初始化的时候使用这些插件([具体代码点击这里](https://github.com/mitojs/mitojs/blob/master/packages/browser/src/browserClient.ts)):
```js
  const browserClient = new BrowserClient(options)
  const browserPlugins = [
    fetchPlugin,
    xhrPlugin,
    domPlugin,
    errorPlugin,
    hashRoutePlugin,
    historyRoutePlugin,
    consolePlugin,
    unhandlerejectionPlugin
  ]
  browserClient.use([...browserPlugins, ...plugins])
```

## browserClient.use
`browserClient`是继承与`BaseClient`，`BaseClient`中有个`use`的方法，用来构建插件的hooks顺序[具体代码实现](https://github.com/mitojs/mitojs/blob/master/packages/core/src/baseClient.ts)

```js
  /**
   * 引用插件
   *
   * @param {BasePluginType<E>[]} plugins
   * @memberof BaseClient
   */
  use(plugins: BasePluginType<E>[]) {
    if (this.options.disabled) return
    // 新建发布订阅实例
    const subscrib = new Subscrib<E>()
    plugins.forEach((item) => {
      if (!this.isPluginEnable(item.name)) return
      // 调用插件中的monitor并将发布函数传入
      item.monitor.call(this, subscrib.notify.bind(subscrib))
      const wrapperTranform = (...args: any[]) => {
        // 先执行transform
        const res = item.transform?.apply(this, args)
        // 拿到transform返回的数据并传入
        item.consumer?.call(this, res)
        // 如果需要新增hook，可在这里添加逻辑
      }
      // 订阅插件中的名字，并传入回调函数
      subscrib.watch(item.name, wrapperTranform)
    })
  }
```

## 插件运行流程
那么整体的流程大概如下图所示：

![](https://files.catbox.moe/jjgdzq.png)

# 结尾

## 🤔 小结
监控的原理无非就是重写（将原有的基础上包裹一层）或者添加事件监听器，例如小程序的监控也是如此。

下一篇「监控SDK手摸手Teach-微信小程序篇」会讲在微信小程序中怎么实现事件埋点、错误监控，敬请期待~


## 🧐 开源

监控SDK[mitojs文档](https://mitojs.github.io/mito-doc/#/sdk/guide/introduction)，目前有部分人在用[mitojs](https://github.com/mitojs/mitojs)在做自己的监控平台或者埋点相关业务，如果你感兴趣可以，不妨过来瞅瞅 😘


## 📞 联系&内推

字节架构前端大量招人，内推可帮助修改简历和实时查询面试进度，欢迎砸简历到我的**邮箱:chenjinhuo@bytedance.com**

如果你对字节架构前端、错误监控、埋点感兴趣、也直接联系我的**微信:cjinhuo**

**Have A Good Day!!!**






