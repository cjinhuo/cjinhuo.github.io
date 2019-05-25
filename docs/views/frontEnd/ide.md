---
title: '前端开发环境'
sidebarDepth: 2
sidebar: auto
categories: 
- frontEnd
# 分类 共有三个分类： frontEnd work else
date: 2019-04-24
# 时间
tags:
- 前端环境
# 标签
---

::: tip 概述
对于前端开发而言，鉴于Node.js及一些三方依赖包在Windows环境下有兼容性坑，因此macOS无疑是最佳选择。
:::

## brew

* 第一步，获取install文件
把官网给的脚本拿下来，将下面这个地址的源码放入名为brew_install的文件里面，并保存在当前目录
`curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install >> brew_install`

* 第二步，更改脚本中的资源链接，替换成清华大学的镜像
就是把这两句<br/>
`BREW_REPO = “https://github.com/Homebrew/brew“.freeze`<br/>
`CORE_TAP_REPO = “https://github.com/Homebrew/homebrew-core“.freeze` <br/>
更改为这两句 <br/>
`BREW_REPO = “https://mirrors.ustc.edu.cn/brew.git “.freeze`<br/>
`CORE_TAP_REPO = “https://mirrors.ustc.edu.cn/homebrew-core.git“.freeze`<br/>
当然如果这个镜像有问题的话，可以换成别的

* 第三步，执行脚本
`/usr/bin/ruby brew_install`

但是我用的时候没有找到CORE_TAP_REPO，会出现以下情况，有耐心，多等会。
![](../../.vuepress/public/env1.png)
在安装好后，确认brew的安装，在终端中运行`brew -v`，如果出现两个版本号就证明安装成功。一个是`Homebrew`，一个是`Homebrew/homebrew-core`<br/>
当我们用`brew`安装插件的时候，每次都会自动检查当前brew是不是最新的，所以我们需要替换镜像，我们上面已经找到`BREW_REPO`，所以下面只需执行后两句，替换`homebrew-core`的镜像就可以。
```
cd "$(brew --repo)"

git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"

git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```
## Terminal

一个好看又好用的终端，往往可以节省很多工作时间。推荐iTerm2 + oh-my-zsh。

`iterm2: https://www.iterm2.com/`

`oh-my-zsh: https://github.com/robbyrussell/oh-my-zsh`




