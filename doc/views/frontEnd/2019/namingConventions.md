---
title: '命名规范'
categories: frontEnd
date: 2019-02-25
# 时间
tags:
- 命名规范
---

::: tip 概述
“风格” 的含义涵盖范围甚广，从 “变量使用驼峰格式” 到 “禁止使用全局变量” ，再到 “禁止使用异常” 。
如果代码风格统一，我们就有了一个共同思维的环境。每个开发人员就可以专注于业务逻辑，而不是先搞明白这坨代码是谁写的，它是什么意思，为什么要这样写...

虽然我们在这里提出统一，但只是想让大家都知晓并借鉴而对自己的风格进行修正。

我们不做独裁者，也不会强迫你每一行代码应该怎么写，而是把一些大家存在争议，或可以提高团队效率的开发原则进行声明和约定。
:::

## 项目命名
全部采用小写方式，以短划线分隔。<br>
例如：project，my-project-name
## 目录命名
全部采用小写方式，复数形式。有多个单词时，以下划线分割。<br>
例如：styles，utils，node_modules
## JS文件命名
全部采用小写方式，以短划线分隔。<br>
例如：build-plugins.js，check-versions.js
## CSS，SCSS 文件命名
全部采用小写方式，以短划线分隔。<br>
例如：custom-forms.scss，bootstrap-reboot.scss
## HTML 文件命名
全部采用小写方式，以短划线分隔。<br>
例如：error-report.html，user-list.html
## 资源文件命名
全部采用小写方式，使用下划线分割。语法规则：<br>
`<WHAT>_<WHERE>_<DESCRIPTION>_<SIZE>`<br>
例如：icon_menu_dashboard_48.svg，logo_footer_white_small.svg
## 资源协议
::: tip 资源协议
尽可能使用 HTTPS 协议对嵌入式资源进行引用。
:::
所有图片及其它媒体文件、CSS 样式表和 JS 脚本都建议使用 HTTPS 协议（https:），除非指定的文件不支持 HTTPS 。

不推荐：省略协议声明<br>
`<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>`<br>
不推荐：使用 HTTP 协议<br>
`<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>`<br>
推荐<br>
`<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>`<br>
不推荐：省略协议声明<br>
`@import '//fonts.googleapis.com/css?family=Open+Sans';`<br>
不推荐：使用 HTTP 协议<br>
`@import 'http://fonts.googleapis.com/css?family=Open+Sans';`<br>
推荐<br>
`@import 'https://fonts.googleapis.com/css?family=Open+Sans';`<br>
## 代码格式
* 缩进 <br>
一次缩进2个空格
不要使用制表符（tab）或多个空格进行缩进，禁止混合使用。
``` html
<ul>
  <li>Fantastic
  <li>Great
</ul>
.example {
  color: blue;
}
```
* 大小写 <br>
所有代码必须为小写：适用于 HTML 元素名称、属性、属性值（除非是 text/CDATA），CSS 选择器、属性和属性值（除字符串之外）。
不推荐<br>
`<A HREF="/">Home</A>`<br>
推荐<br>
`<img src="google.png" alt="Google">`<br>
不推荐<br>
`color: #E5E5E5;`<br>
推荐<br>
`color: #e5e5e5;`<br>
* 行尾空格
删除行尾空格
行尾空格没必要存在，且会增加文件对比复杂度。
不推荐
```html
<p>What?_
```
推荐
```html
<p>Yes please.
```
## 样式规则
* 文档类型 <br>
使用HTML5标准
> HTML5（HTML 语法）是目前所有 HTML 文档类型中的首选： `<!DOCTYPE html> `
>> 推荐使用 HTML 文本文档格式，即 text/html ；不要使用 XHTML，即 application/xhtml+xml 。有两个浏览器完全不支持，还比 HTML 用更多的存储空间。

尽管使用 HTML 会更好，但请不要关闭空元素。例如：使用 `<br>`,而不是 `<br />` 。
* 代码有效性
尽量使用有效的HTML代码

不推荐
``` html
<title>Test</title>
<article>This is only a test.
```
推荐
```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```
* 语义
根据HTML各个元素的用途而去使用它们<br>
使用元素 (有时候错称其为“标签”) 要知道为什么去使用它们和是否正确。 例如，用 heading 元素构造标题，p 元素构造段落，a 元素构造锚点等。<br>
根据 HTML 各个元素的用途而去使用是很重要的，它涉及到文档的可访问性、重用和代码效率等问题。<br>

不推荐
```html
<div onclick="goToRecommendations();">All recommendations</div>
```
推荐
```html
<a href="recommendations/">All recommendations</a>
```
* 关注点分离 <br>
将表现和行为分开
严格保持结构（标记）、表现（样式）、和行为（脚本）分离, 并尽量让这三者之间的交互保持最低限度。
* 实体引用 <br>
不要用实体引用
不需要使用类似`&mdash;`、`&rdquo;`和`&#x263a;`等的实体引用, 假定团队之间所用的文件和编辑器是同一编码（UTF-8）。
* type 属性 <br>
在样式表和脚本的标签中忽略 type 属性<br>
在样式表（除非不用 CSS）和脚本（除非不用 JavaScript）的标签中 不写 type 属<br>
HTML5 默认 type 为 text/css 和 text/javascript 类型，所以没必要指定。即便是旧的浏览器也是支持的。<br>
不推荐
```html
<link rel="stylesheet" href="//www.google.com/css/maia.css"
  type="text/css">
```
推荐
```html
<link rel="stylesheet" href="//www.google.com/css/maia.css">
```
不推荐
```html
<script src="//www.google.com/js/gweb/analytics/autotrack.js"
  type="text/javascript"></script>
```
推荐
```html
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```
## 代码格式
* 格式
每个块元素、列元素或表格元素都独占一行，每个子元素都相对父元素进行缩进<br>
独立元素的样式（因为 CSS 允许元素为每个 display 属性呈现不同的角色），将块元素、列表元素或表格元素都放在新的一行。<br>
另外，需要缩进块元素、列表元素或表格元素的子元素。<br>
例如
```html
<blockquote>
  <p><em>Space</em>, the final frontier.</p>
</blockquote>
<ul>
  <li>Moe
  <li>Larry
  <li>Curly
</ul>
<table>
  <thead>
    <tr>
      <th scope="col">Income
      <th scope="col">Taxes
  <tbody>
    <tr>
      <td>$ 5.00
      <td>$ 4.50
</table>
```
* 换行
虽然对于 HTML 没有行上限的建议，但是对长代码进行换行，可以显著提高代码可读性。<br>
当使用换行时，新行至少要缩进 4 个额外的空格以与上文保持对齐。<br>
```html
<md-progress-circular md-mode="indeterminate" class="md-accent"
    ng-show="ctrl.loading" md-diameter="35">
</md-progress-circular>
<md-progress-circular
    md-mode="indeterminate"
    class="md-accent"
    ng-show="ctrl.loading"
    md-diameter="35">
</md-progress-circular>
<md-progress-circular md-mode="indeterminate"
                      class="md-accent"
                      ng-show="ctrl.loading"
                      md-diameter="35">
</md-progress-circular>
```
* 行号
引用属性值时，请使用双引号
在属性值两边使用双引号（""）而不是单引号（''）。
不推荐
```html
<a class='maia-button maia-button-secondary'>Sign in</a>
```
推荐
```html
<a class="maia-button maia-button-secondary">Sign in</a>
```
## 样式规则
* 代码有效性
尽量使用有效的CSS代码。用类似[https://jigsaw.w3.org/css-validator/#validate_by_uri](W3C CSS validator)<br>
* ID和Class命名
非必要的情况下，ID 和 class 的名称应尽量简短。<br>
简要传达 ID 或 class 是关于什么的。<br>
通过这种方式，写的代码易懂且高效。<br>
不推荐
```css
#navigation {}
.atr {}
```
推荐
```css
#nav {}
.author {}
```
* 类型选择器 <br>
避免使用CSS类型选择器<br>
非必要的情况下不要使用元素标签名和ID或class进行组合<br>
出于性能上的考虑避免使用父辈节点做选择器
不推荐
```css
ul#example {}
div.error {}
```
推荐
```css
#example {}
.error {}
```
* 属性缩写 <br>
CSS很多属性都支持缩写shorthand （例如 font ） 尽量使用缩写，甚至只设置一个值<br>
使用缩写可以提高代码的效率和方便理解。<br>
不推荐
```css
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
```
推荐
```css
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```
* 0和单位 <br>
省略0后面的单位。
非必要的情况下0后面不用加单位。
```css
margin: 0;
padding: 0;
```
* 0开头的小数 <br>
省略0开头小数点前面的0。<br>
值或长度在 -1 与 1 之间的小数，小数前的 0 可以忽略不写。<br>
`font-size: .8em;`
* URL外的引号 <br>
不要在 url() 里用 ( "" 或 '' ) 。
`@import url(//www.google.com/css/go.css);`
* 前缀 <br>
选择器前面加上特殊应用标识的前缀（可选）。
大型项目中最好在ID或class前加上标示性前缀（命名空间），使用短破折号链接。
使用命名空间可以防止命名冲突，方便维护，比如在搜索和替换操作上。
```css
.adw-help {} /* AdWords */
#maia-note {} /* Maia */
```
* ID 和 Class 分隔符 <br>
ID和class名称有多单词组合的用短破折号'-'分开
别在选择器名字里用短破折号 “-” 以外的连接词(包括啥也没有)，以增进对名字的理解和查找。

不推荐：“demo” 和 “image” 中间没加 “-”
```css
.demoimage {}
```
不推荐：用下划线 “_” 是屌丝的风格
```css
.error_status {}
```
推荐
```css
#video-id {}
.ads-sample {}
```
## 代码格式
* 声明顺序 <br>
依字母顺序进行声明。
都按字母顺序声明，很容易记住和维护。(a-z)
```css
background: fuchsia;
border: 1px solid;
-moz-border-radius: 4px;
-webkit-border-radius: 4px;
border-radius: 4px;
color: black;
text-align: center;
text-indent: 2em;
```
* 代码块缩进 <br>
缩进所有代码块内容。<br>
缩进所有代码块的内容，它能够提高层次结构的清晰度。<br>
* 声明完结 <br>
所有声明都要用“;”结尾。<br>
考虑到一致性和拓展性，请在每个声明尾部都加上分号。

不推荐
```css
.test {
  display: block;
  height: 100px
}
```
推荐
```css
.test {
  display: block;
  height: 100px;
}
```
* 属性名完结 <br>
在属性名冒号结束后加一个空字符。
出于一致性的原因，在属性名和值之间加一个空格。

不推荐
```css
h3 {
  font-weight:bold;
}
```
推荐
```css
h3 {
  font-weight: bold;
}
```
* 声明块分隔符 <br>
在最后一个选择器和声明块之间加一个空字符。
建议在最后一个选择器和声明块开始标记之间加一个空格。
不推荐：缺少空格
```css
#video{
  margin-top: 1em;
}
```
不推荐：不必要的换行
```css
#video
{
  margin-top: 1em;
}
```
推荐
```css
#video {
  margin-top: 1em;
}
```
* 选择器和声明分行 <br>
每个选择器和声明都要独立新行。<br>
不推荐
```css
a:focus, a:active {
  position: relative; top: 1px;
}
```
推荐
```css
h1,
h2,
h3 {
  font-weight: normal;
  line-height: 1.2;
}
```
