---
name: blog-markdown-format
description: 博客 Markdown 格式规范。当需要迁移、完善或生成博客文章时，必须调用此 skill 以确保符合 frontmatter 头部信息和 Markdown 语法规范。
---

# 博客 Markdown 格式规范

当处理博客文章的迁移、完善或生成时，必须遵循以下格式规范。

## 博客文件结构

博客文章存放在 `src/content/blogs` 目录下，按年份分类：

```
src/content/blogs/
├── 2024/
│   └── my-projects.md
├── 2025/
│   ├── simple-post.md              # 无资源的简单文章
│   └── blazwitcher/                # 有资源的文章（文件夹形式）
│       ├── index.md                # 文章内容
│       ├── hero-image.png          # 封面图片
│       ├── screenshot-1.gif        # 文章内引用的图片
│       └── demo.mp4                # 其他资源文件
└── 2026/
    └── ...
```

### 文件组织规则

1. **无资源的文章**：直接使用 `.md` 文件，如 `2024/my-projects.md`
2. **有资源的文章**：创建同名文件夹，文章命名为 `index.md`，资源文件放在同一目录下
3. **图片引用**：使用相对路径 `./filename.png` 引用同目录下的图片

### 迁移文章时的资源处理

从其他项目迁移博客文章时，必须同步处理资源文件：

1. 检查原文章中的所有图片和资源引用
2. 在 `src/content/blogs/{年份}/` 下创建文章同名文件夹
3. 将原文章重命名为 `index.md` 并移入文件夹
4. 将所有引用的图片/资源文件复制到同一文件夹
5. 更新文章中的资源路径为相对路径 `./filename.ext`

## Frontmatter 格式

每篇博客文章必须包含以下 frontmatter 头部信息：

```yaml
---
layout: "../../layouts/BlogPost.astro"
title: "文章标题"
description: "文章描述，简要概括文章内容"
pubDate: 'YYYY-MM-DD'
updatedDate: 'YYYY-MM-DD'
author: '作者名称'
authorHref: '作者链接'
heroImage: '/图片路径.jpg'
heroImageAlt: '图片描述'
---
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| title | 是 | 文章标题 |
| description | 是 | 文章描述 |
| pubDate | 是 | 发布日期，格式 `'YYYY-MM-DD'` |
| tags | 是 | 文章标签，格式 `['标签1', '标签2']`，最多 5 个标签 |
| updatedDate | 否 | 更新日期，格式 `'YYYY-MM-DD'` |
| heroImage | 否 | 文章封面图片路径 |
| heroImageAlt | 否 | 封面图片的 alt 描述 |
| layout | 否 | 默认为 `"@/layouts/BlogPost.astro` |
| authorHref | 否 | 作者主页链接 |
| author | 否 | 作者名称 |

## Markdown 语法规范

### 标题层级

- 使用 `##` 作为文章内的一级标题（H2）
- 依次使用 `###`、`####` 等作为子标题
- 不要在文章内容中使用 `#`（H1），因为文章标题已在 frontmatter 中定义

### 图片

`![图片描述](/图片路径.jpg)`

### 引用块

普通引用：

> 引用内容
> **注意** 可以在引用中使用 _Markdown 语法_

带出处的引用：

> 引用内容<br>
> — <cite>出处[^1]</cite>

[^1]: 脚注说明

### 表格

| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 内容 | 内容 | 内容 |

### 代码块

使用三个反引号包裹代码，并指定语言：

```javascript
const example = 'code';
```

支持的语言标识：`html`、`css`、`javascript`、`typescript`、`python`、`go`、`bash`、`yaml`、`json` 等。

### 列表

有序列表：

1. 第一项
2. 第二项
3. 第三项

无序列表：

- 列表项
- 另一项
- 再一项

嵌套列表：

- 父级项
  - 子级项
  - 子级项

### 特殊元素

- 缩写：`<abbr title="全称">缩写</abbr>`
- 下标：`H<sub>2</sub>O`
- 上标：`X<sup>n</sup>`
- 键盘按键：`<kbd>CTRL</kbd>+<kbd>C</kbd>`
- 高亮：`<mark>高亮文本</mark>`

### 脚注

这是一段带脚注的文本[^2]。

[^2]: 这是脚注的内容。

### 自定义容器

本博客支持类似 VuePress 的自定义容器语法，用于突出显示提示、警告等信息。

**语法格式**：

:::类型[标题]
内容
:::

**注意**：类型和 `[` 之间**不能有空格**。

**支持的容器类型**：

| 类型 | 默认标题 | 用途 | 样式 |
| --- | --- | --- | --- |
| `tip` | 提示 | 提供有用的建议或技巧 | 绿色边框 |
| `warning` | 注意 | 提醒用户需要注意的事项 | 橙色边框 |
| `danger` | 警告 | 警告用户潜在的危险或错误 | 红色边框 |
| `info` | 信息 | 提供补充信息 | 蓝色边框 |
| `details` | 详情 | 可折叠的详细内容 | 灰色边框 |

**示例**：

提示容器（自定义标题）：

:::tip[带着问题看源码]
为什么每个 Vue 组件都可以访问到 `this.$store`？
:::

警告容器（使用默认标题）：

:::warning
这是一个需要注意的事项
:::

危险容器：

:::danger[危险操作]
此操作不可逆，请谨慎执行！
:::

可折叠详情容器：

:::details[点击展开]
这里是折叠的详细内容...
:::

## 使用场景

当执行以下任务时，应调用此 skill：

1. **迁移博客文章**：将其他格式的文章转换为本博客的 Markdown 格式
2. **完善博客文章**：补充或修正现有文章的格式
3. **生成新博客文章**：创建符合规范的新文章模板
