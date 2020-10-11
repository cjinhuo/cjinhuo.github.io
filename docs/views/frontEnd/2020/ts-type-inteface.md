---
title: 'ts的type与interface'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2019-02-12
# 时间
tags:
- typescript
- type&&interface
# 标签
---

::: tip 概述
。。。
:::

### 相似点

```js
interface IAnimal {
  name: string;
}

type Animal = {
  name: string;
};
```

### 通用
```js
interface IAnimal {
  name: string;
}

type Animal = {
  name: string;
};
```

### 共同之处
```js
type Robot = {
  power: number;
};

interface IRobot {
  name: string;
}

interface IRoboAnimal1 extends IAnimal, IRobot {}
interface IRoboAnimal2 extends IAnimal, Robot {}
interface IRoboAnimal3 extends Animal, IRobot {}
interface IRoboAnimal4 extends Animal, Robot {}

type RoboAnimal1 = Animal & Robot;
type RoboAnimal2 = Animal & IRobot;
type RoboAnimal3 = IAnimal & Robot;
type RoboAnimal4 = IAnimal & IRobot;
```

### 实现
```js
class Dog implements IAnimal {
  name: string = "good dog";
}

class Cat implements Animal {
  name: string = "Where is my food, human?";
}
```

### 继承类
```js
class Control {
  private state: any;
}

interface ISelectableControl extends Control {
  select(): void;
}

type SelectableControl = Control & {
  select: () => void;
};
```

### 函数
```js
type Bark = (x: Animal) => void;

interface iBark {
  (x: Animal): void;
}
```

### 泛型函数
```js
type Bark = <P = Animal>(x: P) => void;

interface iBark {
  <P = Animal>(x: P): void;
}
```

### 递归声明
```js
type Tree<P> = {
  node: P;
  leafs: Tree<P>{}
}

interface ITree<P> {
  node: P;
  leafs: ITree<P>{};
}
```

### exact
```js
type Close = { a: string };
const x: Close = { a: "a", b: "b", c: "c" };
// Type '{ a: string; b: string; c: string; }' is not assignable to type 'Close'.

interface IClose {
  a: string;
}
const y: IClose = { a: "a", b: "b", c: "c" };
// Type '{ a: string; b: string; c: string; }' is not assignable to type 'IClose'.
```

### 可变索引
```js
type StringRecord = {
  [index: string]: number;
}
```




## 第一个大标题

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

