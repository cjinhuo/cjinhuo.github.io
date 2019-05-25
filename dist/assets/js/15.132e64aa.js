(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{247:function(e,r,t){e.exports=t.p+"assets/img/env1.289a259c.png"},297:function(e,r,t){"use strict";t.r(r);var s=t(0),n=Object(s.a)({},function(){var e=this,r=e.$createElement,s=e._self._c||r;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[e._v("概述")]),e._v(" "),s("p",[e._v("对于前端开发而言，鉴于Node.js及一些三方依赖包在Windows环境下有兼容性坑，因此macOS无疑是最佳选择。")])]),e._v(" "),s("h2",{attrs:{id:"brew"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#brew","aria-hidden":"true"}},[e._v("#")]),e._v(" brew")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("第一步，获取install文件\n把官网给的脚本拿下来，\b将下面这个地址的源码放入名为brew_install的文件里面，并保存在当前目录\n"),s("code",[e._v("curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install >> brew_install")])])]),e._v(" "),s("li",[s("p",[e._v("第二步，更改脚本中的资源链接，替换成清华大学的镜像\n就是把这两句"),s("br"),e._v(" "),s("code",[e._v("BREW_REPO = “https://github.com/Homebrew/brew“.freeze")]),s("br"),e._v(" "),s("code",[e._v("CORE_TAP_REPO = “https://github.com/Homebrew/homebrew-core“.freeze")]),e._v(" "),s("br"),e._v("\n更改为这两句 "),s("br"),e._v(" "),s("code",[e._v("BREW_REPO = “https://mirrors.ustc.edu.cn/brew.git “.freeze")]),s("br"),e._v(" "),s("code",[e._v("CORE_TAP_REPO = “https://mirrors.ustc.edu.cn/homebrew-core.git“.freeze")]),s("br"),e._v("\n当然如果这个镜像有问题的话，可以换成别的")])]),e._v(" "),s("li",[s("p",[e._v("第三步，执行脚本\n"),s("code",[e._v("/usr/bin/ruby brew_install")])])])]),e._v(" "),s("p",[e._v("但是我用的时候没有找到CORE_TAP_REPO，会出现以下情况，有耐心，多等会。\n"),s("img",{attrs:{src:t(247),alt:""}}),e._v("\n在安装好后，确认brew的安装，在终端中运行"),s("code",[e._v("brew -v")]),e._v("，如果出现两个版本号就证明安装成功。一个是"),s("code",[e._v("Homebrew")]),e._v("，一个是"),s("code",[e._v("Homebrew/homebrew-core")]),s("br"),e._v("\n当我们用"),s("code",[e._v("brew")]),e._v("安装插件的时候，每次都会自动检查当前brew是不是最新的，所以我们需要替换镜像，我们上面已经找到"),s("code",[e._v("BREW_REPO")]),e._v("，所以下面只需执行后两句，替换"),s("code",[e._v("homebrew-core")]),e._v("的镜像就可以。")]),e._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v('cd "$(brew --repo)"\n\ngit remote set-url origin https://mirrors.ustc.edu.cn/brew.git\n\ncd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"\n\ngit remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git\n')])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br"),s("span",{staticClass:"line-number"},[e._v("6")]),s("br"),s("span",{staticClass:"line-number"},[e._v("7")]),s("br")])]),s("h2",{attrs:{id:"terminal"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#terminal","aria-hidden":"true"}},[e._v("#")]),e._v(" Terminal")]),e._v(" "),s("p",[e._v("一个好看又好用的终端，往往可以节省很多工作时间。推荐iTerm2 + oh-my-zsh。")]),e._v(" "),s("p",[s("code",[e._v("iterm2: https://www.iterm2.com/")])]),e._v(" "),s("p",[s("code",[e._v("oh-my-zsh: https://github.com/robbyrussell/oh-my-zsh")])])])},[],!1,null,null,null);r.default=n.exports}}]);