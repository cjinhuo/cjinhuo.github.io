---
title: 'webpack'
  # 大标题
sidebarDepth: 3
sidebar: auto
categories: frontEnd
date: 2019-02-12
# 时间
tags:
- webpack
- 前端工程化
# 标签
---

::: tip 概述
前端工程化的工具
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

## hash、chunkHash、contentHash的区别
### hash
如果都使用hash的话，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

### chunkHash
chunkHash根据不同的入口文件(entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用`chunkhash`的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

### contentHash
contenthash是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变，所以我们可以通过contenthash解决上诉问题。

## Optimization
### splitChunks
::: tip
缓存组的公共配置，需要满足splitChunks的所有条件后才能进去判断缓存组。
:::
### runtimeChunk
::: tip
解决了文件名变换，导致缓存失效的问题。
:::
```js
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    }
  }
```
当打包后生成a,b,c模块，每个模块都自己的hash值，其中a引用了c，b引用了c，当c发生改变时，c对应的hash变了，正常情况下a,b的hash也会变，这时需要runtimeChunk来作为一个文件中心（包含每个文件的hash值），a，b只要向runtimeChunk获取c的文件内容就行，这样就浏览器就不会重新请求a，b文件。


## Simba前端webpack优化策略

## 优化对比
优化前（启动四个模块）：

* 第一次构建:77000ms ~ 82000ms
* 热更新:17000ms ~ 21000ms

优化后（启动两个模块）：

* 第一次构建:39000ms - 43000ms
* 热更新:1500ms ~ 3000ms


## 更改source map
在测试环境下source map改为:`eval-source-map`

`source-map`： 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度。

`eval-source-map`：使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项。



## 动态引入模块
在router根文件引入当前开发所需的模块即可。由于import是在编译时执行的所以需要在文件中禁掉模块后再构建项目。

```js
//import a from 'path'
//import b from 'path'
import c from 'path'
export defaut{
//	a,
//	b,
	c
}
```

### 脚本思路
在项目中新建脚本，在package.json中传入参数来决定是否注释哪些模块。比如：

```js
"npm run dev:c": "node ./myScript.js a b && webpack-server"
```

就表示注释掉a,b两模块。

脚本内容：获取原有的路由文件`originIndex.js`进行注释，然后写入到新文件`index.js`，项目构建时入口点是`index.js`

## babel升级
1. "babel-core": "^6.22.1" => "^7.0.0"
2. "babel-loader": "^7.1.1" =>  "^8.0.0"
3. "babel-plugin-transform-vue-jsx": "^3.5.0" =>  "^4.0.1"
4. "babel-eslint": "^8.2.1" => "^9.0.0"
5. 更新.babelrc文件以支持webpack4

## Vue 升级
1. "vue": "^2.5.2" => "^2.6.11"
2. "vue-template-compiler": "^2.5.2" => "^2.6.11"
3. "vue-loader": "^13.3.0" => "^15.9.0"
4. 新增"@vue/component-compiler-utils": "^1.3.1"
5. "vue-style-loader": "^3.0.1" => "^4.1.2"

## webpack升级
1. "webpack": "^3.6.0" => "^4.42.0"
2. "webpack-dev-server": "^2.9.1" => "^3.10.3"
3. "webpack-dev-server": "^2.9.1" => "^3.10.3"
4. "webpack-merge": "^4.1.0" => "^4.2.2"

### 插件升级与弃用
1. "html-webpack-plugin": "^2.30.1" => "^3.2.0"
2. "extract-text-webpack-plugin": "^3.0.0"不再支持webpack4，弃用，使用"mini-css-extract-plugin"替换
3. "uglifyjs-webpack-plugin": "^1.1.1"不在维护，弃用

### loader升级
1. "url-loader": "^1.1.1" => "^3.0.0"
2. "file-loader": "^1.1.4 => "^1.1.11"
3. "optimize-css-assets-webpack-plugin": "^3.2.0" => "^4.0.0"

### 新增插件
1. "happypack": "^5.0.1"不支持"vue-loader":"^15.9.0"，用来加速打包babel-loader
2. "terser-webpack-plugin": "^2.3.5"用来代替uglifyjs-webpack-plugin
3. "mini-css-extract-plugin": "^0.9.0"
2. "hard-source-webpack-plugin": "^0.13.1"没有使用，提升效果不是很明显
3. "compression-webpack-plugin": "^3.1.0"没有使用，服务端没有配置gzip

### 配置优化
1. 新增optimization配置

```js
  optimization:{
    splitChunks: {
        cacheGroups: {
            commons: {
                minSize: 2 * 1024 * 1024,
                test: /[\\/]node_modules[\\/]/,
                // cacheGroupKey here is `commons` as the key of the cacheGroup
                name(module, chunks, cacheGroupKey) {
                    const moduleFileName = module.identifier().split('/').reduceRight(item => item);
                    const allChunksNames = chunks.map((item) => item.name).join('~');
                    return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                },
                chunks: 'initial'
            },
        }
    },
      minimize: true,
      minimizer: [
          new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: config.build.productionSourceMap,
              terserOptions: {
                  warnings: false,
                  // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              }
          }),
      ],
    runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
```
2.

```js
        new HappyPack({
            id: 'babel',
            loaders: [
                {
                    loader: 'babel-loader',
                    cacheDirectory: true
                },
            ],
            threadPool: happyThreadPool,
            debug: true
        })
```


超链接 [文本](URL)
<!-- ../../../.vuepress/public/line-height.png) -->
图片 ![](url)

