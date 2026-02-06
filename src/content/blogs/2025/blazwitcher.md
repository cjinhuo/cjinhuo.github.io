---
title: "极致丝滑的模糊搜索 & AI 标签分组插件 "
description: "标签页、书签太多找不到？AI 分组 + 拼音模糊搜索，开源插件秒解切换难题！"
pubDate: '2025-10-21'
updatedDate: '2025-10-21'
heroImage: './blazwitcher-front.png'
heroImageAlt: 'heroImage'
tags: ['前端', '浏览器插件', 'AI', '开源']
---


## 😵‍💫 日常痛点
你是否也有这样的经历：
- 打开了 20+ 个标签页，想切到某个标签页却只能凭感觉一个一个查看？
- 书签收藏了上千个包含各种分类，但需要时总是大海捞针？
- 浏览器历史记录里躺着几万条数据，搜索起来比登天还难？
- 偶尔失手关闭的一些原本想保留的页面，想快速恢复？
如果有，该插件或许能为你解忧！

![太多标签页的痛点](./blazwitcher-too_many_tabs.png)

## 💻 快速安装
1. 进入 [chrome 插件商店](https://chromewebstore.google.com/detail/fjgablnemienkegdnbihhemebmmonihg)，点击添加到浏览器按钮即可，安装后默认会请求读取标签、书签和历史记录权限，允许后默认会弹窗一个窗口，点击允许即可。

2. 快速了解搜索面板

![quick-view](./blazwitcher-quick-view.png)


## 🎉 主要功能
### 模糊拼音搜索
支持中英文混合模糊搜索，对国人超级 Nice (依赖于文本搜索算法)，最终搜索的结果按照返回的权重值(命中连续字符越多，权重越高)和最近使用的时间降序输出，更快定位目标，搜索能力：
- 首字母拼音搜索

![首字母拼音搜索](./blazwitcher-first_letter_match.gif)

- 域名搜索 & 空格分词搜索（分词后无需按顺序匹配）

![域名搜索和分词搜索](./blazwitcher-split_words_domain.gif)

### AI 分组
对上次聚焦窗口中的所有标签页进行 AI 分组，根据域名、标题和现有分组情况增量分组，大大节省手动创建和更新标签分组的时间。当然，如果你不满意本次 AI 分组，也能在分组的 16 秒内返回到最初的快照状态

![AI 智能分组](./blazwitcher-ai_grouping.gif)

### 全局秒级搜索
搜索数据源包含：
- 所有已打开的标签页
- 所有书签记录
- 默认检索近 14 天内前 1000 条历史记录，可输入 /s search 进行配置修改
也支持定向搜索，如输入 /t 可单独搜索已打开的标签页，同理输入 /b 和 /h 可定向搜索书签和历史记录

![命令过滤搜索](./blazwitcher-command_filter.gif)

### 全键盘操作
- 默认通过 Command+Shift+K(Window 系统Ctrl+Shift+K) 唤醒插件，可输入 /s keyboard 进行自定义
- 通过上下键（↑↓）或 Tab 键选择标签内容，按下 Enter 键来切换或打开你想要的标签
- 通过 / 下的命令直接触发操作，比如输入 /ai 后 enter 就会触发 AI 标签分组
- 通过快捷键来 pin、unpin、打开历史记录、打开当前书签位置等等
- 输入 /s 进入设置页面，可自定义唤醒各个功能的快捷键

![设置界面](./blazwitcher-setting.gif)

## 👴🏻 结尾
插件已上架[谷歌商店](https://chromewebstore.google.com/detail/fjgablnemienkegdnbihhemebmmonihg)也已开源，没有存储任何数据不用担心个人数据泄漏，纯净无广：
* 谷歌商店地址：https://chromewebstore.google.com/detail/fjgablnemienkegdnbihhemebmmonihg
* 开源 github 仓库地址：https://github.com/cjinhuo/blazwitcher
* 文本搜索算法的 NPM 包也已开源，[线上 Demo 体验点我](https://cjinhuo.github.io/text-search-engine/)

如果觉得不错，可以 star 一下或在谷歌商店评分下 😘，感兴趣的同学可参与 [Pull Request](https://github.com/cjinhuo/blazwitcher/pulls) 或在 [Issue](https://github.com/cjinhuo/blazwitcher/issues) 中提建议，也可以在飞书私我。
