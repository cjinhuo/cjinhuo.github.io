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

在这个条件语句 T extends (...args: infer P) => any ? P : T 中，infer P 表示`待推断`的函数参数。

整句表示为：如果 T `符合`这个句式 (...args: infer P) => any，则结果是 (...args: infer P) => any 类型中的参数 P，否则返回为 T

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

## enum
### 转成interface

### 作为入参时需要提示


[enum 抽离](https://www.typescriptlang.org/play?#code/MYewdgzgLgBApmArgWxgFTtNBPADpmAbwCgYZw4YBeGAcgtoBpSYoB3Eau9kW4gX2KhIsKJigA1AIYAbRJRokyFAFxEWZACZSoUtQEYW-ZmR5qlZGNt3mNlsdAN3BZQYOJQ8lDNGly4OPhcnvggAGas4n7yxELg0DAA5nCwNAAUcABuCFAAyikQaj6SsvKBcACU1AB86mTCCWFgXAA8aPAAHmJgmhDo4uUQ1RnZYFBFVVS1WTn5UBAA2jNjALowUn3F0QFeC2grLABOKYiHzU0CcSJJKdtcyVBpDiX+FVcJmaVwAPJgCjcveRpYqDAB0FDeDRAMjgoJkIESaU+-l+sOsUkh8VgyLKHHuty+wIGXggoJ4mMg0Nh8MROICHFB6LJ4jexAA9GyYIAwHQegF-FQAOpoBeo0A3Z6ABCMYIAbRUAjooCmCAAnlAKaKgCzzQB8coBvH0A0eqAZ2VAPfKMDVgB55QBBmoBoOXZnIasAerTQjAAoowAGLDZZ5ApqO2TWokDmWS0wJqtR2dbq9dAu0bjGCOr3wSNzRautYbGB2haOg6+sjHKCnc5gc0wQRAA)





