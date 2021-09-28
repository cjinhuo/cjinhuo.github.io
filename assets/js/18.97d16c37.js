(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{360:function(t,a,s){t.exports=s.p+"assets/img/symbolic_link.b030e638.png"},361:function(t,a,s){t.exports=s.p+"assets/img/hard_link.30e3dd44.png"},408:function(t,a,s){"use strict";s.r(a);var v=s(4),_=Object(v.a)({},(function(){var t=this,a=t.$createElement,v=t._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("div",{staticClass:"custom-block tip"},[v("p",{staticClass:"custom-block-title"},[t._v("概述")])]),t._v(" "),v("h2",{attrs:{id:"软硬链接"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#软硬链接"}},[t._v("#")]),t._v(" 软硬链接")]),t._v(" "),v("h3",{attrs:{id:"链接的概念"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#链接的概念"}},[t._v("#")]),t._v(" 链接的概念")]),t._v(" "),v("p",[t._v("简单的理解链接就是快捷方式，在Windows系统中，快捷方式就是指向原文件的一个链接文件，可以让用户从不同的位置来访问原始的文件；原文件一旦被删除或剪切到其他地方后，会导致链接文件失效。但是在Linux系统中这个看似简单的东西和Windows里的可能不大一样。")]),t._v(" "),v("h3",{attrs:{id:"链接的分类"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#链接的分类"}},[t._v("#")]),t._v(" 链接的分类")]),t._v(" "),v("p",[t._v("在Linux系统中有软、硬两种链接文件之分。")]),t._v(" "),v("h3",{attrs:{id:"硬链接（hard-link）"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#硬链接（hard-link）"}},[t._v("#")]),t._v(" 硬链接（hard link）")]),t._v(" "),v("p",[t._v("我们可以将它理解为一个“指向原始文件"),v("a",{attrs:{href:"https://baike.baidu.com/item/%E7%B4%A2%E5%BC%95%E8%8A%82%E7%82%B9/4506518",target:"_blank",rel:"noopener noreferrer"}},[t._v("索引节点"),v("OutboundLink")],1),t._v("的指针”，系统不为它分配独立的索引节点和文件。所以，硬链接文件与原始文件其实是同一个文件，只不过是不同的名字而已。我们每添加一个硬链接，该文件的索引节点链接数就增加1。而且只有当该文件的索引节点链接数为0时，才算彻底将它删除。换言之，由于硬链接实际上是指向原文件索引节点的指针，因此即便原始文件被删除（我的理解：只是被放到回收站，但是指针和内存还在），依然可以通过硬链接文件来访问。")]),t._v(" "),v("h3",{attrs:{id:"硬链接总结"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#硬链接总结"}},[t._v("#")]),t._v(" 硬链接总结")]),t._v(" "),v("ol",[v("li",[t._v("硬链接，以文件副本的形式存在。但不占用实际空间。")]),t._v(" "),v("li",[t._v("不允许给目录创建硬链接")]),t._v(" "),v("li",[t._v("硬链接只有在同一个文件系统中才能创建")])]),t._v(" "),v("h3",{attrs:{id:"软链接（也称为符号链接-symbolic-link-）"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#软链接（也称为符号链接-symbolic-link-）"}},[t._v("#")]),t._v(" 软链接（也称为符号链接[symbolic link]）")]),t._v(" "),v("p",[t._v("软链接仅仅包含所链接文件的路径名，因此能链接目录文件，也可以跨越文件系统进行链接。当元原始文件被删除后，链接文件也将失效，从这一点上来说与Window系统的中的“快捷方式”具有一样的性质。")]),t._v(" "),v("h3",{attrs:{id:"软链接总结"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#软链接总结"}},[t._v("#")]),t._v(" 软链接总结")]),t._v(" "),v("ol",[v("li",[t._v("软链接，以路径的形式存在。类似于Windows操作系统中的快捷方式")]),t._v(" "),v("li",[t._v("软链接可以跨文件系统 ，硬链接不可以")]),t._v(" "),v("li",[t._v("软链接可以对一个不存在的文件名进行链接")]),t._v(" "),v("li",[t._v("软链接可以对目录进行链接")])]),t._v(" "),v("h3",{attrs:{id:"ln命令"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ln命令"}},[t._v("#")]),t._v(" ln命令")]),t._v(" "),v("p",[t._v("ln 命令用于创建链接文件，格式为“ln [选项] 目标”，其可用的参数以及作用如下：")]),t._v(" "),v("p",[t._v("-b 删除，覆盖以前建立的链接")]),t._v(" "),v("p",[t._v("-d 允许超级用户制作目录的硬链接")]),t._v(" "),v("p",[t._v("-f 强制执行")]),t._v(" "),v("p",[t._v("-i 交互模式，文件存在则提示用户是否覆盖")]),t._v(" "),v("p",[t._v("-n 把符号链接视为一般目录")]),t._v(" "),v("p",[t._v("-s 软链接(符号链接)")]),t._v(" "),v("p",[t._v("-v 显示详细的处理过程")]),t._v(" "),v("h3",{attrs:{id:"演示硬链接和软链接之间的区别"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#演示硬链接和软链接之间的区别"}},[t._v("#")]),t._v(" 演示硬链接和软链接之间的区别")]),t._v(" "),v("ul",[v("li",[t._v("创建一个软链接\n"),v("img",{attrs:{src:s(360),alt:""}})])]),t._v(" "),v("div",{staticClass:"custom-block tip"},[v("p",{staticClass:"custom-block-title"},[t._v("结论")]),t._v(" "),v("p",[t._v("软链接在删除掉原始文件后，它的链接文件将会失效，无法再访问文件内容，类似于Windows的快捷方式。")])]),t._v(" "),v("ul",[v("li",[t._v("创建一个硬链接\n"),v("img",{attrs:{src:s(361),alt:""}})])]),t._v(" "),v("div",{staticClass:"custom-block tip"},[v("p",{staticClass:"custom-block-title"},[t._v("结论")]),t._v(" "),v("p",[t._v("硬链接在删除原始文件后，它的链接文件还可以继续访问，这是因为新建的硬链接不再依赖原始文件的名称等信息，我们可以看到在创建完硬链接后，原始文件的硬盘链接数量增加到了2，如果想要彻底删除，链接数成0才算彻底删除。")])]),t._v(" "),v("h2",{attrs:{id:"常用命令"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#常用命令"}},[t._v("#")]),t._v(" 常用命令")]),t._v(" "),v("h3",{attrs:{id:"ps-ef-grep"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ps-ef-grep"}},[t._v("#")]),t._v(" ps -ef|grep")]),t._v(" "),v("p",[v("code",[t._v("ps")]),t._v("命令将某个进程显示出来，"),v("code",[t._v("-ef")]),t._v("是用标准的格式显示进程")]),t._v(" "),v("p",[t._v("grep命令是查找")]),t._v(" "),v("p",[v("code",[t._v("|")]),t._v("是管道命令，是指ps命令与grep同时执行")]),t._v(" "),v("p",[t._v("比如查看nginx的命令："),v("code",[t._v("ps -ef|grep nginx")])]),t._v(" "),v("h3",{attrs:{id:"查找当前文件下面文件"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#查找当前文件下面文件"}},[t._v("#")]),t._v(" 查找当前文件下面文件")]),t._v(" "),v("p",[v("code",[t._v("find . -name min* -maxdepth 1")]),t._v("\n-name: 表示查找的是文件")]),t._v(" "),v("p",[t._v("-maxdepth：表示查找层数是一层")]),t._v(" "),v("h3",{attrs:{id:"设置组别权限"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#设置组别权限"}},[t._v("#")]),t._v(" 设置组别权限")]),t._v(" "),v("p",[v("code",[t._v("sudo chown -R $(whoami) <Path to Code>")])]),t._v(" "),v("h2",{attrs:{id:"docker"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#docker"}},[t._v("#")]),t._v(" docker")]),t._v(" "),v("h3",{attrs:{id:"p端口映射"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#p端口映射"}},[t._v("#")]),t._v(" -p端口映射")]),t._v(" "),v("p",[t._v("外部映射容器端口：")]),t._v(" "),v("div",{staticClass:"language-bash line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-bash"}},[v("code",[t._v("docker run -it -p "),v("span",{pre:!0,attrs:{class:"token number"}},[t._v("7009")]),t._v(":7009 try-end/node:12 /bin/bash\n")])]),t._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[t._v("1")]),v("br")])]),v("p",[t._v("执行"),v("code",[t._v("try-end/node:12")]),t._v("这个镜像，"),v("code",[t._v("/bin/bash")]),t._v("是进入到当前容器当中，容器里面的所有端口服务，容器外面默认是没有办法访问到的，"),v("code",[t._v("-p 7009:7009")]),t._v("：用外面的"),v("code",[t._v("7009")]),t._v("端口来映射容器内的"),v("code",[t._v("7009")]),t._v("，从而可以在容器外访问容器内的"),v("code",[t._v("7009")]),t._v("服务")]),t._v(" "),v("p",[t._v("超链接 "),v("a",{attrs:{href:"URL"}},[t._v("文本")]),t._v(" "),t._v("\n图片 "),v("img",{attrs:{src:"url",alt:""}})])])}),[],!1,null,null,null);a.default=_.exports}}]);