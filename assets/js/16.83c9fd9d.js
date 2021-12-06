(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{364:function(t,e,i){t.exports=i.p+"assets/img/git_log.62aa7f60.png"},365:function(t,e,i){t.exports=i.p+"assets/img/git_reflog.38eacbe5.png"},366:function(t,e,i){t.exports=i.p+"assets/img/git_merge.a15da4e5.png"},405:function(t,e,i){"use strict";i.r(e);var s=i(4),a=Object(s.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("div",{staticClass:"custom-block tip"},[s("p",[t._v("Git和其他版本控制系统如SVN的一个不同之处就是有暂存区的概念。这边记录的是Git的一些笔记")])]),t._v(" "),s("h2",{attrs:{id:"工作区和暂存区"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#工作区和暂存区"}},[t._v("#")]),t._v(" 工作区和暂存区")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",[t._v("Git和其他版本控制系统如SVN的一个不同之处就是有暂存区的概念。")])]),t._v(" "),s("h3",{attrs:{id:"暂存操作"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#暂存操作"}},[t._v("#")]),t._v(" 暂存操作")]),t._v(" "),s("p",[t._v(":::\nlist相当于是一个数组，数组下标对应的内容就是存着你每次暂存的信息.\n:::")]),t._v(" "),s("ul",[s("li",[t._v("暂存操作\n"),s("code",[t._v("git stash save '本次暂存的名称'")])]),t._v(" "),s("li",[t._v("查看记录\n"),s("code",[t._v("git stash list")]),t._v("\n会出现以下信息")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("stash@{0}: On master: test\n\nstash@{下标从0开始} On 分支：你填入暂存的名称\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br")])]),s("ul",[s("li",[s("p",[t._v("恢复暂存的工作\npop命令恢复,恢复后,暂存区域会删除当前的记录\n"),s("code",[t._v("git stash pop stash@{index}")]),t._v("\napply命令恢复,恢复后,暂存区域会保留当前的记录\n"),s("code",[t._v("git stash apply stash@{index}")])])]),t._v(" "),s("li",[s("p",[t._v("删除暂存\n删除某个暂存，删之后你就取不了这个下标的信息了\n"),s("code",[t._v("git stash drop stash@{index}")]),t._v("\n删除全部暂存\n"),s("code",[t._v("git stash clear")])])])]),t._v(" "),s("h3",{attrs:{id:"版本库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#版本库"}},[t._v("#")]),t._v(" 版本库")]),t._v(" "),s("p",[t._v("工作区有个隐藏目录"),s("code",[t._v(".git")]),t._v("，这个不算工作区，而是Git的版本库。")]),t._v(" "),s("p",[t._v("Git的版本库存了很多东西，其中最重要的就是成为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支master，以及指向master的一个指针叫HEAD。")]),t._v(" "),s("p",[t._v("当我们把文件往Git版本库里添加的时候，是分两步执行的：")]),t._v(" "),s("p",[t._v("第一步是用"),s("code",[t._v("git add")]),t._v("把文件添加进去，实际上就是把文件修改添加到暂存区去")]),t._v(" "),s("p",[t._v("第二步是用"),s("code",[t._v("git commit")]),t._v("提交更改，实际上就是把暂存区的所有内容提交到当前分支")]),t._v(" "),s("p",[t._v("因为我们创建Git版本库时，Git自动为我们创建了唯一一个master分支，所以，现在，git commit就是往master分支上提交更改。")]),t._v(" "),s("p",[t._v("你可以简单理解为，需要提交的文件修改通通放到暂存区，然后，一次性提交暂存区的所有修改。")]),t._v(" "),s("h2",{attrs:{id:"推送到远程库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#推送到远程库"}},[t._v("#")]),t._v(" 推送到远程库")]),t._v(" "),s("p",[t._v("正常推送到远程库的流程是")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git add *\ngit commit -m 'DESCRIPTION'\ngit push origin master\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br")])]),s("p",[t._v("推荐一个命令："),s("code",[t._v("git commit -am 'DESCRIPTION'")]),t._v("包括"),s("code",[t._v("git add *")]),t._v("，上面的两步可以变为一步。"),s("br")]),t._v(" "),s("h2",{attrs:{id:"git-push"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-push"}},[t._v("#")]),t._v(" git push")]),t._v(" "),s("p",[t._v("正常情况下git push的用法如下：\n"),s("code",[t._v("git push <远程主机名> <本地分支名> <远程分支名>")]),s("br")]),t._v(" "),s("h3",{attrs:{id:"git-push-origin-master"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-push-origin-master"}},[t._v("#")]),t._v(" git push origin master")]),t._v(" "),s("p",[t._v("如果远程分支被省略，如上则表示将本地分支推送到与之存在追踪关系的远程分支（通常两者同名），如果该远程分支不存在，则会被新建")]),t._v(" "),s("h3",{attrs:{id:"git-push-origin"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-push-origin"}},[t._v("#")]),t._v(" git push origin")]),t._v(" "),s("p",[t._v("如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，将当前分支推送到origin主机的对应分支\n"),s("code",[t._v("git push origin cjh:cjh")]),s("br"),t._v("\n表示将本地的'cjh'分支push到远程")]),t._v(" "),s("h3",{attrs:{id:"git-push-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-push-2"}},[t._v("#")]),t._v(" git push")]),t._v(" "),s("p",[t._v("如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push")]),t._v(" "),s("h3",{attrs:{id:"git-push-set-upstream-origin-本地分支名"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-push-set-upstream-origin-本地分支名"}},[t._v("#")]),t._v(" git push --set-upstream origin <本地分支名>")]),t._v(" "),s("p",[t._v("当你在本地新建分支时，远程是没有的，这时候需要用上面这个命令来推到远程。")]),t._v(" "),s("h2",{attrs:{id:"新建、切换、删除远程库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#新建、切换、删除远程库"}},[t._v("#")]),t._v(" 新建、切换、删除远程库")]),t._v(" "),s("ul",[s("li",[t._v("查看远程库的地址：\n"),s("code",[t._v("git remote -v")]),s("br"),t._v("\n在这个地址上可以新建、切换、删除分支")]),t._v(" "),s("li",[t._v("新建分支\n"),s("code",[t._v("git branch 'name'")])])]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),s("p",[t._v("在本地新建分支，是建在本地分支上，远程库是没有这个分支的，当你用上面的命令新建后，用"),s("code",[t._v("git branch -r")]),t._v("查下就知道了，所以当你用本地分支push的时候，会报错:"),s("code",[t._v("fatal:The current branch 'name' has no upstream branch")]),t._v("，\b\b\b翻译：当前分支'name'没有上游分支，下面就会提示你用"),s("code",[t._v("git push --set-upstream origin 'name'")]),t._v("进行设置上游分支并push。")])]),t._v(" "),s("ul",[s("li",[t._v("查看分支\n查看本地分支"),s("code",[t._v("git branch")]),t._v(" "),s("br"),t._v("\n查看远程分支"),s("code",[t._v("git branch -r")]),t._v(" "),s("br"),t._v("\n查看所有分支"),s("code",[t._v("git branch -a")]),t._v(" "),s("br")]),t._v(" "),s("li",[t._v("切换分支\n切换本地分支"),s("code",[t._v("git checkout 'name'")]),s("br"),t._v("\n切换远程分支"),s("code",[t._v("git checkout -b name origin/name")])]),t._v(" "),s("li",[t._v("删除分支\n删除远程分支"),s("code",[t._v("git push origin --delete 'name'")]),s("br"),t._v("\n删除本地分支"),s("code",[t._v("git branch -D 'name'")]),s("br")])]),t._v(" "),s("h2",{attrs:{id:"分支合并"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#分支合并"}},[t._v("#")]),t._v(" 分支合并")]),t._v(" "),s("p",[t._v("从master新建一个分支来新建功能有三个步骤")]),t._v(" "),s("ol",[s("li",[t._v("新建dev分支\n"),s("code",[t._v("git branch dev")])]),t._v(" "),s("li",[t._v("切换到dev分支\n"),s("code",[t._v("git checkout dev")])])]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("checkout技巧")]),t._v(" "),s("p",[t._v("以上两部可以换成一部完成，"),s("code",[t._v("git checkout -b dev")]),t._v("的作用是：新建dev分支，并切换到dev分支")])]),t._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[t._v("将master的内容合并到dev分支上\n"),s("code",[t._v("git merge master")])])]),t._v(" "),s("h2",{attrs:{id:"git-fetch"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-fetch"}},[t._v("#")]),t._v(" git fetch")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",[t._v("更新远程代码到本地仓库，经常用这个来检测别人是否push上去了没。")])]),t._v(" "),s("h2",{attrs:{id:"commit-规范"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#commit-规范"}},[t._v("#")]),t._v(" Commit 规范")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Git Commit")]),t._v(" "),s("p",[t._v("Git 每次提交代码，都要写 Commit message（提交说明），否则就不允许提交。")]),t._v(" "),s("p",[t._v("一般来说，Commit message 应该清晰明了，说明本次提交的目的。在多人协作项目中，如果代码风格统一、代码提交信息的说明准确，那么在后期协作以及 Bug 处理时会更加方便。")]),t._v(" "),s("p",[t._v("目前，社区有多种 Commit message 的提交规范。我们推荐使用 Angular 规范，这也是目前使用最广的写法，比较合理和系统化，并且有配套的工具。")])]),t._v(" "),s("p",[t._v("用于说明 commit 的类别，只允许使用下面 9 个标识："),s("br")]),t._v(" "),s("ul",[s("li",[t._v("feat：新功能")]),t._v(" "),s("li",[t._v("fix：修复 bug")]),t._v(" "),s("li",[t._v("docs：撰写文档")]),t._v(" "),s("li",[t._v("style：代码格式（不影响代码运行的变动）")]),t._v(" "),s("li",[t._v("refactor：重构（既不是新增功能，也不是修改 bug 的代码变动）")]),t._v(" "),s("li",[t._v("test：增加测试")]),t._v(" "),s("li",[t._v("build：工程化")]),t._v(" "),s("li",[t._v("example：示例（仅用于修改 example/*）")]),t._v(" "),s("li",[t._v("chore：代码优化或辅助工具的变动")])]),t._v(" "),s("p",[t._v("Commit 信息应符合如下规则，建议使用工具 comitzen(git cz) 代替 git commit 。")]),t._v(" "),s("p",[s("code",[t._v("[TYPE](SCOPE):DESCRIPTION#[ISSUE]")]),t._v(" "),s("br"),t._v("\n例如： "),s("br"),t._v(" "),s("code",[t._v("feat(button):add type 'ghost' for form usage #666")]),t._v(" "),s("br")]),t._v(" "),s("ul",[s("li",[t._v("【可选】SCOPE：用于说明 commit 影响的范围\n例如：数据层、控制层 或 button ，视项目不同而不同，一般用于 feat、fix 类型。如果你的修改影响了不止一个 scope ，你可以使用 * 代替。")]),t._v(" "),s("li",[t._v("【必填】DESCRIPTION：对 commit 的简短描述\n一般不超过 50 个字符，且尽量使用英文，但是我还是用中文。")]),t._v(" "),s("li",[t._v("【可选】ISSUE：改动关联的 issue 号码\n一般用于 feat、fix ，仅当前 commit 针对某个 issue 时使用。"),s("br"),t._v("\n例如："),s("code",[t._v("fix(login): 修复登录流程的Bug #111")])])]),t._v(" "),s("h2",{attrs:{id:"git-log-git-reflog"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-log-git-reflog"}},[t._v("#")]),t._v(" git log && git reflog")]),t._v(" "),s("h3",{attrs:{id:"git-log"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-log"}},[t._v("#")]),t._v(" git log")]),t._v(" "),s("p",[t._v("可以显示所有提交过的版本信息"),s("br"),t._v(" "),s("img",{attrs:{src:i(364),alt:""}}),t._v("\n如果感觉太繁琐，可以加上参数  --pretty=oneline，只会显示版本号和提交时的备注信息\n"),s("code",[t._v("git log --pretty=oneline")]),t._v("\n这样只会显示版本号和提交时的备注信息")]),t._v(" "),s("h3",{attrs:{id:"git-reflog"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-reflog"}},[t._v("#")]),t._v(" git reflog")]),t._v(" "),s("p",[t._v("可以查看所有分支的所有操作记录（包括已经被删除的 commit 记录和 reset 的操作）\n"),s("img",{attrs:{src:i(365),alt:""}}),t._v("\n例如执行 git reset --hard HEAD~1，退回到上一个版本，用"),s("code",[t._v("git log")]),t._v("则是看不出来被删除的commit，用"),s("code",[t._v("git reflog")]),t._v("则可以看到被删除的commited，我们就可以买后悔药，恢复到被删除的那个版本。")]),t._v(" "),s("h2",{attrs:{id:"git-reset"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-reset"}},[t._v("#")]),t._v(" git reset")]),t._v(" "),s("p",[s("code",[t._v("git reset (–mixed) HEAD~1")]),t._v("\n回退一个版本,且会将暂存区的内容和本地已提交的内容全部恢复到未暂存的状态,不影响原来本地文件(未提交的也\n不受影响)\n"),s("code",[t._v("git reset –soft HEAD~1")]),t._v("\n回退一个版本,不清空暂存区,将已提交的内容恢复到暂存区,不影响原来本地的文件(未提交的也不受影响)")]),t._v(" "),s("p",[t._v("将头指针移指定位置上面（比如向前移动5个commit），但是指针前面的commit内容还是存在的，且这commit的内容还是存在的，在staged change（暂存区）里面，当前如果commit后，在"),s("code",[t._v("git push -f")]),t._v("，那么这5个commit就会变成当前一个commit。\n"),s("code",[t._v("git reset –hard HEAD~1")]),t._v("\n回退一个版本,清空暂存区,将已提交的内容的版本恢复到本地,本地的文件也将被恢复的版本替换")]),t._v(" "),s("p",[t._v("将本地的头指针移到指定位置，但是指针前面的commit内容还是存在的，这是需要"),s("code",[t._v("git push -f")]),t._v("强制推上去，那些commit就被删除了")]),t._v(" "),s("h2",{attrs:{id:"git-checkout"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-checkout"}},[t._v("#")]),t._v(" git checkout")]),t._v(" "),s("p",[t._v("在commit层面，"),s("code",[t._v("git checkout <branch name>")]),t._v("表示切换至另一个分支，这个命令实际上是将HEAD指向另外一个分支，并且将工作区更新到那个分支。和git reset不同，git checkout不会移动分支。"),s("br"),t._v("\ngit checkout也可以指定某个commit，这就像切换一个分支一样：git会将HEAD指向那个commit，形成"),s("code",[t._v("detached HEAD")]),t._v("，查了下资料发现这个"),s("code",[t._v("detached HEAD")]),t._v("是个临时指向，并没有新建分支，所以并没有什用。这对于快速查看文件旧版本来说非常方便，但如果你当前的HEAD没有任何分支引用，那么这会造成HEAD分离。因此，在为分离的HEAD添加新的提交时候你应该创建一个新的分支。")]),t._v(" "),s("h2",{attrs:{id:"git-merge"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-merge"}},[t._v("#")]),t._v(" git merge")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("–no-ff参数的作用")]),t._v(" "),s("p",[t._v("git merge –no-ff 可以保存你之前的分支历史。能够更好的查看 merge历史，以及branch 状态。"),s("br"),t._v("\ngit merge 则不会显示 feature，只保留单条分支记录。")])]),t._v(" "),s("h2",{attrs:{id:"git-rebase"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-rebase"}},[t._v("#")]),t._v(" git rebase")]),t._v(" "),s("h2",{attrs:{id:"git-cherry-pick"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-cherry-pick"}},[t._v("#")]),t._v(" git cherry-pick")]),t._v(" "),s("p",[t._v("用来将其他分支的"),s("code",[t._v("commit")]),t._v("拷贝到当前分支")]),t._v(" "),s("p",[t._v("用法：\n拷贝单个commit：\n"),s("code",[t._v("git cherry-pick <commit>")])]),t._v(" "),s("p",[t._v("拷贝多个commit：\n"),s("code",[t._v("git cherry-pick commitId_1..commitId_2")])]),t._v(" "),s("p",[t._v("注意："),s("code",[t._v("commitId_1")]),t._v("一定要在"),s("code",[t._v("commitId_2")]),t._v("前面提交，")]),t._v(" "),s("h3",{attrs:{id:"s-ours"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#s-ours"}},[t._v("#")]),t._v(" -s ours")]),t._v(" "),s("p",[t._v("假设当前在分支A上")]),t._v(" "),s("p",[s("code",[t._v("git merge -s ours B")]),t._v("的结果是，遇到冲突时采用A分支的结果")]),t._v(" "),s("h3",{attrs:{id:"s-theirs"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#s-theirs"}},[t._v("#")]),t._v(" -s theirs")]),t._v(" "),s("p",[t._v("假设当前在分支A上")]),t._v(" "),s("p",[s("code",[t._v("git merge -s theirs B")]),t._v("的结果是，遇到冲突时采用B分支的结果，没有试验过，猜测是这样的")]),t._v(" "),s("p",[s("img",{attrs:{src:i(366),alt:""}})]),t._v(" "),s("h2",{attrs:{id:"git-cz"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-cz"}},[t._v("#")]),t._v(" git cz")]),t._v(" "),s("p",[t._v("规范提交"),s("code",[t._v("commit")]),t._v("的工具，初始化项目指南："),s("a",{attrs:{href:"https://github.com/commitizen/cz-cli#making-your-repo-commitizen-friendly",target:"_blank",rel:"noopener noreferrer"}},[t._v("making-your-repo-commitizen-friendly"),s("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=a.exports}}]);