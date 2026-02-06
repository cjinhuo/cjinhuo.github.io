## 功能概述

为所有博客文章添加标签（tags）功能，在文章列表和文章详情页展示。

***

## 实现步骤

### 1. 更新类型定义

**文件**: `src/types/blog.ts`

* 在 `BlogType` 接口中添加 `tags?: string[]` 可选字段

### 2. 创建 Tag 展示组件

**新文件**: `src/components/Tag.tsx`

* 创建可复用的标签组件

* 支持不同尺寸（列表页用小尺寸，详情页用正常尺寸）

* 使用现有的 skin 颜色系统，确保深色模式兼容

* 样式：圆角胶囊形状，带背景色

### 3. 更新博客列表卡片

**文件**: `src/components/BlogCard.tsx`

* 从 frontmatter 中获取 tags

* 在描述文字下方展示标签列表

### 4. 更新博客详情布局

**文件**: `src/layouts/BlogPost.astro`

* 从 frontmatter 中动态读取 tags（替换当前硬编码的 tags）

* 在标题和日期下方展示标签

### 5. 为现有文章添加标签

**文件**:

* `src/pages/blogs/2024/my-projects.md`

* `src/pages/blogs/2025/blazwitcher.md`

为每篇文章在 frontmatter 中添加合适的 tags 字段

***

## 预期效果

**列表页**:

```
文章标题
日期, by 作者
描述文字...
[标签1] [标签2] [标签3]
```

**详情页**:

```
文章标题
日期
[标签1] [标签2] [标签3]
---
正文内容...
```

***

## 标签样式设计

* 背景色：使用 `neutral-8` / 深色模式下 `neutral-3`

* 文字色：使用 `neutral-3` / 深色模式下 `neutral-8`

* 圆角：`rounded-full`

* 内边距：`px-2 py-0.5`（小尺寸）/ `px-3 py-1`（正常尺寸）

* 字体大小：`text-xs`（小尺寸）/ `text-sm`（正常尺寸）

