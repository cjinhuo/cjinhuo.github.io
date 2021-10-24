---
title: '程序员Mac好用的工具：一'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
date: 2021-10-21
# 时间
tags:
- 开发环境
# 标签
---




**本文作者：[cjinhuo](https://github.com/cjinhuo)，未经授权禁止转载。**


# 概要
"工欲善其事，必先利其器"，颜值高且好用的工具往往能让我们事半功倍

来到正文，本文分成三个部分

* 背景
* 工具
* 结尾

# 背景
对程序猿👨🏻‍💻而言，除了部分大佬喜欢用`linux`外，`Mac`拥有着高分辨率、超好用的`Touch Bar`和`MacOS`无疑是最佳选择，下面来介绍一些个人觉得好用的工具

# 工具

## brew
[brew](https://brew.sh/)是`MacOS上`的包管理工具，可以简化 macOS 和 Linux 操作系统上软件的安装，具体使用且看[官网](https://brew.sh/)

安装完在终端中输入`brew -v`，可以输出版本就证明安装成功

现在比如说安装`mysql`，只需一句简单的命令：

```bash
brew install mysql
```

安装`redis`等等其他的也是一样的操作

**注意：正常情况下需要科学上网安装会快点**


## iterm2 & oh-my-zsh & spaceship
一个好看又好用的终端，往往可以节省很多工作时间，还能给你的同事`show`一下，下图是我目前的终端：
![terminal_personal](https://files.catbox.moe/nj26bf.jpg)

那么就开始下载和配置：

* 下载[iterm2](https://www.iterm2.com/)
打开偏好设置Preference，设置最小化主题：
![](https://files.catbox.moe/9qta07.jpg)

设置背景图片
![](https://files.catbox.moe/qa5cx5.jpg)

设置状态栏
![](https://files.catbox.moe/ip25gb.jpg)

* 下载[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

* 安装[spaceship]主题(https://spaceship-prompt.sh/zh/getting-started/)
装完`spaceship`需要在终端启用`powerline font`,此时你需要在选择下载某些字体，比如如下：
  * FiraCode: https://github.com/tonsky/FiraCode
  * source-code-pro: https://github.com/adobe-fonts/source-code-pro

### plugins
* zsh-autosuggestions 命令行提供功能，会缓存你最近输入过的命令并给出提示，[安装指南](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)
* npm npm的命令提示，[安装指南](https://github.com/lukechilds/zsh-better-npm-completion)
* yarn yarn的命令提示，[安装指南](https://github.com/chrisands/zsh-yarn-completions)

### 常用终端快捷键
1. 将光标移动到行首：ctrl + a

2. 将光标移动到行尾：ctrl + e

3. 清除屏幕：ctrl + l

4. 搜索以前使用命令：ctrl + r

5. 清除当前行：ctrl + u

6. 清除至当前行尾：ctrl + k

7. 单词为单位移动：option + 方向键

8. CTRL+W：删除光标前一个单词（根据空格识别单词分隔）

9. CTRL+Y：粘贴之前（CTRL+U/K/W）删除的内容

10. ESC+B：光标向左移动一个单词，移动完要放开ESC和B键

11. ESC+F：光标向右移动一个单词，移动完要放开ESC和F键

## fig
[fig](https://fig.io/)搭配item2使用更佳

<video src="https://fig.io/videos/main-demo-grey.mp4" controls="controls" width="500" height="300">您的浏览器不支持播放该视频！</video>

## BetterAndBetter
更好是使用你的键盘和触摸板，例如：
1. 用快捷键将App快速分屏
2. 用手势将App变成全屏
等等，自定义属于自己的快捷键，例如我常用的快捷键：

![](https://files.catbox.moe/pvogof.jpg)


## utool 与
国内版的utool

### utool
[utool](https://u.tools/)有很多好用的插件列表：
* hosts：更改本机的host文件
* 翻译：整合了网易、搜狗、腾讯翻译（本来是有谷歌的，后面更新给没了）
* 网页快开：快速搜索 关键字
* 图床：免费的图片上传工具


### raycast
[raycast](https://www.raycast.com/)很类似utool，功能也超多，风格会更好看一点。

## 邮件

![mail_add_group](https://files.catbox.moe/oytx3n.jpg)


![](https://files.catbox.moe/6nnvhq.jpg)

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

# 结尾

## 🤔 小结
Mac好用的软件特别多，如果你觉得有更好的技巧和工具可在评论中贴出，不胜感激~

**Have A Good Day!!!**
