---
title: 'TypeScript: type vs interface'
description: '翻译自 TypeScript: type vs interface，介绍 TypeScript 中 type 和 interface 的相似之处与不同之处'
tags: ['TypeScript', '翻译']
pubDate: '2020-11-10'
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**

## 背景

翻译自：[TypeScript: type vs interface](https://dev.to/stereobooster/typescript-type-vs-interface-2n0c)

## 相似之处

### Records（声明）

```typescript
interface IAnimal {
  name: string;
}

type Animal = {
  name: string;
};
```

### Generics（泛型声明）

```typescript
interface IAnimal<P = string> {
  name: P;
}

type Animal<P = string> = {
  name: P;
};
```

### Intersections（并集）

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

### implements（实现接口）

```js
class Dog implements IAnimal {
  name: string = "good dog";
}

class Cat implements Animal {
  name: string = "Where is my food, human?";
}
```

### Extend classes（继承类）

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

### Functions（函数）

```js
type Bark = (x: Animal) => void;

interface iBark {
  (x: Animal): void;
}
```

### Generics functions（泛型函数）

```js
type Bark = <P = Animal>(x: P) => void;

interface iBark {
  <P = Animal>(x: P): void;
}
```

### Recursive declarations（递归声明）

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

### Exact（精确匹配）

```typescript
type Close = { a: string };
const x: Close = { a: "a", b: "b", c: "c" };
// Type '{ a: string; b: string; c: string; }' is not assignable to type 'Close'.

interface IClose {
  a: string;
}
const y: IClose = { a: "a", b: "b", c: "c" };
// Type '{ a: string; b: string; c: string; }' is not assignable to type 'IClose'.
```

### Indexable（可索引属性）

```typescript
type StringRecord = {
  [index: string]: number;
}

interface IStringRecord {
  [index: string]: number
}
```

## 不同之处

### Primitive types（基础类型）

你只能使用`type`来给基础类型关键字定义别名

```typescript
type NewNumber = number;

interface INewNumber extends number {}
// 'number' only refers to a type, but is being used as a value here.

// this works
interface INewNumber extends Number {}
// but don't forget that 1 instanceof Number === false;

```

### Tuples（元组）

不能使用`interface`来声明元组

```typescript
type Tuple = [number, number];

interface ITuple {
  0: number;
  1: number;
}

[1, 2, 3] as Tuple; // Conversion of type '[number, number, number]' to type '[number, number]' may be a mistake

[1, 2, 3] as ITuple; // Ok
```

### Disjoint unions（互斥类型）

互斥联合类型只适用于以下类型:

```typescript
type DomesticAnimals = { type: "Dog" } | { type: "Cat" };
```

而且不能将`disjoint unions`与 `extends` 一起使用

```typescript
interface IDomesticAnimals extends DomesticAnimals {}
// An interface can only extend an object type or intersection of object types with statically known members.(2312)
```

### new

你可以声明`new`类型

```typescript
interface IClassyAnimal {
  new (name: string);
}
```

它不像你想的那样工作

```typescript
class Parrot implements IClassyAnimal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// Class 'Parrot' incorrectly implements interface 'IClassyAnimal'.
//  Type 'Parrot' provides no match for the signature 'new (name: string): void'.
```

构造器似乎也不工作

```typescript
interface IClassyAnimal {
  constructor(name: string): void;
}

class Parrot implements IClassyAnimal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// Class 'Parrot' incorrectly implements interface 'IClassyAnimal'.
//  Types of property 'constructor' are incompatible.
//    Type 'Function' is not assignable to type '(name: string) => void'.
//      Type 'Function' provides no match for the signature '(name: string): void'.
```

### Only one declaration per scope（每个作用域仅一个声明）

`type`每个作用域只能声明一次类型

```typescript
type Once = { a: string };
type Once = { b: string };
// Duplicate identifier 'Once'.
```

`interface`可以多次声明，并最终结果是所有声明的总和

```typescript
interface IOnce {
  a: string;
}
interface IOnce {
  b: string;
}

let test: IOnce = {
    a: '1',
    b: '2'
}
```

### 工具类型

大多数情况下，一般会使用`type`来代替`interface`来创建工具类型

```typescript
export type NonUndefined<A> = A extends undefined ? never : A;
```

### Record的另一种定义方式

```typescript
type TAnimal = 'Dog' | 'Cat'
//Not works
interface IAnimals {
  [a in TAnimal]: string
}
// A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.
```

```typescript
type TAnimal = 'Dog' | 'Cat'
// This works.
type TAnimals = {
  [a in TAnimal]: string
}
let test: TAnimals = {
    Dog: '1',
    Cat: '2'
}
```

但是`Record`可以用替代上方代码`Record<TAnimal, string>`
