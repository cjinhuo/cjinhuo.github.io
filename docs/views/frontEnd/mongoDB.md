---
title: 'mongoDB'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: 
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- 模板
# 标签
---

## Mac安装

1. `cd /usr/local` => 进入 /usr/local文件夹
2. `sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.9.tgz` => 下载tgz文件到当前目录
3. `sudo tar -zxvf mongodb-osx-ssl-x86_64-4.0.9.tgz` => 解压文件到当前目录
4. `sudo mv mongodb-osx-x86_64-4.0.9/ mongodb` => 重名名，可有可无，这个操作
5. `export PATH=/usr/local/mongodb/bin:$PATH` => 将MongoDB德进制命令文件目录添加到PATH路径中
6. `mkdir -p /data/db` => -p 在上一层目录创建文件/data/db，如果你一直执行到当前命令的话就是在`usr`同一级文件夹创建文件夹data,MongoDB的数据存储在data目录的db目录下，但是这个目录在安装过程不会自动创建，所以你需要手动创建data目录，并在data目录中创建db目录。
7. `cd /usr/local/mongodb/bin`
8. `sudo ./mongod  -dbpath /data/db/` => 用Data/db来打开mongod服务,然后新开一个终端，并且也cd到bin文件夹,执行下面一条命令
9. `./mongo`
<!-- 超链接 [文本](URL) -->
<!-- ../../.vuepress/public/line-height.png) -->
<!-- 图片 ![](url) -->
 
