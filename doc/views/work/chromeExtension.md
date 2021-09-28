---
title: '谷歌插件的开发'
description: '谷歌插件的内部通讯'
sidebarDepth: 2
sidebar: auto
date: 2019-01-12
categories: 
- work
tags:
- 谷歌插件
---

## 谷歌插件的大致内容

background.js:背景页，当你的插件被挂载在浏览器的一瞬间开始执行，当你刷新插件和浏览器重启时，也会重新执行里面的代码<br>
content.js:content可能不止一个，因为manifest.json里面的content_scripts配置项可以加好几个content.js，它是用来插入到某个网页的代码，比如当manifest.json的配置如下:
``` js
    "content_scripts": [{
      "matches": ["https://www.baidu.com"],  //必选，指定内容脚本要插入到哪些页面中去
      "exclude_matches": ["https://www.baidu.com/test/"], //可选。排除不需要插入内容脚本的页面
      "js": ["content.js"], //可选。要插入匹配页面的 JavaScript 文件列表，它们将按照数组中指定的顺序插入
      "css":["global.css"],
      "run_at": "document_start", //
      "all_frames": false //默认为 false，意味着仅在顶层框架中运行
    }],
```

::: tip
content_scripts是一个数组，说明可以对多个网站进行代码嵌入<br/>
"run_at"表示你的content.js要在什么时候嵌入到网站<br/>
"document_start":这些文件将在 css 中指定的文件之后，但是在所有其他 DOM 构造或脚本运行之前插入，也就是目标页的文档节点加载完之前就注入content.js了，这或许会让你代码里面的document.querySelector()不会达到你预期的效果，详情可查看[ContentAPI](https://crxdoc-zh.appspot.com/extensions/content_scripts)
:::

## 插件的内部通讯
我涉及到的有background主动与content通讯，content主动与background通讯，前端页面主动与backgr

### background与content通讯

content.js
``` js
chrome.runtime.sendMessage({
    type: 'checkInfo'     // 这个是你想发送到background的参数对象
  }, function (response) {
    if (response.type === 'ok') {
      console.log(response.username) // test
    }
  };
```

background.js
``` js
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  // request就是上面content发送过来的type: 'checkInfo',一个对象可以是任何数据
  if (request.type == 'checkInfo') {
    sendResponse({type: 'ok',username: 'test'})
  }
})
```

上面的代码是content主动与background通讯，相反也是可以的，background也可以主动与content通讯，把代码换下就OK了

### 前端页面与background通讯

前端页面.js

``` js
        let extensionId = '' //你要通讯的插件的id，每个插件的id都是唯一的
        chrome.runtime.sendMessage(extensionId, {
          type: 'getMessage'
        }, response => {
          if (!response){
            console.log(response) //这是background的sendMessage返回来得信息
          }
        })
```

background.js

``` js
chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendMessage){
    if(request.type === 'getMessage'){
      sendMessage('接受成功，返回对象')  // 把前端需要的信息填在sendMessage即可，
    }
  }
)
```
既然前端可以访问background，那么background也可以访问前端页面，这个我没试过，详情可查看[通讯API](https://crxdoc-zh.appspot.com/extensions/runtime)（中文版谷歌插件API，需防墙）

## 插件拦截ajax请求

插件可以实时地拦截、阻止或修改请求，比如下面的代码可以拦截请求，让某个请求的响应不能返回给页面。

``` js
 chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          return {cancel: details.url.indexOf("www.baidu.com") != -1};
        },
        {urls: ["<all_urls>"]},
        ["blocking"]);
```
将这段代码插入到某个页面时，会拦截所有包含"www.baidu.com"的ajax请求，详情可查看[操作请求API](https://crxdoc-zh.appspot.com/extensions/webRequest)，看到最后，虽然插件可以拦截、阻止或修改请求，但是获取不到请求的结果，这是最坑爹的，所以有什么办法呢？既然我们可以在任何时间对页面进行代码注入，所以我们就可以重写网页的内置函数。

### 拦截请求并且获取请求返回来的结果

我们在网页上面的head节点一加载完就插入如下代码：
``` js
let myFetch = window.fetch; // 把原本的fetch存在变量，下面重写fetch函数
window.fetch = function (url, options) {
  return new Promise(function (resolve, reject) {
    let fetchPromise = myFetch(url, options);
    fetchPromise.then(function (response) {
      if (index) {
        response.clone().json().then(
          data => {
            // 这是获取请求返回来的结果
            //你可以对结果进行操作
        });
      }
      return resolve(response);
    });

    fetchPromise.catch(err => {
      return reject(err);
    });
  });
};
```

::: tip clone()的用法
Response 接口的 clone() 方法创建了一个响应对象的克隆，这个对象在所有方面都是相同的，但是存储在一个不同的变量中。

如果已经使用了响应 Body，clone() 会抛出TypeError。 实际上，clone()存在的主要原因是允许多次使用Body对象(当它们是一次性使用的时候)。

简单来说，当你没加clone()时，response是一次性用品，用过了再返回给原本网页，它就不接受，加了clone()后，就可以多次使用。
:::





