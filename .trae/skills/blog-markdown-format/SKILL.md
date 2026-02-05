---
name: blog-markdown-format
description: 博客 Markdown 格式规范。当需要迁移、完善或生成博客文章时，必须调用此 skill 以确保符合 frontmatter 头部信息和 Markdown 语法规范。
---

# 博客 Markdown 格式规范

当处理博客文章的迁移、完善或生成时，必须遵循以下格式规范。

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
| layout | 是 | 固定为 `"../../layouts/BlogPost.astro"` |
| title | 是 | 文章标题 |
| description | 是 | 文章描述 |
| pubDate | 是 | 发布日期，格式 `'YYYY-MM-DD'` |
| updatedDate | 否 | 更新日期，格式 `'YYYY-MM-DD'` |
| author | 是 | 作者名称 |
| authorHref | 否 | 作者主页链接 |
| heroImage | 否 | 文章封面图片路径 |
| heroImageAlt | 否 | 封面图片的 alt 描述 |

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

## 使用场景

当执行以下任务时，应调用此 skill：

1. **迁移博客文章**：将其他格式的文章转换为本博客的 Markdown 格式
2. **完善博客文章**：补充或修正现有文章的格式
3. **生成新博客文章**：创建符合规范的新文章模板
