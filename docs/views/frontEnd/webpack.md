---
title: 'webpack'
  # 大标题
sidebarDepth: 3
sidebar: auto
categories: frontEnd
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- webpack
- 前端工程化
# 标签
---

::: tip 概述
。。。
:::

## 常用node命令
### path.relative
::: tip node
path.relative(from, to)方法根据当前工作目录返回`from`到`to`的相对路径。如果from和to各自解析到相同的路径（分别调用 path.resolve() 之后），则返回零长度的字符串。

如果将零长度的字符串传入from或to，则使用当前工作目录代替该零长度的字符串。

例如:在POSIX（POSIX标准定义了操作系统应该为应用程序提供的接口标准，是IEEE为要在各种UNIX操作系统上运行的软件而定义的一系列API标准的总称）上：
```javascript
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```
在windows上
```javascript
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// 返回: '..\\..\\impl\\bbb'
```
:::
### path.resolve
::: tip node
path.resolve([...paths]) 方法将路径或路径片段的序列解析为绝对路径。给定的路径序列从右到左进行处理，每个后续的path前置，直到构造出一个绝对路径。例如，给定的路径片段序列：`/foo`,`/bar`,`baz`，调用path.resolve('/foo', '/bar', 'baz')将返回`/bar/baz`。

如果在处理完所有给定的path片段之后还未生成绝对路径，则再加上当前工作目录。

生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。

零长度的path片段会被忽略。

如果没有传入 path 片段，则 path.resolve() 将返回当前工作目录的绝对路径。

```javascript
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
如果任何参数不是字符串，则抛出TypeError。
:::
### path.join
::: tip node
path.join([...paths])方法使用平台特定的分隔符作为定界符讲所有给定的`path`片段连接在一起，然后规范化生成的路径。零长度的path片段会被忽略。如果连接的路径字符串是零长度的字符串，则返回'.'，表示当前工作目录。
:::
```javascript
path.join('/foo', 'bar', 'baz/asdf', 'quux');
// 返回: /foo/bar/baz/asdf/quux'

path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'，因为..是返回上一级，所以quux被删掉了。

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```
如果任何路径片段不是字符串，则抛出 TypeError。
## 入口
### 多入口

超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

