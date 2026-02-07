## 实现方案

### 核心思路
在 `BlogTimeline.tsx` 中添加 hover 状态管理，当鼠标悬停在文章卡片上时，高亮对应的年份和月份节点。

### 修改文件

#### 1. `BlogTimeline.tsx`

**新增状态**：
```tsx
const [hoveredPost, setHoveredPost] = useState<{ year: number; month: number } | null>(null)
```

**修改年份节点样式**（第 123-130 行）：
- 当 `hoveredPost?.year === yearData.year` 时，年份圆点和文字高亮为 primary 色
- 否则保持原有逻辑（当前年份为 primary，其他年份为 neutral）

**修改月份节点样式**（第 151-165 行）：
- 当 `hoveredPost?.year === yearData.year && hoveredPost?.month === monthData.month` 时，月份圆点和文字高亮
- 只高亮**精确匹配**的单个月份

**修改 BlogCard 调用**（第 171-182 行）：
- 添加 `onMouseEnter` 回调，传入 `{ year, month }` 信息
- 添加 `onMouseLeave` 回调，清除 hover 状态

#### 2. `BlogCard.tsx`

**新增 Props**：
```tsx
onMouseEnter?: () => void
onMouseLeave?: () => void
```

**修改根容器**：
- 在最外层 `div` 上添加 `onMouseEnter` 和 `onMouseLeave` 事件绑定

### 样式变化效果

| 状态 | 年份节点 | 月份节点 |
|------|----------|----------|
| 默认 | 当前年份高亮，其他年份灰色 | 跟随年份颜色 |
| Hover | hover 文章所属年份高亮 | **只有** hover 文章所属月份高亮 |

### 代码变更量
- `BlogTimeline.tsx`：约 20 行变更
- `BlogCard.tsx`：约 5 行变更
