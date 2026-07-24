# Tasks

- [x] Task 1: 主题 tokens 与集合基础设施：新增市场语义色变量并注册 stock 内容集合。
  - [x] SubTask 1.1: 在 `src/styles/skin.css` 的 `:root` 与 `.dark` 中新增 `--color-market-up`（涨/红）与 `--color-market-down`（跌/绿）变量（light: up=#EF4444, down=#22C55E；dark 相同）。
  - [x] SubTask 1.2: 在 `src/styles/tailwind.css` 的 `@theme` 中映射 `--color-skin-market-up` / `--color-skin-market-down`，以便使用 `text-skin-market-up` 等工具类。
  - [x] SubTask 1.3: 在 `src/content.config.ts` 新增 `stock` 集合，schema 含 `title`、`description`、`pubDate`、可选 `updatedDate`、可选 `author`/`authorHref`（默认值）、可选 `tags`，以及可选嵌套对象 `trade`（`changePercent?`、`profit?`、`buyPrice?`、`sellPrice?`、`symbol?`、`related?`，均为 string/number 合适类型），并加入 `collections` 导出。

- [x] Task 2: 数据读取工具：新增 `src/shared/stock.ts`。
  - [x] SubTask 2.1: 实现 `getSortedStockPosts()`（按 pubDate 倒序）、`getAllStockTags(posts)`（去重排序）、以及 `getAdjacentStockPosts(posts, id)`（返回上一篇/下一篇）辅助函数，类型基于 `CollectionEntry<'stock'>`。

- [x] Task 3: 列表页与卡片组件（依赖 Task 1、2）。
  - [x] SubTask 3.1: 新增 `src/components/Stock/StockCard`（React 实现，供交互岛复用）：还原设计稿卡片（日期·阅读时长、标签、标题、摘要 line-clamp-3、涨跌幅/盈亏 pill（有 trade 才显示，正红负绿）、hairline、关联标的 + 阅读全文链接指向 `/stock/{id}`）。
  - [x] SubTask 3.2: 新增 `src/components/Stock/StockJournal.tsx`（React 岛）：标签筛选行（横向滚动、no-scrollbar、激活高亮）、过滤后渲染卡片列表、「加载更多」按钮（分页显示）。涨跌颜色用主题类。
  - [x] SubTask 3.3: 新增 `src/pages/stock/index.astro`：BaseHead + Header + Footer，页头区，挂载 `StockJournal` client:load。

- [x] Task 4: 详情页（依赖 Task 1、2）。
  - [x] SubTask 4.1: 新增 `src/pages/stock/[...slug].astro`：getStaticPaths、返回链接、文章头、交易数据卡、prose 正文、上/下篇导航。

- [x] Task 5: 导航入口。
  - [x] SubTask 5.1: 在 `src/components/Header/NavLink.tsx` 增加「投资心得」项，激活态支持前缀匹配。

- [x] Task 6: 示例内容（依赖 Task 1）。
  - [x] SubTask 6.1: 在 `src/content/stock/2026/` 新增设计稿详情文章及多篇列表心得，兼容 06-22.md。

- [x] Task 7: 验证与构建。
  - [x] SubTask 7.1: 运行 `pnpm build` 确认无类型/构建错误。

# Task Dependencies
- Task 2 depends on Task 1（集合注册）
- Task 3 depends on Task 1, Task 2
- Task 4 depends on Task 1, Task 2
- Task 6 depends on Task 1
- Task 5 独立，可并行
- Task 7 depends on Task 3, Task 4, Task 5, Task 6
