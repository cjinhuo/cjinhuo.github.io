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

对于这种新类型的容器，反转是关于它们如何查找插件实现的。在上面的第一个简单示例中，`lister`通过直接实例化查找查找器实现。这将阻止`finder`成为一个插件。这些容器使用的方法是确保任何使用插件的用户遵循某些特定的约定，允许一个单独的汇编程序模块（单独组件）可以注入到`lister`.

结果是我认为我们需要给这个模式起一个特殊的名字。控制反转这个术语太笼统了，因此人们对它感觉很迷惑。因此，在于一些IoC支持者讨论之后取了这个依赖注入(Dependency Injection)这个名字。

我将首先开始讨论各种注入依赖的方式，但是我现在先指出，这不是将依赖从应用程序移到插件实现的惟一办法。您可以使用的另一种模式是Service Locator，我将在解释完依赖项注入之后讨论它。

### 注入依赖的形式

注入依赖的基本思想是有一个独立的对象（一个汇编程序），对象使用finder接口的适当实现填充lister类中的字段，生成如图2所示的依赖关系图

![](../../.vuepress/public/ioc-02.gif)

现在有三个注入依赖的主要风格。名字我管它们叫做构造函数注入（Constructor injection），Setter注入（Setter injection）和接口注入（（interface injection）。如果你在当前关于控制反转的讨论中读到过这些内容，那么您将会听到这些被称为类型1 IoC(interface injection)、类型2 IoC (setter injection)和类型3 IoC(Constructor injection)。我发现数字很难记住，所这就是为什么我用这些名字的原因。

### 在PicoContainer（轻量级IoC容器）中做构造函数注入
我将在这个轻量级容器`PicoContainer`中开始展示怎么注入。我之所以从这里开始，主要是因为我在ThoughtWorks的几位同事对`PicoContainer`的开发非常积极(是的，这是一种企业裙带关系)。

`PicoContainer`使用一个构造函数来决定如何将`finder`实现注入`lister`类。为了让它起作用，`movie`类需要声明一个构造函数来包含它所需要注入的所有内容。

```java
class MovieLister...
  public MovieLister(MovieFinder finder) {
      this.finder = finder;
  }
```
`finder`本身也将由`pico`容器管理，因此将文本文件的文件名由容器注入其中。
```java
class ColonMovieFinder...
  public ColonMovieFinder(String filename) {
      this.filename = filename;
  }
```

然后需要告诉`pico`要与每个接口关联的实现类，以及要注入到`finder`中的字符串。

```java
private MutablePicoContainer configureContainer() {
    MutablePicoContainer pico = new DefaultPicoContainer();
    Parameter[] finderParams =  {new ConstantParameter("movies1.txt")};
    pico.registerComponentImplementation(MovieFinder.class, ColonMovieFinder.class, finderParams);
    pico.registerComponentImplementation(MovieLister.class);
    return pico;
}

```
这个配置代码通常在另一个类中设置。在我们的示例中，每个使用我的`lister`的朋友都可以在他们自己的`setup`类中编写适当的配置代码。
当然，将这类配置信息保存在单独的配置文件中是很常见的。你可以写一个类来读取这个配置文件，尽管`PicoContainer`本身并不包含此功能，但是有一个密切相关的项目叫做`NanoContainer`，它提供了适当的包装器，允许您拥有XML配置文件。这样的`nano`容器将解析XML，然后配置底层的`pico`容器。该项目的理念是将配置文件格式与底层机制（underlying mechanism）分离。

要使用容器，你可以写出类似下面得代码：
```java
public void testWithPico() {
    MutablePicoContainer pico = configureContainer();
    MovieLister lister = (MovieLister) pico.getComponentInstance(MovieLister.class);
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```
尽管在示例中我使用的是构造函数注入，`Pico`容器也支持Setter注入，尽管它的开发者更倾向于构造函数注入。像Pico容器它支持构造函数和Setter注入。

### 在Spring中Setter注入(Setter Injection with Spring)

Spring框架是一个企业级Java开发的广泛框架。它包括事务的抽象层、持久性框架、web应用程序开发和jdbc（Java DataBase Connectivity）。与Pico容器一样，它同时支持构造函数和setter注入，但它（spring）的开发人员倾向于使用setter注入-这使得它成为本例的适当选择。

为了让我的`MoveieLister`能接受一个注入我为这个服务定义一个set方法。
```java
class MovieLister...

  private MovieFinder finder;
public void setFinder(MovieFinder finder) {
  this.finder = finder;
}
```
同样的我给filename也定义一个setter。
```java
class ColonMovieFinder...
  public void setFilename(String filename) {
      this.filename = filename;
  }
```

第三个步骤是创建配置文件。Spring是通过xml文件和代码支持配置，但是XML是比较推荐的。
```xml
<beans>
    <bean id="MovieLister" class="spring.MovieLister">
        <property name="finder">
            <ref local="MovieFinder"/>
        </property>
    </bean>
    <bean id="MovieFinder" class="spring.ColonMovieFinder">
        <property name="filename">
            <value>movies1.txt</value>
        </property>
    </bean>
</beans>
```
然后这个测试看起来是这样的：
```java
public void testWithSpring() throws Exception {
    ApplicationContext ctx = new FileSystemXmlApplicationContext("spring.xml");
    MovieLister lister = (MovieLister) ctx.getBean("MovieLister");
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```
### 接口依赖(Interface Injection)
第三种注入方法是定义和使用接口来注入。`Avalon`是在一些地方使用这种技术的框架的一个例子。稍后我将更详细地讨论这个问题，但在本例中，我将使用一些简单的示例代码。在这个方法开始时，我首先定义了一个接口，我将用它来执行注入。下边是一个` MovieFinder`注入对象的接口。

该接口将由提供MovieFinder接口的人定义。它需要由任何想要用`finder`类的人实现，比如：`lister`。
```java
class MovieLister implements InjectFinder
  public void injectFinder(MovieFinder finder) {
      this.finder = finder;
  }
```
我使用类似的方法将文件名注入finder实现中。
```java
public interface InjectFinderFilename {
    void injectFilename (String filename);
}

class ColonMovieFinder implements MovieFinder, InjectFinderFilename...

  public void injectFilename(String filename) {
      this.filename = filename;
  }
```
然后，像往常一样，我需要一些配置代码来连接实现。为了简单起见，我将在代码中这样做.
```java
class Tester...
  private Container container;
   private void configureContainer() {
     container = new Container();
     registerComponents();
     registerInjectors();
     container.start();
  }
```
这个配置有两个阶段，通过查找键注册组件与其他示例非常相似。
```java
class Tester...

  private void registerComponents() {
    container.registerComponent("MovieLister", MovieLister.class);
    container.registerComponent("MovieFinder", ColonMovieFinder.class);
  }
```
一个新的步骤是注册将注入相关组件的注入器。每个注入接口需要一些代码来注入依赖对象。在这里，我通过向容器注册注入器对象来实现这一点。每个注入器对象实现注入器接口。
```java
class Tester...
  private void registerInjectors() {
    container.registerInjector(InjectFinder.class, container.lookup("MovieFinder"));
    container.registerInjector(InjectFinderFilename.class, new FinderFilenameInjector());
  }
public interface Injector {
  public void inject(Object target);
}
```
When the dependent is a class written for this container, it makes sense for the component to implement the injector interface itself, as I do here with the movie finder. For generic classes, such as the string, I use an inner class within the configuration code.
```java
class ColonMovieFinder implements Injector...

  public void inject(Object target) {
    ((InjectFinder) target).injectFinder(this);
  }
class Tester...

  public static class FinderFilenameInjector implements Injector {
    public void inject(Object target) {
      ((InjectFinderFilename)target).injectFilename("movies1.txt");
    }
    }
```
然后测试使用容器。
```java
class Tester…

  public void testIface() {
    configureContainer();
    MovieLister lister = (MovieLister)container.lookup("MovieLister");
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
  }
```
容器使用声明的注入接口来确定依赖项，并使用注入器注入正确的依赖项(我在这里所做的特定容器实现对该技术并不重要，我不会展示它，因为您只会笑)

### 使用服务定位器(Using a Service Locator)
使用依赖注入器的好处是它消除了`MovieLister`类对具体`MovieFinder`实现的依赖。这允许我将listers提供给朋友，并让他们插入适合自己环境的实现。注入不是打破这种依赖关系的唯一方法，另一种方法是使用服务定位器。

服务定位器背后的基本思想是拥有一个知道如何获取应用程序可能需要的所有服务的对象。因此，此应用程序的服务定位器将具有一个方法，当需要时就会返回一个`movie finder`。当然，这只是稍微转移了一些负担，我们仍然需要将定位器放入`lister`中，这导致了图3中的依赖关系
![](../../.vuepress/public/ioc-03.gif)



超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)
