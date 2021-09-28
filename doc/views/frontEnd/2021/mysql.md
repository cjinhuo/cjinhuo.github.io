---
title: 'mysql'
sidebarDepth: 2
sidebar: auto
categories: end
date: 2021-06-01
tags:
- mysql
---

::: tip 概述
mysql的一些笔记
:::

## 范式
### 第一范式
每一列都是不可分割的基本数据项，同一列中不能有多个值。简而言之，第一范式就是无重复的列

### 第二范式
在1NF的基础上建立起来的，要求实体的属性完全依赖于主键

### 第三范式
要求一个数据库中不包含已在其他表中已包含的非主键的信息。（表中不允许存在其他表的非主键）


## mac安装
[brew install mysql](https://www.cnblogs.com/georgeleoo/p/11478416.html)