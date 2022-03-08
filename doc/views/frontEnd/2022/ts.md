---
title: 'typescript-note'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: front
date: 2022-03-01
# 时间
tags:
- ts
# 标签
---

::: tip 概述

:::

## infer
单词的意思：v. 推断，推论；暗示，暗指

简单示例：
`type ParamType<T> = T extends (...args: infer P) => any ? P : T;`

在这个条件语句 T extends (...args: infer P) => any ? P : T 中，infer P 表示待推断的函数参数。

整句表示为：如果 T 能赋值给 (...args: infer P) => any，则结果是 (...args: infer P) => any 类型中的参数 P，否则返回为 T

```js
interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string
```



## record
```js
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const nav: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```



