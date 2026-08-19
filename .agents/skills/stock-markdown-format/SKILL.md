---
name: "stock-markdown-format"
description: "股票交易复盘 Markdown 格式规范：frontmatter 字段（单笔 trade / 多笔 trades）、文件路径约定与支持的容器 block。当需要新建、迁移或完善 src/content/stock 下的交易复盘文章时调用。"
---

# Stock 交易复盘 Markdown 格式规范

本 skill 说明本项目「Stock 交易复盘」文章（`src/content/stock/`）的编写格式。当需要**新建、迁移或完善交易复盘文章**时，必须遵循以下规范，以确保通过 content collection 的 schema 校验并正确渲染。

> 提示：Stock 复盘与普通博客（`src/content/blogs/`）是**两个独立的 collection**。普通博客格式请用 `blog-markdown-format` skill；本 skill 仅适用于 Stock 复盘。

## 文件位置与命名

复盘文章存放在 `src/content/stock/` 下，按年份分目录：

```
src/content/stock/
└── 2026/
    ├── 06-28-semiconductor-review.md      # 单笔交易复盘
    └── 08-19-panic-sell-before-fomc.md    # 一次卖出多个标的的复盘
```

命名规则：

1. 目录按年份划分：`src/content/stock/{YYYY}/`
2. 文件名建议格式：`{MM-DD}-{英文短标题}.md`，短标题用小写中划线连接（kebab-case）
3. 生成的访问路由为 `/stock/{YYYY}/{文件名不含扩展名}`，例如 `/stock/2026/08-19-panic-sell-before-fomc`
4. 若文章包含图片等资源，参照博客规范创建同名文件夹并使用 `index.md`（当前 stock 文章暂无此需求）

## Frontmatter 格式

Stock 文章的 frontmatter 由 `src/content.config.ts` 中的 `stock` collection schema 校验。字段如下：

| 字段 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `title` | 是 | string | 文章标题 |
| `description` | 是 | string | 文章描述，用于列表卡片与 SEO |
| `pubDate` | 是 | string | 发布日期，格式 `'YYYY-MM-DD'` |
| `tags` | 否 | string[] | 标签数组，如 `['复盘', '情绪管理']`，第 1、2 个会在列表卡片展示 |
| `updatedDate` | 否 | string | 更新日期，格式 `'YYYY-MM-DD'` |
| `author` | 否 | string | 作者，默认取项目配置 |
| `authorHref` | 否 | string | 作者主页链接 |
| `trade` | 否 | object | **单笔**交易数据（向后兼容旧文章） |
| `trades` | 否 | object[] | **多笔**交易数据（一次卖出多个标的时使用） |

### trade / trades 字段结构

`trade`（单笔）和 `trades`（多笔数组）中的每一项，都遵循同一套结构，所有子字段均为可选：

| 子字段 | 说明 | 示例 |
| --- | --- | --- |
| `symbol` | 标的代码 | `'DRAM.US'` |
| `related` | 关联名称 / 中文名 | `'Roundhill 记忆芯片 ETF'` |
| `buyPrice` | 买入均价（原样字符串，含币种符号） | `'US$ 74.83'` |
| `sellPrice` | 卖出 / 清仓均价 | `'US$ 55.06'` |
| `changePercent` | 涨跌幅，**以 `-` 开头表示亏损**（决定红绿颜色） | `'-26.4%'` |
| `profit` | 盈亏金额，**以 `-` 开头表示亏损** | `'-US$ 3,559'` |

:::warning[单笔与多笔的选择]
- **一次只卖出一个标的**：用 `trade`（单个对象）。
- **一次卖出多个标的**：用 `trades`（对象数组）。
- 两者的渲染统一经过 `src/shared/stock.ts` 的 `normalizeTrades()` 归一化为数组：**优先取 `trades`，为空时回退到 `trade`**。因此两个字段都写时以 `trades` 为准，不要同时依赖两者。
:::

### 颜色与显示规则

- `changePercent` 和 `profit` 的值**以 `-` 开头判定为亏损**（渲染为下跌色），否则为盈利（上涨色）。请显式带上 `+` 或 `-` 前缀。
- 缺失的子字段会被自动跳过（如 NOK 无 `buyPrice` 则不显示「买入均价」块），无需填占位值。
- 详情页 header 的「关联标的」合并展示所有笔的 `symbol`；列表卡片底部的「关联」合并展示所有笔的 `related`（去重）。
- 多笔时，详情页「本次交易数据」卡片会为每笔单独渲染，并在标的名处显示 `symbol · related`。

### 单笔示例（trade）

```yaml
---
title: "示例：一次追高的复盘"
description: "文章描述，简要概括本次交易的背景与复盘要点……"
pubDate: 'YYYY-MM-DD'
tags: ['复盘', '情绪管理']
trade:
  symbol: 'XXXX.US'
  related: '示例标的名称'
  buyPrice: 'US$ 100.00'
  sellPrice: 'US$ 90.00'
  changePercent: '-10.0%'
  profit: '-US$ 1,000'
---
```

### 多笔示例（trades）

```yaml
---
title: "示例：一次卖出多个标的的复盘"
description: "文章描述，简要概括本次一次性减仓多个标的的背景与复盘要点……"
pubDate: 'YYYY-MM-DD'
tags: ['复盘', '情绪管理', '仓位管理']
trades:
  - symbol: 'AAAA.US'
    related: '示例标的 A'
    buyPrice: 'US$ 100.00'
    sellPrice: 'US$ 80.00'
    changePercent: '-20.0%'
    profit: '-US$ 2,000'
  - symbol: 'BBBB.US'
    related: '示例标的 B'
    buyPrice: 'US$ 50.00'
    sellPrice: 'US$ 55.00'
    changePercent: '+10.0%'
    profit: '+US$ 500'
  - symbol: 'CCCC.US'        # 成本已归零，只记录卖出价，其余字段省略
    related: '示例标的 C'
    sellPrice: 'US$ 12.00'
---
```

## 正文 Markdown 语法规范

### 标题层级

- 正文一级标题从 `##`（H2）开始，禁止使用 `#`（H1，标题已在 frontmatter 中定义）
- 逐级使用 `###`、`####`

### 支持的容器 block

正文支持类似 VuePress 的自定义容器（由 `src/plugins/remark-container.mjs` 实现），共 **5 种**：

| 类型 | 默认标题 | 用途 | 渲染元素 |
| --- | --- | --- | --- |
| `tip` | 提示 | 有用的建议或技巧 | `div`（绿色边框） |
| `warning` | 注意 | 需要注意的事项 | `div`（橙色边框） |
| `danger` | 警告 | 潜在危险或核心警示 | `div`（红色边框） |
| `info` | 信息 | 补充信息 | `div`（蓝色边框） |
| `details` | 详情 | 可折叠内容 | `details`（点击展开） |

**语法**（类型与 `[` 之间**不能有空格**）：

```markdown
:::warning[追高的本质]
追高的本质不是「买贵了」，而是用情绪替换了纪律。
:::
```

- 带自定义标题：`:::tip[带着问题看]`
- 使用默认标题（省略方括号）：`:::warning`
- 可折叠：`:::details[点击展开]`

### 其他常用语法

- **表格**：标准 GFM 表格，常用于列出多笔卖出记录（标的 / 数量 / 成交价 / 成本 / 盈亏）。
- **有序 / 无序列表**：用于错误清单、下单前检查清单等。
- **引用块**：`>` 引用。
- **行内代码 / 代码块**：三反引号并标注语言。
- 上标 `X<sup>n</sup>`、下标 `H<sub>2</sub>O`、高亮 `<mark>文本</mark>`、键盘键 `<kbd>CTRL</kbd>` 等 HTML 内联元素同样可用。

## 写作约定

1. 交易数据（价格、盈亏、涨跌幅）统一写进 frontmatter 的 `trade` / `trades`，正文不重复堆砌数字，聚焦「决策链条与复盘」。
2. 盈亏若为估算（如按当前持仓均价推算而非实际已实现盈亏），应在正文用 `:::warning[数据口径]` 明确标注口径。
3. 核心教训 / 警示建议用 `:::danger` 或 `:::warning` 容器突出。
4. 币种符号（`US$`、`HK$`、`¥`）在 `buyPrice` / `sellPrice` / `profit` 中原样书写，保持全站一致。

## 校验

新建或修改后，可通过本地 dev 服务验证是否通过 schema 校验并正确渲染：

```bash
# 使用本地二进制启动，避免 pnpm 联网校验（node_modules 已安装）
node_modules/.bin/astro dev
```

服务默认监听 `http://localhost:4321`。访问 `/stock` 列表页与 `/stock/{年份}/{文件名}` 详情页确认无报错、交易数据展示正确。
