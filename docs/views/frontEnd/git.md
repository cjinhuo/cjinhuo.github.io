---
title: 'Git'
sidebarDepth: 2
sidebar: auto
categories: 
 - frontEnd
date: 2019-02-12
tags:
- Git
- 前端
---

## 推送到远程库
正常推送到远程库的流程是
```
git add *
git commit -m 'DESCRIPTION'
git push origin master
```
推荐一个命令：`git commit -am 'DESCRIPTION'`包括`git add *`，上面的两步可以变为一步。<br>

## git push
正常情况下git push的用法如下：
`git push <远程主机名> <本地分支名>  <远程分支名>`<br>
### git push origin master
如果远程分支被省略，如上则表示将本地分支推送到与之存在追踪关系的远程分支（通常两者同名），如果该远程分支不存在，则会被新建
### git push origin
如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，将当前分支推送到origin主机的对应分支 
`git push origin cjh:cjh`<br>
表示将本地的'cjh'分支push到远程
### git push
如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push
## 新建、切换、删除远程库
* 查看远程库的地址：
`git remote -v`<br>
在这个地址上可以新建、切换、删除分支
* 新建分支
`git branch 'name'`
::: tip 注意
在本地新建分支，是建在本地分支上，远程库是没有这个分支的，当你用上面的命令新建后，用`git branch -r`查下就知道了，所以当你用本地分支push的时候，会报错:`fatal:The current branch 'name' has no upstream branch`，翻译：当前分支'name'没有上游分支，下面就会提示你用`git push --set-upstream origin 'name'`进行设置上游分支并push。
:::
* 查看分支
查看本地分支`git branch` <br>
查看远程分支`git branch -r` <br>
查看所有分支`git branch -a` <br>
* 切换分支
`git checkout 'name'`
* 删除分支
删除远程分支`git push origin --delete 'name'`
删除本地分支`git branch -D 'name'`
## 分支合并
从master新建一个分支来新建功能有三个步骤
1. 新建dev分支
`git branch dev`
2. 切换到dev分支
`git checkout dev`
::: tip checkout技巧
以上两部可以换成一部完成，`git checkout -b dev`的作用是：新建dev分支，并切换到dev分支
:::
3. 将master的内容合并到dev分支上
`git merge master`
## git fetch
::: tip 
更新远程代码到本地仓库，经常用这个来检测别人是否push上去了没。
:::
## Commit 规范
::: tip Git Commit
Git 每次提交代码，都要写 Commit message（提交说明），否则就不允许提交。

一般来说，Commit message 应该清晰明了，说明本次提交的目的。在多人协作项目中，如果代码风格统一、代码提交信息的说明准确，那么在后期协作以及 Bug 处理时会更加方便。

目前，社区有多种 Commit message 的提交规范。我们推荐使用 Angular 规范，这也是目前使用最广的写法，比较合理和系统化，并且有配套的工具。
:::
用于说明 commit 的类别，只允许使用下面 9 个标识：<br>
* feat：新功能
* fix：修复 bug
* docs：撰写文档
* style：代码格式（不影响代码运行的变动）
* refactor：重构（既不是新增功能，也不是修改 bug 的代码变动）
* test：增加测试
* build：工程化
* example：示例（仅用于修改 example/*）
* chore：代码优化或辅助工具的变动

Commit 信息应符合如下规则，建议使用工具 comitzen(git cz) 代替 git commit 。

`[TYPE](SCOPE):DESCRIPTION#[ISSUE]` <br>
例如： <br>
`feat(button):add type 'ghost' for form usage #666` <br>
* 【可选】SCOPE：用于说明 commit 影响的范围
例如：数据层、控制层 或 button ，视项目不同而不同，一般用于 feat、fix 类型。如果你的修改影响了不止一个 scope ，你可以使用 * 代替。
* 【必填】DESCRIPTION：对 commit 的简短描述
一般不超过 50 个字符，且尽量使用英文，但是我还是用中文。
* 【可选】ISSUE：改动关联的 issue 号码
一般用于 feat、fix ，仅当前 commit 针对某个 issue 时使用。<br>
例如：`fix(login): 修复登录流程的Bug #111`




