# 投资心得（Stock Journal）Spec

## Why
设计稿提供了「投资心得」列表页与「心得详情」页，其视觉与现有 Astro 博客（`shanks-blog`）同源（skin.css 中的 light/dark tokens 完全一致）。项目中已存在未注册的 `src/content/stock/` 内容目录，但缺少集合定义、页面路由与导航入口。本 spec 将设计稿落地为可运行的功能模块，复用现有主题系统，实现视觉一致、支持页面交互与多设备适配。

## What Changes
- 注册新的 `stock` 内容集合，schema 支持投资交易元数据（涨跌幅、盈亏、关联标的、买入/清仓均价等）。
- 新增列表页路由 `/stock`：页头区、标签筛选行（可横向滚动、可交互过滤）、心得卡片列表、加载更多。
- 新增详情页路由 `/stock/[...slug]`：返回列表、文章头、交易数据卡、正文（markdown/prose）、上一篇/下一篇导航。
- 新增专用组件 `StockCard`（列表卡片）、`StockJournal`（客户端标签筛选岛）。
- 在 Header 导航中新增「投资心得」入口，指向 `/stock`，并支持激活态高亮。
- 在 `skin.css` / `tailwind.css` 中新增市场语义色 tokens（涨=红、跌=绿，遵循 A 股约定），严禁硬编码颜色。
- 补充与设计稿一致的示例心得内容（含一篇完整详情文章与多篇列表项），使项目可直接运行展示。

## Impact
- Affected specs: 内容集合（content collections）、站点导航、主题 tokens。
- Affected code:
  - `src/content.config.ts`（新增 stock 集合）
  - `src/content/stock/**`（示例内容）
  - `src/pages/stock/index.astro`、`src/pages/stock/[...slug].astro`（新增路由）
  - `src/components/Stock/StockCard.astro`、`src/components/Stock/StockJournal.tsx`（新增组件）
  - `src/components/Header/NavLink.tsx`（新增导航项）
  - `src/shared/stock.ts`（新增数据读取/排序/标签工具）
  - `src/styles/skin.css`、`src/styles/tailwind.css`（市场语义色 tokens）
  - `src/types/`（stock 类型，可选）

## ADDED Requirements

### Requirement: Stock 内容集合
系统 SHALL 定义一个名为 `stock` 的内容集合，使用 glob loader 从 `./src/content/stock` 读取 `**/*.{md,mdx}`，并提供投资心得所需的类型安全 frontmatter。

#### Scenario: Schema 校验通过
- **WHEN** markdown 文件包含 `title`、`description`、`pubDate`、可选 `updatedDate`、可选 `tags`、可选 `trade`（含 `changePercent`、`profit`、`buyPrice`、`sellPrice`、`symbol`、`related`）
- **THEN** Astro 构建时集合校验通过，且字段可在页面中类型安全地访问

#### Scenario: 交易数据可选
- **WHEN** 某篇心得未提供 `trade` 字段
- **THEN** 列表卡片与详情页 SHALL 优雅降级，不渲染交易数据区块且不报错

### Requirement: 投资心得列表页
系统 SHALL 在 `/stock` 提供列表页，还原设计稿的页头、标签筛选、卡片列表与加载更多。

#### Scenario: 展示心得卡片
- **WHEN** 用户访问 `/stock`
- **THEN** 页面按 `pubDate` 倒序展示所有心得卡片，每张卡片显示日期、阅读时长、标签、标题、摘要、涨跌幅/盈亏（有则显示）、关联标的、以及指向详情页的「阅读全文 →」链接

#### Scenario: 标签筛选
- **WHEN** 用户点击某个标签按钮（如「复盘」）
- **THEN** 列表 SHALL 仅显示包含该标签的卡片，「全部」恢复显示所有卡片，且激活标签有高亮态

#### Scenario: 涨跌颜色语义
- **WHEN** 涨跌幅或盈亏为正值（含 `+`）
- **THEN** 使用市场「涨」色（红）；为负值时使用市场「跌」色（绿）

### Requirement: 心得详情页
系统 SHALL 在 `/stock/[...slug]` 提供详情页，还原设计稿的返回链接、文章头、交易数据卡、正文与上/下篇导航。

#### Scenario: 渲染详情
- **WHEN** 用户从列表点击「阅读全文」进入某篇心得
- **THEN** 页面显示标题、日期、阅读时长、关联标的、标签、交易数据卡（买入均价/清仓均价/本次盈亏，有则显示）、markdown 正文，以及上一篇/下一篇导航

#### Scenario: 正文告警块
- **WHEN** 正文使用 `:::warning` 容器语法
- **THEN** 通过现有 remark-container 渲染为告警样式区块

### Requirement: 导航入口与主题一致性
系统 SHALL 在全站 Header 增加「投资心得」导航项，并复用现有 light/dark 主题变量。

#### Scenario: 导航激活态
- **WHEN** 当前路径以 `/stock` 开头
- **THEN** 「投资心得」导航项显示为激活态（primary 色）

#### Scenario: 主题切换
- **WHEN** 用户切换深色/浅色主题
- **THEN** 列表页与详情页所有颜色随主题变量变化，无硬编码颜色

### Requirement: 多设备适配
系统 SHALL 保证列表页与详情页在移动端、平板、桌面下布局合理。

#### Scenario: 移动端标签行
- **WHEN** 在窄屏查看标签筛选行
- **THEN** 标签行可横向滚动且隐藏滚动条，卡片内次要标签/信息按断点收起

#### Scenario: 详情交易卡响应式
- **WHEN** 在移动端查看交易数据卡
- **THEN** 三列数据在窄屏堆叠为单列，宽屏为三列并显示分隔线
