---
title: 'React深入'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2021-04-01
# 时间
tags:
- 模板
---

::: tip 概述
从源码了解React
:::

<!-- more -->


## React深入

### babel插件转换JSX
如果是大写开头那么会被编译成变量，如果是小写开头就会被编译成字符串
```js
function Comp(){
	return <div>12</div>
}

<Comp>
  <div>123</div>
</Comp>

// babel
"use strict";

function Comp() {
  return /*#__PURE__*/React.createElement("div", null, "12");
}

/*#__PURE__*/
React.createElement(Comp, null, /*#__PURE__*/React.createElement("div", null, "123"));
```

```js
<div>123</div>
// babel
"use strict";

/*#__PURE__*/
React.createElement("div", null, "123");
```

### React.memo
默认情况下，只会做浅层比较，如果想控制对比过程，可以传入第二个参数：比较函数，return`true`不更新渲染，return`false`更新渲染
```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

### 封装原生input
```js
import React, { useLayoutEffect, useRef } from 'react'
import { useEffect } from 'react'

interface PropsType {
  defaultValue?: string
  value?: string
  onChange?: (str: string) => void
}
const MyInput = (props: PropsType) => {
  const { defaultValue, value, onChange } = props
  const inputRef = useRef(null)
  function setValueToInput(val: string) {
    inputRef.current.value = val
  }
  useEffect(() => {
    if (value) {
      setValueToInput(value)
    }
  }, [value])
  useEffect(() => {
    console.log('empty effect')
    inputRef.current.oninput = function (e) {
      if (onChange) {
        onChange(e.target.value)
      }
    }
    setValueToInput(defaultValue || value)
  }, [])
  // 通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，
  // 这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价
  // useLayoutEffect
  return (
    <div>
      <input ref={inputRef}></input>
    </div>
  )
}

export default MyInput
```


## 函数式编程
::: tip
为什么JS提倡函数式编程？因为函数作为 JS 中的一级公民，函数也可以被看作成值并用作数据使用。

从常量和变量中引用它。

将其作为参数传递给其他函数。

作为其他函数的结果返回它。

其思想是将函数视为值，并将函数作为数据传递。通过这种方式，我们可以组合不同的函数来创建具有新行为的新函数。
:::

### 纯函数的好处
1. 纯函数代码肯定更容易测试，不需要 mock 任何东西,因此，我们可以使用不同的上下文对纯函数进行单元测试
2. 尽管时间变或者不变，纯函数大佬都是不变的。

当数据是不可变的时，它的状态在创建后不能更改。

咱们不能更改不可变对象，如果非要来硬的，刚需要深拷贝一个副本，然后操作这个副本。
