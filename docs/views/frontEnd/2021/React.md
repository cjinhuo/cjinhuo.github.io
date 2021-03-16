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

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

