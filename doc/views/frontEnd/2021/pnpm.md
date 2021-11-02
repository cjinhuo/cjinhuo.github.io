---
title: 'pnpm的使用'
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2021-11-02
# 时间
tags:
- pnpm
---

::: tip 概述
pnpm，英文里面的意思叫做 performant npm ，意味“高性能的 npm”官网地址可以参考 https://pnpm.io/
:::
pnpm 相比较于 yarn/npm 这两个常用的包管理工具在性能上也有了极大的提升，根据目前官方提供的 benchmark 数据可以看出在一些综合场景下比 npm/yarn 快了大概两倍：

## 概览
在这篇文章中，将会介绍一些关于 pnpm 在依赖管理方面的优化，在 monorepo 中相比较于 yarn workspace 的应用，以及也会介绍一些 pnpm 目前存在的一些缺陷，包括讨论一下未来 pnpm 会做的一些事情。
依赖管理
这节会通过 pnpm 在依赖管理这一块的一些不同于正常包管理工具的一些优化技巧。
hard link 机制
介绍 pnpm 一定离不开的就是关于 pnpm 在安装依赖方面做的一些优化，根据前面的 benchmark 图可以看到其明显的性能提升。
那么 pnpm 是怎么做到如此大的提升的呢？是因为计算机里面一个叫做 Hard link 的机制，hard link 使得用户可以通过不同的路径引用方式去找到某个文件。pnpm 会在全局的 store 目录里存储项目 node_modules 文件的 hard links 。
举个例子，例如项目里面有个 1MB 的依赖 a，在 pnpm 中，看上去这个 a 依赖同时占用了 1MB 的 node_modules 目录以及全局 store 目录 1MB 的空间(加起来是 2MB)，但因为 hard link 的机制使得两个目录下相同的 1MB 空间能从两个不同位置进行寻址，因此实际上这个 a 依赖只用占用 1MB 的空间，而不是 2MB。
Store 目录



上面提到 store 目录用于存储依赖的 hard links，这一节简单介绍一下这个 store 目录。
一般 store 目录默认是设置在 ${os.homedir}/.pnpm-store 这个目录下，具体可以参考 @pnpm/store-path 这个 pnpm 子包中的代码:
```js
const homedir = os.homedir()
if (await canLinkToSubdir(tempFile, homedir)) {
  await fs.unlink(tempFile)
  // If the project is on the drive on which the OS home directory
  // then the store is placed in the home directory
  return path.join(homedir, relStore, STORE_VERSION)
}
```

当然用户也可以在 .npmrc 设置这个 store 目录位置，不过一般而言 store 目录对于用户来说感知程度是比较小的。
因为这样一个机制，导致每次安装依赖的时候，如果是个相同的依赖，有好多项目都用到这个依赖，那么这个依赖实际上最优情况(即版本相同)只用安装一次。
如果是 npm 或 yarn，那么这个依赖在多个项目中使用，在每次安装的时候都会被重新下载一次。

如图可以看到在使用 pnpm 对项目安装依赖的时候，如果某个依赖在 store 目录中存在了话，那么就会直接从 store 目录里面去 hard-link，避免了二次安装带来的时间消耗，如果依赖在 store 目录里面不存在的话，就会去下载一次。

当然这里你可能也会有问题：如果安装了很多很多不同的依赖，那么 store 目录会不会越来越大？
答案是当然会存在，针对这个问题，pnpm 提供了一个命令来解决这个问题: pnpm store | pnpm。
同时该命令提供了一个选项，使用方法为 pnpm store prune ，它提供了一种用于删除一些不被全局项目所引用到的 packages 的功能，例如有个包 axios@1.0.0 被一个项目所引用了，但是某次修改使得项目里这个包被更新到了 1.0.1 ，那么 store 里面的 1.0.0 的 axios 就就成了个不被引用的包，执行 pnpm store prune 就可以在 store 里面删掉它了。
该命令一般推荐偶尔进行使用，但不要频繁使用，因为可能某天这个不被引用的包又突然被哪个项目引用了，这样就可以不用再去重新下载这个包了。
node_modules 结构
在 pnpm 官网有一篇很经典的文章，关于介绍 pnpm 项目的 node_modules 结构: Flat node_modules is not the only way | pnpm。
在这篇文章中介绍了 pnpm 目前的 node_modules 的一些文件结构，例如在项目中使用 pnpm 安装了一个叫做 express 的依赖，那么最后会在 node_modules 中形成这样两个目录结构:
```js
node_modules/express/...
node_modules/.pnpm/express@4.17.1/node_modules/xxx
```

其中第一个路径是 nodejs 正常寻找路径会去找的一个目录，如果去查看这个目录下的内容，会发现里面连个 node_modules 文件都没有：
```js
▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```
实际上这个文件只是个软连接，它会形成一个到第二个目录的一个软连接(类似于软件的快捷方式)，这样 node 在找路径的时候，最终会找到 .pnpm 这个目录下的内容。
其中这个 .pnpm 是个虚拟磁盘目录，然后 express 这个依赖的一些依赖会被平铺到 .pnpm/express@4.17.1/node_modules/ 这个目录下面，这样保证了依赖能够 require 到，同时也不会形成很深的依赖层级。
在保证了 nodejs 能找到依赖路径的基础上，同时也很大程度上保证了依赖能很好的被放在一起。

pnpm 对于不同版本的依赖有着极其严格的区分要求，如果项目中某个依赖实际上依赖的 peerDeps 出现了具体版本上的不同，对于这样的依赖会在虚拟磁盘目录 .pnpm 有一个比较严格的区分，具体可以参考: https://pnpm.io/how-peers-are-resolved 这篇文章。

综合而言，本质上 pnpm 的 node_modules 结构是个网状 + 平铺的目录结构。这种依赖结构主要基于软连接(即 symlink)的方式来完成。
symlink 和 hard link 机制
在前面知道了 pnpm 是通过 hardlink 在全局里面搞个 store 目录来存储 node_modules 依赖里面的 hard link 地址，然后在引用依赖的时候则是通过 symlink 去找到对应虚拟磁盘目录下(.pnpm 目录)的依赖地址。
这两者结合在一起工作之后，假如有一个项目依赖了 bar@1.0.0 和 foo@1.0.0 ，那么最后的 node_modules 结构呈现出来的依赖结构可能会是这样的:

```js
node_modules
└── bar // symlink to .pnpm/bar@1.0.0/node_modules/bar
└── foo // symlink to .pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    │           ├── index.js
    │           └── package.json
    └── foo@1.0.0
        └── node_modules
            └── foo -> <store>/foo
                ├── index.js
                └── package.json
```

node_modules 中的 bar 和 foo 两个目录会软连接到 .pnpm 这个目录下的真实依赖中，而这些真实依赖则是通过 hard link 存储到全局的 store 目录中。

兼容问题
读到这里，可能有用户会好奇: 像 hard link 和 symlink 这种方式在所有的系统上都是兼容的吗？
实际上 hard link 在主流系统上(Unix/Win)使用都是没有问题的，但是 symlink 即软连接的方式可能会在 windows 存在一些兼容的问题，但是针对这个问题，pnpm 也提供了对应的解决方案：
在 win 系统上使用一个叫做 junctions 的特性来替代软连接，这个方案在 win 上的兼容性要好于 symlink。
或许你也会好奇为啥 pnpm 要使用 hard links 而不是全都用 symlink 来去实现。
实际上存在 store 目录里面的依赖也是可以通过软连接去找到的，nodejs 本身有提供一个叫做 --preserve-symlinks 的参数来支持 symlink，但实际上这个参数实际上对于 symlink 的支持并不好导致作者放弃了该方案从而采用 hard links 的方式:

具体可以参考 https://github.com/nodejs/node-eps/issues/46 该issue 讨论。

Monorepo 支持
pnpm 在 monorepo 场景可以说算得上是个完美的解决方案了，因为其本身的设计机制，导致很多关键或者说致命的问题都得到了相当有效的解决。
workspace 支持
对于 monorepo 类型的项目，pnpm 提供了 workspace 来支持，具体可以参考官网文档: https://pnpm.io/workspaces/。
痛点解决
Monorepo 下被人诟病较多的问题，一般是依赖结构问题。常见的两个问题就是 Phantom dependencies 和 NPM doppelgangers，用 rush 官网 的图片可以很贴切的展示着两个问题:

下面会针对两个问题一一介绍。
Phantom dependencies
Phantom dependencies 被称之为幽灵依赖，解释起来很简单，即某个包没有被安装(package.json 中并没有，但是用户却能够引用到这个包)。
引发这个现象的原因一般是因为 node_modules 结构所导致的，例如使用 yarn 对项目安装依赖，依赖里面有个依赖叫做 foo，foo 这个依赖同时依赖了 bar，yarn 会对安装的 node_modules 做一个扁平化结构的处理(npm v3 之后也是这么做的)，会把依赖在 node_modules 下打平，这样相当于 foo 和 bar 出现在同一层级下面。那么根据 nodejs 的寻径原理，用户能 require 到 foo，同样也能 require 到 bar。

```js
package.json -> foo(bar 为 foo 依赖)
node_modules
  /foo
  /bar -> 👻依赖
```

那么这里这个 bar 就成了一个幽灵依赖，如果某天某个版本的 foo 依赖不再依赖 bar 或者 foo 的版本发生了变化，那么 require bar 的模块部分就会抛错。以上其实只是一个简单的例子， monorepo(主要为 lerna + yarn )项目中，这其实是个比较常见的现象，甚至有些包会直接去利用这种残缺的引入方式去减轻包体积。
还有一种场景就是在 lerna + yarn workspace 的项目里面，因为 yarn 中提供了 hoist 机制(即一些底层子项目的依赖会被提升到顶层的 node_modules 中)，这种 phantom dependencies 会更多，一些底层的子项目经常会去 require 一些在自己里面没有引入的依赖，而直接去找顶层 node_modules 的依赖(nodejs 这里的寻径是个递归上下的过程)并使用。
而根据前面提到的 pnpm 的 node_modules 依赖结构，这种现象是显然不会发生的，因为被打平的依赖会被放到 .pnpm 这个虚拟磁盘目录下面去，用户通过 require 是根本找不到的。
值得一提的是，pnpm 本身其实也提供了将依赖提升并且按照 yarn 那种形式组织的 node_modules 结构的 Option，作者将其命名为 --shamefully-hoist ，即 "羞耻的 hoist".....

NPM doppelgangers
这个问题其实也可以说是 hoist 导致的，这个问题可能会导致有大量的依赖的被重复安装，举个例子:
例如有个 package，下面依赖有 lib_a、lib_b、lib_c、lib_d，其中 a 和 b 依赖 util_e@1.0.0，而 c 和 d 依赖 util_e@2.0.0。
那么早期 npm 的依赖结构应该是这样的:

```js
- package
  - package.json
  - node_modules
     - lib_a
       - node_modules <- util_e@1.0.0
     - lib_b
       - node_modules <- util_e@1.0.0
     _ lib_c
       - node_modules <- util_e@2.0.0
     - lib_d
       - node_modules <- util_e@2.0.0
```

这样必然会导致很多依赖被重复安装，于是就有了 hoist 和打平依赖的操作:

```js
- package
  - package.json
  - node_modules
     - util_e@1.0.0
     - lib_a
     - lib_b
     _ lib_c
       - node_modules <- util_e@2.0.0
     - lib_d
       - node_modules <- util_e@2.0.0
```

但是这样也只能提升一个依赖，如果两个依赖都提升了会导致冲突，这样同样会导致一些不同版本的依赖被重复安装多次，这里就会导致使用 npm 和 yarn 的性能损失。
如果是 pnpm 的话，这里因为依赖始终都是存在 store 目录下的 hard links ，一份不同的依赖始终都只会被安装一次，因此这个是能够被彻彻底底的消除的。
目前不适用的场景

前面有提到关于 pnpm 的主要问题在于 symlink(软链接)在一些场景下会存在兼容的问题，可以参考作者在 nodejs 那边开的一个 discussion：https://github.com/nodejs/node/discussions/37509

在里面作者提到了目前 nodejs 软连接不能适用的一些场景，希望 nodejs 能提供一种 link 方式而不是使用软连接，同时也提到了 pnpm 目前因为软连接而不能使用的场景:
- Electron 应用无法使用 pnpm
- 部署在 lambda 上的应用无法使用 pnpm
