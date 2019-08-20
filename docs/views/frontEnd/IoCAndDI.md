---
title: 'IoC和DI'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories:
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- 依赖注入
- 控制反转
- nest
- IoC
- DI
- Martin Fowler
- 翻译
# 标签
---

::: tip 概述
IoC（Inversion of Control）即“控制反转”，不是什么技术，而是一种设计思想。尤其是在OOP的设计思想当中运用相当广泛。

DI（Dependency Injection），即“依赖注入”，是组件之间依赖关系由容器在运行期决定，即由容器动态的将某个依赖关系注入组件之中。
:::

::: tip
在Java社区有大量轻量级的容器来帮助不能的项目来选择的应用程序。这些容器运行的是一个公共的模式，这个概念通常叫做“控制反转（Inversion of Control）”，在这篇文章我讲解了这个模式是怎么运行的，还有一个更具体的名叫“注入依赖（Dependency Injection）”，对比它们两个之间的服务定位差异。它们之间的选择没有比将配置和使用分析的原则更重要。
:::

企业级Java的一个有趣的点是在构建大量主流J2EE技术的替代方案方面有大量的获取，且大部分都是在开源环境下发生的。这在很大程度上是对主流J2EE世界的重量级复杂性的一种反应，但它也在探索替代方案并提出创造性的想法。要解决一个常见的问题是怎么将不同的元素连接到一起，当web的controller层被互不了解的不同团队构建时，如果将它们与数据库接口相结合。（这应该就是DTO层出现的原因了）。许多框架尝试解决这个问题，部分框架正在扩展以提供从不同层封装组件的能力。这些都被称作为轻量级容器，例如包括[PicoContainer](http://picocontainer.com/)和[Spring](https://spring.io/)。

在这些容器有一部分有趣的设计原理，这些设计原理超越了一些特殊的容器和Java平台。这里我想探索一些一个原理。我使用的例子都是在Java中使用的，但就像我编写大多数原理一样，这些原理同样适用于其他OO环境，特别是.NET。
### 组件和服务(Components and Services)
围绕这些服务和组件把每个元素相连的部分立即让我陷入棘手的技术问题。你可以轻松的找到关于这些事情定义的冗长而又矛盾的文章。出于我的目的，这些是我目前的看法（ For my purposes here are my current uses of these overloaded terms.

### 一个原生的例子
为了是这些想法更加具体，我将用一个运行实例来讨论。像我所有的例子一样，这是一个超级简单的例子，小到不真实，但是希望足以让你看到正在发生的事情，而不是陷入真实范例的沼泽。

在这个例子，我正在编写一个组件提供由特定导演指导的电影列表。这个极其有用的函数实现了一个简单的方法。

``` java
class MovieLister...
  public Movie[] moviesDirectedBy(String arg) {
      List allMovies = finder.findAll();
      for (Iterator it = allMovies.iterator(); it.hasNext();) {
          Movie movie = (Movie) it.next();
          if (!movie.getDirector().equals(arg)) it.remove();
      }
      return (Movie[]) allMovies.toArray(new Movie[allMovies.size()]);
  }
```

这个函数的实现是极度幼稚的方式，它调用了finder对象来返回所有它知道的电影。然后它只是搜索这个列表返回由特定导演执导的电影。对于这个幼稚的做法我不打算修复，因为这只是本文的一个脚手架而已。

本文真正的主角是`finder`对象，或者是怎么样连接`lister`对象和`finder`对象。原因是我想要我的`moviesDirectedBy`方法完全独立于电影是怎么存储的。所以所有的方法只是引用`finder`和`finder`是怎样返回`findAll`方法。我可以通过一个接口来实现这个`finder`。

```java
public interface MovieFinder {
    List findAll();
}
```

现在所有的东西都是解耦的，但是在某种程度上我必须想出一个类来具体提供电影源数据。在本例中我将代码放入`lister`类的构造函数。

```java
class MovieLister...
  private MovieFinder finder;
  public MovieLister() {
    finder = new ColonDelimitedMovieFinder("movies1.txt");
  }
```

The name of the implementation class comes from the fact that I'm getting my list from a colon delimited text file. I'll spare you the details, after all the point is just that there's some implementation.

现在，如果只有我一个人用这个类，这感觉很不错。但是如果我的朋友看到这个牛逼的功能后，会从复制我这个段程序吗？如果他们也把电影都存入在text文件命名为`movies1.txt`，那么一切都很美好。如果他们给电影文件命名一个不同的名字，那么将文件的名称放在属性文件中很容易。但是如果他们有一个完全不同的存储电影列表方式，比如：SQL数据库、XML文件、web服务或者是另一个格式化text文件？在这个例子中我们需要一个不同的类来抓取这些数据。现在因为我定义了一个`MovieFinder`接口，这个不会改变我的`moviesDirectedBy`方法。但是我仍然需要有一些方法来获取一个正确的`finder`实现的实例。

![](../../.vuepress/public/ioc-01.gif)
*图一：在lister类中使用简单创建的依赖项*

图一展示此情况的依赖项。类`MovieLister`是依赖于`MovieFinder`接口和实现。如果它仅仅依赖接口我们会更喜欢，但是我们如何创建一个实例来使用它？

在我写的一本名叫<<P of EAA>>,我们把这种情况描述为插件。查找程序的实现类在编译时没有链接到程序中，因为我不知道我的朋友将使用什么

### 控制反转
当这些容器谈到它们如何如此有用时，因为它们实现了“控制反转”，我最终感到非常困惑。控制反转是框架的一个共同特征，所以说这些轻量级容器是特殊的，因为它们使用控制反转就像说我的汽车是特殊的，因为它有轮子。

问题是：“控制的什么被反转了”？当我第一次遇到控制反转时，它就是用户界面的主要控制。早期用户界面由应用程序控制。您将拥有一系列命令，例如“输入名称”，“输入地址”; 你的程序会驱动提示并获取每个提示的响应。使用图形（甚至基于屏幕）的UI，UI框架将包含此主循环，而您的程序则为屏幕上的各个字段提供事件处理程序。主要的控制权限被反转了，从你移到框架。

对于这种新类型的容器，反转是关于它们如何查找插件实现的。在我的简单示例中，lister通过直接实例化查找查找器实现。这将阻止`finder`成为一个插件。
超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

