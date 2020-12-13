---
title: '前端开发环境'
sidebarDepth: 2
sidebar: auto
categories: frontEnd
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
::: tip
官网的命令是:`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

正常情况下，`https://raw.githubusercontent.com`这个域名会被墙，但是如果你有科学上网就可以用端口代理的是方式来处理这个网址：`export ALL_PROXY=socks5://127.0.0.1:1086`

这里的1086是小飞机的端口，这样拉取这个文件就走代理了。
:::
或者用更传统的方法：
* 第一步，获取install文件
把官网给的脚本拿下来，将下面这个地址的`install.sh`下载到本地，并且将权限改为777：`sudo chmod 777 install.sh`，然后执行.sh文件:`./install.sh`
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
![](../../../.vuepress/public/env1.png)
在安装好后，确认brew的安装，在终端中运行`brew -v`，如果出现两个版本号就证明安装成功。一个是`Homebrew`，一个是`Homebrew/homebrew-core`<br/>
当我们用`brew`安装插件的时候，每次都会自动检查当前brew是不是最新的，所以我们需要替换镜像，我们上面已经找到`BREW_REPO`，所以下面只需执行后两句，替换`homebrew-core`的镜像就可以。
```
cd "$(brew --repo)"

git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"

git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```
## node
可以利用`brew`安装`node`后，`npm xx -g`就不会有权限问题：`brew install node`

如果是官网下载安装包的话，默认是在`/usr/local`，可以用`npm config get prefix`查下，所以需要我们修改文件夹的权限：`sudo chown -R $USER /usr/local/{lib/node_modules,bin,share}`：表示把`/usr/local`下的`lib/node_modules`、`bin`、`share`所有权更改为当前用户，即拥有`root`权限
## Terminal

一个好看又好用的终端，往往可以节省很多工作时间。推荐iTerm2 + oh-my-zsh。

`iterm2: https://www.iterm2.com/`

`oh-my-zsh: https://github.com/robbyrussell/oh-my-zsh`

### 终端快捷键
1、将光标移动到行首：ctrl + a

2、将光标移动到行尾：ctrl + e

3、清除屏幕：                ctrl + l

4、搜索以前使用命令：ctrl + r

5、清除当前行：            ctrl + u

6、清除至当前行尾：    ctrl + k

7、单词为单位移动：option + 方向键

## eslint
### rule
```js
    // 关闭 禁止使用console，生产环境不能使用console
    'no-console': 'off',
    // 关闭 使用debugger，生产环境不能使用
    'no-debugger': 'off',
    // 关闭 禁止对函数参数再赋值，在使用map时会使用参数更改
    'no-param-reassign': 'off',
    // 关闭 强制 generator 函数中 * 号周围有空格
    'generator-star-spacing': 'off',
    // 强制缩进2格
    indent: ['error', 2],
    // 关闭 禁用不必要的转义字符
    'no-useless-escape': 'off',
    // 关闭 使用eval
    'no-eval': 'off',
    // 关闭 禁用未声明的变量
    'no-undef': 'off',
    // 开启 禁止使用拖尾逗号
    'comma-dangle': ['error', 'never'],
    // 关闭函数名()的前面加空格
    'space-before-function-paren': 'off',
    // 关闭代码末尾空行
    'no-trailing-spaces': 'off',
    // 禁止块内填充(不加多的空行)
    'padded-blocks': ['error', 'never'],
    // 不允许空行
    'no-empty': 'error',
    // 禁用封号
    semi: ['error', 'never'],
    // 允许全局属性的使用，比如isNaN()
    'no-restricted-globals': ['error', 'event'],
    // 允许函数根据代码分支有不同的return行为,可以return,也可以return false
    'consistent-return': 'off',
    // 关闭对function是否命名的禁用
    'func-names': 'off',
    // 关闭对continue的禁用
    'no-continue': 'off',
    // 关闭在数组里面必须return
    'array-callback-return': 'off',
    // 关闭禁止使用特定的语法
    'no-restricted-syntax': 'off',
    // 要求箭头函数的参数使用圆括号，且当只有一个参数不需要括号
    'arrow-parens': 'as-needed',
```

## babel
::: tip babel
babel是一个Javascript编译器，是目前前端开发最常用的工具之一，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境。比如在代码中使用了ES6的箭头函数，这种写法在IE里面是会报错的，为了让代码能在IE中运行，就需要将代码编译成IE支持的写法，这就是babel的工作。
:::
### package.json方式
```js
//package.json
{
   "name":"babel-test",
   "version":"1.0.0",
   "devDependencies": {
       "@babel/core":"^7.4.5",
       "@babel/cli":"^7.4.4",
       "@babel/preset-env":"^7.4.5"
   }
   "babel": {
       "presets": ["@babel/preset-env"]
   }
}
```
### .babelrc和.babelrc.js是同一种配置方式，只是文件格式不同，一个是json文件，一个是js文件。
.babelrc
```js
{
    "presets": ["@babel/preset-env"]
}
```
.babelrc.js
```js
//webpack的配置文件也是这种写法
module.exports = {
    presets: ['@babel/preset-env']
}
```
这两个配置文件是针对文件夹的，即该配置文件所在的文件夹包括子文件夹都会应用此配置文件的设置，而且下层配置文件会覆盖上层配置文件，通过此种方式可以给不同的目录设置不同的规则。
### babel.config.js
babel.config.js虽然写法和.babelrc.js一样，但是babel.config.js是针对整个项目，一个项目只有一个放在项目根目录。

## 配置linux的node服务

1. 下载node文件到本地，桌面的文件夹/upload/node-v10.16.2-linux-x64.tar.xz
2. 用scp从本地拷贝到linux，现在linux的/home目录下新建一个文件夹，这里叫groot

```
scp ~/Desktop/upload/node-v10.16.2-linux-x64.tar.xz root@ip:/home/groot
```

如果有端口的话在scp后面加 -P 20000(端口号)
3. 在linux解压，并且安装

```
cd /home/groot
tar -xvf node-v10.16.2-linux-x64.tar.xz // 解压
mv node-v10.16.2-linux-x64 nodejs // 重命名文件夹
ln -s /home/groot/nodejs/bin/npm /usr/local/bin // 将node的二进制文件和linux的二进制文件建立软连接
ln -s /home/groot/nodejs/bin/node /usr/local/bin // 将node的二进制文件和linux的二进制文件建立软连接
node -v // 检查node版本,如果没有报错并且显示出来版本号说明成功了
```

### on-my-zsh
`Oh My Zsh` 默认自带了一些默认主题，存放在 `~/.oh-my-zsh/themes` 目录中。我们可以查看这些主题`cd ~/.oh-my-zsh/themes`

一般情况下，我们自己下载的主题或插件都会放在`~/.oh-my-zsh/themes` or `~/.oh-my-zsh/plugins`

有时候需要PowerLine fonts，安装完成后需要去Item2里面的`profile->text->Font`选择你已安装的Powerline font，vscode需要去setting里面添加:`terminal.integrated.fontFamily": "Source Code Pro for Powerline`

#### 个人强烈推荐的插件
**zsh-autosuggestions**
`git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions`

`vi ~/.zshrc`

`plugins=(git zsh-autosuggestions)`

[ohmyzsh命令提示插件](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)

### 小飞机终端代理
`vi ~/.zshrc`添加

```js
alias setproxy="export ALL_PROXY=socks5://127.0.0.1:1086"
alias unsetproxy="unset ALL_PROXY"
```

`127.0.0.1:1086`中的1086是小飞机的本地Socks5的监听端口

### Nginx反向代理
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

