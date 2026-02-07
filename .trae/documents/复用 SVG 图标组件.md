## 方案
1. 删除 `BlogCard.astro`，统一使用 `BlogCard.tsx`
2. 将 SVG 图标抽取为独立的 React 组件（`.tsx`）

## 实施步骤

### 1. 创建 React 图标组件
在 `src/assets/icons/` 目录下创建：

**CalendarIcon.tsx**
```tsx
interface Props {
  className?: string
}

export default function CalendarIcon({ className }: Props) {
  return (
    <svg className={className} width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
      <line x1='16' x2='16' y1='2' y2='6' />
      <line x1='8' x2='8' y1='2' y2='6' />
      <line x1='3' x2='21' y1='10' y2='10' />
    </svg>
  )
}
```

**UserIcon.tsx**
```tsx
interface Props {
  className?: string
}

export default function UserIcon({ className }: Props) {
  return (
    <svg className={className} width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  )
}
```

### 2. 修改 BlogCard.tsx
将内联 SVG 替换为导入的组件：
```tsx
import CalendarIcon from '@/assets/icons/CalendarIcon'
import UserIcon from '@/assets/icons/UserIcon'
```

### 3. 修改 RecentPosts.astro
更新导入，使用 React 版本的 BlogCard，并调整 props 传递方式。

### 4. 删除旧文件
- 删除 `src/components/BlogCard.astro`
- 删除 `src/assets/icons/CalendarIcon.astro`
- 删除 `src/assets/icons/UserIcon.astro`

## 文件变更总结
| 操作 | 文件 |
|------|------|
| ✅ 新建 | `src/assets/icons/CalendarIcon.tsx` |
| ✅ 新建 | `src/assets/icons/UserIcon.tsx` |
| ✏️ 修改 | `src/components/BlogCard.tsx` |
| ✏️ 修改 | `src/components/RecentPosts.astro` |
| 🗑️ 删除 | `src/components/BlogCard.astro` |
| 🗑️ 删除 | `src/assets/icons/CalendarIcon.astro` |
| 🗑️ 删除 | `src/assets/icons/UserIcon.astro` |