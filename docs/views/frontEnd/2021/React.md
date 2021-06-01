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

