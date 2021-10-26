---
title: 'linux常用命令和概念'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2019-09-16
# 时间
tags:
- linux
# 标签
---

::: tip 概述

:::

## 软硬链接
### 链接的概念
简单的理解链接就是快捷方式，在Windows系统中，快捷方式就是指向原文件的一个链接文件，可以让用户从不同的位置来访问原始的文件；原文件一旦被删除或剪切到其他地方后，会导致链接文件失效。但是在Linux系统中这个看似简单的东西和Windows里的可能不大一样。
### 链接的分类
在Linux系统中有软、硬两种链接文件之分。
### 硬链接（hard link）
我们可以将它理解为一个“指向原始文件[索引节点](https://baike.baidu.com/item/%E7%B4%A2%E5%BC%95%E8%8A%82%E7%82%B9/4506518)的指针”，系统不为它分配独立的索引节点和文件。所以，硬链接文件与原始文件其实是同一个文件，只不过是不同的名字而已。我们每添加一个硬链接，该文件的索引节点链接数就增加1。而且只有当该文件的索引节点链接数为0时，才算彻底将它删除。换言之，由于硬链接实际上是指向原文件索引节点的指针，因此即便原始文件被删除（我的理解：只是被放到回收站，但是指针和内存还在），依然可以通过硬链接文件来访问。
### 硬链接总结
1. 硬链接，以文件副本的形式存在。但不占用实际空间。
2. 不允许给目录创建硬链接
3. 硬链接只有在同一个文件系统中才能创建

### 软链接（也称为符号链接[symbolic link]）
软链接仅仅包含所链接文件的路径名，因此能链接目录文件，也可以跨越文件系统进行链接。当元原始文件被删除后，链接文件也将失效，从这一点上来说与Window系统的中的“快捷方式”具有一样的性质。
### 软链接总结
1. 软链接，以路径的形式存在。类似于Windows操作系统中的快捷方式
2. 软链接可以跨文件系统 ，硬链接不可以
3. 软链接可以对一个不存在的文件名进行链接
4. 软链接可以对目录进行链接
### ln命令
ln 命令用于创建链接文件，格式为“ln [选项] 目标”，其可用的参数以及作用如下：

-b 删除，覆盖以前建立的链接

-d 允许超级用户制作目录的硬链接

-f 强制执行

-i 交互模式，文件存在则提示用户是否覆盖

-n 把符号链接视为一般目录

-s 软链接(符号链接)

-v 显示详细的处理过程
### 演示硬链接和软链接之间的区别
* 创建一个软链接
![](../../.vuepress/public/symbolic_link.png)

::: tip 结论
软链接在删除掉原始文件后，它的链接文件将会失效，无法再访问文件内容，类似于Windows的快捷方式。
:::

* 创建一个硬链接
![](../../.vuepress/public/hard_link.png)

::: tip 结论
硬链接在删除原始文件后，它的链接文件还可以继续访问，这是因为新建的硬链接不再依赖原始文件的名称等信息，我们可以看到在创建完硬链接后，原始文件的硬盘链接数量增加到了2，如果想要彻底删除，链接数成0才算彻底删除。
:::

## 常用命令
### ps -ef|grep
`ps`命令将某个进程显示出来，`-ef`是用标准的格式显示进程

grep命令是查找

`|`是管道命令，是指ps命令与grep同时执行

比如查看nginx的命令：`ps -ef|grep nginx`


### 查找当前文件下面文件
` find . -name min* -maxdepth 1`
-name: 表示查找的是文件

-maxdepth：表示查找层数是一层

### 设置组别权限
`sudo chown -R $(whoami) <Path to Code>`


## docker
### -p端口映射
外部映射容器端口：
```bash
docker run -it -p 7009:7009 try-end/node:12 /bin/bash
```
执行`try-end/node:12`这个镜像，`/bin/bash`是进入到当前容器当中，容器里面的所有端口服务，容器外面默认是没有办法访问到的，`-p 7009:7009`：用外面的`7009`端口来映射容器内的`7009`，从而可以在容器外访问容器内的`7009`服务


## nginx
安装:`brew nginx`

### 正向代理


### 反向代理
`brew nginx`

`vi /usr/local/etc/nginx/nginx.config`进行配置更改，也可以在`/usr/local/etc/nginx/servers`里面添加配置

```js
server{
    listen 80;
    server_name *.qa.91jkys.com;
    access_log /var/log/nginx/zhiyun_access.log;
    error_log  /var/log/nginx/zhiyun_error.log;

    if ($http_host ~* "^(.*?)\.qa\.91jkys\.com$") {
        set $domain $1;
    }

    location / {
        if ($domain ~* "trycatch") {
            proxy_pass http://127.0.0.1:3000;
        }
        if ($domain ~* "operate-admin") {
            proxy_pass http://127.0.0.1:1024;
        }
        if ($domain ~* "metabase-admin") {
            proxy_pass http://127.0.0.1:1025;
        }
        if ($domain ~* "supply"){
            proxy_pass http://127.0.0.1:9999;
        }
        proxy_redirect     off;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```

启动Nginx` brew services start nginx`
重启Nginx` brew services restart nginx`
暂停Nginx` brew services stop nginx`




超链接 [文本](URL)
<!-- ../../.vuepress/public/line-height.png) -->
图片 ![](url)

