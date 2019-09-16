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
7. `cd /usr/local/mongodb/bin`（为了以后简单启动数据可服务，也可以跳过7 8 9步骤，直接看10步骤）
8. `sudo ./mongod  -dbpath /data/db/` => 用Data/db来打开mongod服务,然后新开一个终端，并且也cd到bin文件夹,执行下面一条命令
9. `./mongo`
10. 在本地建两个.sh文件，就可以不用每次都进bin文件，在桌面新建文件`MongoDB-sh`，里面放入以下两个文件
::: tip mgd.sh
#!/bin/sh
cd /usr/local/mongodb/bin/
sudo ./mongod  -dbpath /data/db/
:::
::: tip mge.sh
#!/bin/sh
cd /usr/local/mongodb/bin/
./mongo
:::
然后先执行`mgd.sh` => `~/Desktop/MongoDB-sh/mgd.sh`<br/>
在执行`mge.sh` => `~/Desktop/MongoDB-sh/mge.sh`<br/>

### 优化
每次打开MongoDB都需要执行上面两个文件，显然`~/Desktop/MongoDB-sh/mgd.sh`，这段命令有点长，而且每次都打同样的代码会很烦，所以可以通过软链接再次优化，将上面的命令变成一个单词。这里使用的是软链接(我写了软链接和硬链接的区别，在搜索框中查找软链接)。将文件路径链接到`/usr/local/bin`。

```
ln -s ~/Desktop/MongoDB-sh/mgd.sh mongof //将 ~/Desktop/MongoDB-sh/mgd.sh的路径链接到bin文件夹中的mongof
```
现在你可以试下在终端中输入`mongof`，发现跟执行`~/Desktop/MongoDB-sh/mgd.sh`效果是一样的.

同样的:
```
ln -s ~/Desktop/MongoDB-sh/mge.sh mongos
```
这样下次你就可以直接新建两个终端，先后运行:`mongof` `mongos`

### 究极优化
当然还有一种优化，可以在第一个sh文件的末尾写：新建终端 && 执行另一个sh文件，这样以后开mongo服务只需要输入一个单词。
<!-- 超链接 [文本](URL) -->
<!-- ../../.vuepress/public/line-height.png) -->
<!-- 图片 ![](url) -->

