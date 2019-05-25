---
title: 'VSCode的一些配置'
description: '主题、icon、Setting.json的配置'
sidebarDepth: 2
sidebar: auto
categories: 
- frontEnd
tags:
- 前端
- VSCode
---

## 配置主题
文件 -> 首选项 -> 颜色主题 -> 选择更改

快捷键： ctrl + k、ctrl + t

icon theme:`Material Icon Theme`
color theme:`one dark pro`

## Settings Sync
::: tip
VSCode插件，可以同步：
1. Settings File
2. Keybinding File
3. Launch File
4. Snippets Folder
5. VSCode Extensions & Extensions Configurations
6. Workspaces Folder
:::
Upload Key : `Shift + Alt + U`<br>
Download Key : `Shift + Alt + D`<br>
gist（vscode配置）: <br>
* token: `407aa4d91fdaeecc9e89be1385028f99a1724f7c`
* gistId: `712826c7c78cde4011844be779b921d5`
## setting.json
```js
{
    "editor.fontSize": 14,
    "workbench.iconTheme": "material-icon-theme",
    // 控制资源管理器是否在把文件删除到废纸篓时进行确认。
    "explorer.confirmDelete": true,
    // 启用后，将在文件打开时尝试猜测字符集编码。可以按语言对此项进行配置。
    "files.autoGuessEncoding": true,
    // 控制在资源管理器内拖放移动文件或文件夹时是否进行确认。
    "explorer.confirmDragAndDrop": false,
    // 窗口失去焦点时会自动保存当前代码
    "files.autoSave": "onFocusChange",
    // 制表符的空格数
    "editor.tabSize": 2,
    // 按下保存会自动修复eslint的配置
    "eslint.autoFixOnSave": true,
    // 启用或禁用字体连字。
    "editor.fontLigatures": true,
    // 是否在每行后面添加分号
    "prettier.semi": false,
    // 如果为真，将使用单引号而不是双引号
    "prettier.singleQuote": true,
    // 用“beautiful -eslint”代替“beautiful tier”
    "prettier.eslintIntegration": true,
    // 限制缩略图的宽度，控制其最多显示的列数。
    "editor.minimap.maxColumn": 100,
    // 是否显示右侧的缩略图
    "editor.minimap.enabled": false,
    // 控制在差异编辑器中是否把前导空格或尾随空格的改动显示为差异。
    "diffEditor.ignoreTrimWhitespace": false,
    // 启用时，提交将自动从当前Git存储库的默认远程获取。
    "git.autofetch": true,
    "eslint.validate": [
        "javascript",{
            "language": "vue",
            "autoFix": true
        },"html",
        "vue"
    ],
    // 控制终端的渲染方式。
    "terminal.integrated.rendererType": "dom",
    "editor.fontFamily": "Source Code Variable,Menlo, Monaco, 'Courier New', monospace",
    // 安装StandardJS 启动style检测
    "standard.enable": true,
    // 在保存时启用或禁用自动修复
    "standard.autoFixOnSave": true,
    // 为避免默认的Vetur模板验证
    "vetur.validation.template": false,
    "editor.formatOnPaste": true,
    // 控制是否显示工作台底部状态栏中的 Twitter 反馈 (笑脸图标)。
    "workbench.statusBar.feedback.visible": false,
    // 启用/禁用导航路径，在页面的上方出现面包
    "breadcrumbs.enabled": true,
    // 控制终端游标是否闪烁。
    "terminal.integrated.cursorBlinking": true,
    // 不要使用重复的样式定义。
    "css.lint.duplicateProperties": "error",
    // css 零不需要单位。
    "css.lint.zeroUnits": "warning",
    // 未知的供应商特定属性。
    "less.lint.unknownVendorSpecificProperties": "warning",
    // 在使用 padding 或 border 时，不要使用 width 或 height。
    "less.lint.boxModel": "warning",
    // 360秒自动 git fetch 之间的间隔时间。
    "git.autofetchPeriod": 360,
    // 忽略空格
    "gitblame.ignoreWhitespace": true,
    // 缩进 <head> 和 <body> 部分。
    "html.format.indentInnerHtml": true,
    // force\-aligned: 对除第一个属性外的其他每个属性进行换行，并保持对齐
    "html.format.wrapAttributes": "force-aligned",
    // 是否在解决合并冲突后自动转到下一个合并冲突。
    "merge-conflict.autoNavigateNextConflict.enabled": true,
    // 同步插件和setting
    "sync.gist": "712826c7c78cde4011844be779b921d5",
    // eslint的运行环境，没有加这个有时候eslint server启动失败
    "eslint.runtime": "node",
    // 当在 VS Code 中重命名或移动文件时，启用或禁用自动更新导入路径
    "javascript.updateImportsOnFileMove.enabled": "always",
    "editor.suggestSelection": "first",
    "workbench.colorTheme": "One Dark Pro Vivid"
}
```


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