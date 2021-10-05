---
title: 'type vs interface'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2020-11-10
tags:
- 翻译
---

**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**

<h1 style="padding: 0px; font-weight: bold; color: black; font-size: 24px; text-align: center; line-height: 60px; margin-top: 10px; margin-bottom: 10px;">
  <span style="color: #2db7f5;" class="content">背景</span>
</h1>

翻译自：[TypeScript: type vs interface](https://dev.to/stereobooster/typescript-type-vs-interface-2n0c)

<h2 style="margin-top: 25px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="color: #2db7f5; display: inline-block; padding-left: 10px;" class="content">相似之处</span><span style="display: none;" class="suffix"></span></h2>

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Records（声明）</span><span style="display: none;" class="suffix"></span></h3>

```typescript
interface IAnimal {
  name: string;
}

type Animal = {
  name: string;
};
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Generics（泛型声明）</span><span style="display: none;" class="suffix"></span></h3>

```typescript
interface IAnimal<P = string> {
  name: P;
}

type Animal<P = string> = {
  name: P;
};
```



<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Intersections（并集）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">implements（实现接口）</span><span style="display: none;" class="suffix"></span></h3>

```js
class Dog implements IAnimal {
  name: string = "good dog";
}

class Cat implements Animal {
  name: string = "Where is my food, human?";
}
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Extend classes（继承类）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Functions（函数）</span><span style="display: none;" class="suffix"></span></h3>

```js
type Bark = (x: Animal) => void;

interface iBark {
  (x: Animal): void;
}
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Generics functions（泛型函数）</span><span style="display: none;" class="suffix"></span></h3>

```js
type Bark = <P = Animal>(x: P) => void;

interface iBark {
  <P = Animal>(x: P): void;
}
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Recursive declarations（递归声明）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Exact（精确匹配）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Indexable（可索引属性）</span><span style="display: none;" class="suffix"></span></h3>

```typescript
type StringRecord = {
  [index: string]: number;
}

interface IStringRecord {
  [index: string]: number
}
```

<h2 style="margin-top: 25px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="color: #2db7f5; display: inline-block; padding-left: 10px;" class="content">不同之处</span><span style="display: none;" class="suffix"></span></h2>

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Primitive types（基础类型）</span><span style="display: none;" class="suffix"></span></h3>

你只能使用`type`来给基础类型关键字定义别名

```typescript
type NewNumber = number;

interface INewNumber extends number {}
// 'number' only refers to a type, but is being used as a value here.

// this works
interface INewNumber extends Number {}
// but don't forget that 1 instanceof Number === false;

```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Tuples（元组）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Disjoint unions（互斥类型）</span><span style="display: none;" class="suffix"></span></h3>

互斥联合类型只适用于以下类型:

```typescript
type DomesticAnimals = { type: "Dog" } | { type: "Cat" };
```

而且不能将`disjoint unions`与 `extends` 一起使用

```typescript
interface IDomesticAnimals extends DomesticAnimals {}
// An interface can only extend an object type or intersection of object types with statically known members.(2312)
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">new</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Only one declaration per scope
（每个作用域仅一个声明）</span><span style="display: none;" class="suffix"></span></h3>

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

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">工具类型</span><span style="display: none;" class="suffix"></span></h3>

大多数情况下，一般会使用`type`来代替`interface`来创建工具类型

```typescript
export type NonUndefined<A> = A extends undefined ? never : A;
```

<h3 style="margin-top: 20px; margin-bottom: 15px; padding: 0px; font-weight: bold; color: black; font-size: 20px;" data-id="heading-7"><span style="display: none;" class="prefix"></span><span style="font-size: 16px; color: #2db7f5; display: inline-block; padding-left: 10px; border-left: 4px solid #2db7f5;" class="content">Record的另一种定义方式</span><span style="display: none;" class="suffix"></span></h3>

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



