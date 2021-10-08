(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{410:function(t,r,a){"use strict";a.r(r);var e=a(4),s=Object(e.a)({},(function(){var t=this,r=t.$createElement,a=t._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"函数柯里化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#函数柯里化"}},[t._v("#")]),t._v(" 函数柯里化")]),t._v(" "),a("p",[t._v("柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。通俗点说就是将一个函数拆分成多个函数，是固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数，目的是为了缩小适用范围，创建一个针对性更强的函数。")]),t._v(" "),a("p",[a("strong",[t._v("主要是为了增加函数的可复用性")])]),t._v(" "),a("h3",{attrs:{id:"解释器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#解释器"}},[t._v("#")]),t._v(" 解释器")]),t._v(" "),a("p",[t._v("由于JS是解释型语言，JS引擎需要逐行编译为可执行的代码，可执行的代码有很多形式，其中叫较为常见的有基于"),a("code",[t._v("AST")]),t._v("直接执行及"),a("code",[t._v("ByteCode")]),t._v("的执行方式")]),t._v(" "),a("h2",{attrs:{id:"异或"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#异或"}},[t._v("#")]),t._v(" 异或")]),t._v(" "),a("p",[t._v("XOR是"),a("code",[t._v("exclusive OR")]),t._v("的缩写。英语的exclusive意思是”专有的、独有的“，可以理解为XOR是更单纯的OR运算。")]),t._v(" "),a("p",[t._v("我们知道，OR 运算的运算子有两种情况，计算结果为true。")]),t._v(" "),a("p",[t._v("（1）一个为 true，另一个为 false;")]),t._v(" "),a("p",[t._v("（2）两个都为 true。")]),t._v(" "),a("p",[t._v("上面两种情况，有时候需要明确区分，所以引入了 XOR。")]),t._v(" "),a("p",[t._v("XOR 排除了第二种情况，只有第一种情况（一个运算子为true，另一个为false）才会返回 true，所以可以看成是更单纯的 OR 运算。也就是说， XOR 主要用来判断两个值是否不同。")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://www.ruanyifeng.com/blog/2021/01/_xor.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("阮一峰的XOR文章"),a("OutboundLink")],1)]),t._v(" "),a("h2",{attrs:{id:"js与native交互"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#js与native交互"}},[t._v("#")]),t._v(" JS与native交互")]),t._v(" "),a("h3",{attrs:{id:"android调用js代码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#android调用js代码"}},[t._v("#")]),t._v(" Android调用JS代码")]),t._v(" "),a("ol",[a("li",[t._v("通过WebView的loadUrl()")]),t._v(" "),a("li",[t._v("通过WebView的evaluateJavaScript()")])]),t._v(" "),a("h3",{attrs:{id:"js调用android代码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#js调用android代码"}},[t._v("#")]),t._v(" JS调用Android代码")]),t._v(" "),a("ol",[a("li",[t._v("通过WebView的addJavascriptInterface（）进行对象映射")]),t._v(" "),a("li",[t._v("通过 WebViewClient 的shouldOverrideUrlLoading ()方法回调拦截 url")]),t._v(" "),a("li",[t._v("通过 WebChromeClient 的onJsAlert()、onJsConfirm()、onJsPrompt（）方法回调拦截JS对话框alert()、confirm()、prompt（） 消息")])]),t._v(" "),a("h2",{attrs:{id:"script中的async和defer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#script中的async和defer"}},[t._v("#")]),t._v(" script中的async和defer")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://juejin.cn/post/6894629999215640583",target:"_blank",rel:"noopener noreferrer"}},[t._v("async和defer区别"),a("OutboundLink")],1)]),t._v(" "),a("h2",{attrs:{id:"栈和堆"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#栈和堆"}},[t._v("#")]),t._v(" 栈和堆")]),t._v(" "),a("h3",{attrs:{id:"为什么一定要分-堆-和-栈-两个存储空间？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#为什么一定要分-堆-和-栈-两个存储空间？"}},[t._v("#")]),t._v(" 为什么一定要分“堆”和“栈”两个存储空间？")]),t._v(" "),a("p",[t._v("因为JS引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间大了的话，所有的数据都存放栈空间中，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。")]),t._v(" "),a("h3",{attrs:{id:"闭包是存在与堆中"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#闭包是存在与堆中"}},[t._v("#")]),t._v(" 闭包是存在与堆中")]),t._v(" "),a("p",[t._v("以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个“closure(something)”的对象（这是一个内部对象，JavaScript 是无法访问的）")])])}),[],!1,null,null,null);r.default=s.exports}}]);