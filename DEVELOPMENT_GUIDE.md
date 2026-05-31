# 开发规范

> Chestnut-Astro 项目开发约定与最佳实践

---

## 命名约定

| 类别 | 规则 | 示例 |
|---|---|---|
| 组件文件 | PascalCase | `Header.astro`, `PostCard.astro`, `DocsSidebar.astro` |
| 页面路由 | 动态参数用 `[]`，其余 kebab-case | `[...slug].astro`, `[tag].astro`, `index.astro` |
| 工具函数 | camelCase | `formatDate()`, `estimateReadingTime()`, `getPublishedPosts()` |
| 类型/接口 | PascalCase | `SiteConfig`, `PostCardProps`, `SeriesConfig` |
| CSS 类名 | kebab-case | `.post-card`, `.nav-links`, `.sidebar-toggle` |
| CSS 变量 | kebab-case, `--` 前缀 | `--header-height`, `--font-size-hero-title` |
| 目录名 | kebab-case | `shared/`, `home/`, `blog/`, `docs/` |

---

## 组件结构

每个组件遵循 **同名文件对** 规则：

```
src/components/Header.astro      # 模板 + 逻辑
src/components/Header.css        # 样式（通过 @import 引用）
```

```astro
---
// 逻辑代码放在 frontmatter 中
import type { Props } from '../types';
---
<style>
  @import './Header.css';    /* 引入同目录下的 CSS 文件 */
</style>

<!-- HTML 模板 -->
```

**原则：**
- CSS 独立文件管理，不内联 `<style>` 标签（除非极简单的 1–3 条样式）
- 组件 props 优先用类型接口，定义在组件内或从 `src/types/` 导入
- 每个组件只做一件事

---

## 导入顺序

按以下分组排列，每组之间空一行：

```astro
---
// 1. Astro 内置
import { ViewTransitions } from 'astro:transitions';
import { getCollection, render } from 'astro:content';

// 2. 本地组件
import Header from '../components/Header.astro';
import BaseLayout from '../layouts/BaseLayout.astro';

// 3. 本地工具函数
import { formatDate } from '../utils/date';
import { getPublishedPosts } from '../utils/content';

// 4. 类型
import type { PostCardProps } from '../types';

// 5. 数据/配置
import { siteConfig } from '../config/site';

// 6. 样式
import '../styles/global.css';
---
```

---

## CSS 规范

### 变量驱动

优先使用 CSS 自定义属性（`var(--xxx)`），**禁止**在组件样式中硬编码颜色、尺寸、圆角值。所有主题色在 `src/styles/base.css` 的 `[data-theme="xxx"]` 中定义。

```css
/* ✅ 正确 */
.doc-nav-link {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--fg);
}

/* ❌ 避免 */
.doc-nav-link {
  border: 1px solid #ede8e0;
  border-radius: 12px;
  color: #3a3632;
}
```

### 响应式断点

| 断点 | 说明 |
|---|---|
| `max-width: 768px` | 手机端 |
| `max-width: 1200px` | 平板端（隐藏 TOC、调整布局） |
| `min-width: 769px` | 桌面端 |

### 注释区块

使用区块注释分隔不同区域：

```css
/* ============================================
   Header 样式
   ============================================ */
```

### 过渡动画

主题切换相关属性统一使用 `0.5s cubic-bezier(0.4, 0, 0.2, 1)`：

```css
transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

交互反馈（hover/focus）使用 `0.2s ease`。

---

## TypeScript 规范

- **严格模式** — `tsconfig.json` 继承 `astro/tsconfigs/strict`
- **Props 接口** — 尽量先用 `interface` 而非 `type`，仅在需要联合/交叉时用 `type`
- **避免 `any`** — 优先 `unknown` + 类型收窄
- **类型导出** — 公共类型放在 `src/types/` 目录下，按模块拆分文件
- **组件 Props** — 定义在组件内或从 `src/types/` 导入：

```astro
---
interface Props {
  title: string;
  headings?: Array<{ depth: number; slug: string; text: string }>;
}

const { title, headings = [] } = Astro.props;
---
```

---

## 内容创作

### 博客文章

```
src/content/blog/your-post.md
```

```yaml
---
title: 文章标题
description: 文章简介
pubDate: 2026-05-16
tags: [Astro, TypeScript]
draft: false
---
```

- `draft: true` 时构建自动过滤
- 图片放 `public/images/` 下，引用 `/images/xxx.png`

### 文档文章

```
src/content/docs/your-doc.md
```

```yaml
---
title: 文档标题
pubDate: 2026-05-16
category: Astro    # 可选，侧边栏按此分组折叠
draft: false       # 可选
---
```

### 独立页面

1. 在 `src/content/pages/` 下创建 `.md` 文件
2. 在 `src/pages/` 下创建对应的路由 `.astro` 文件
3. 路由文件中用 `getEntry('pages', 'id')` 获取内容

---

## 工作流

### 本地开发

```bash
npm run dev        # 启动开发服务器（带热更新）
npm run build      # 生产构建 + Pagefind 搜索索引
npm run preview    # 预览构建产物
npm run typecheck  # 类型检查（需安装 @astrojs/check）
```

### Git 提交

commit message 用中文，前缀标识改动类型：

```
feat: 新功能描述
fix: 修复的问题描述
refactor: 重构描述
docs: 文档更新
style: 代码格式清理（不影响逻辑）
chore: 构建配置/工具更新
```

示例：

```
fix: 手机端文档上下篇导航溢出 — 纵向堆叠 + 标题截断双重修复
docs: 补充系列配置和独立页面文档
style: 移除未使用的 import 和 prop
```

---

## 项目结构参考

```
src/
├── config/           # 站点配置
│   ├── site.ts       # 站点元数据、导航、社交链接
│   ├── series.ts     # 首页系列卡片配置
│   └── routing.ts    # URL 路由模板集中管理
├── content/          # 内容框架层
│   ├── registry.ts   # 内容类型声明式注册表
│   ├── utils.ts      # 共享查询工具（标签统计、sidebar 构造、文档分组）
│   ├── blog/         # Markdown 文章
│   ├── docs/         # Markdown 文档
│   └── pages/        # Markdown 独立页面
├── content.config.ts # Astro content collections + Zod schema
├── middleware.ts     # Astro middleware — 全局配置注入 Astro.locals
├── env.d.ts         # Astro.locals.site 类型声明
├── pages/            # 路由页面（极薄层，只做路由分发）
│   ├── index.astro
│   ├── about.astro
│   ├── 404.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [...slug].astro
│   ├── docs/
│   │   ├── index.astro
│   │   └── [...slug].astro
│   └── tags/
│       └── [tag].astro
└── packages/
    └── chestnut-theme/    # 可发布的独立主题包
        ├── src/
        │   ├── components/  # 纯 UI 组件（不自知内容结构）
        │   ├── layouts/     # 布局包装器（从 Astro.locals.site 读取全局配置）
        │   ├── styles/      # CSS 变量主题系统
        │   ├── types/       # 组件 Props 类型
        │   └── utils/       # 工具函数（formatDate, readingTime, themes）
        └── package.json
```

---

## 内容类型注册表（Content Registry）

所有内容类型集中在 `src/content/registry.ts` 声明。新增一个内容类型的流程：

### 新内容类型添加流程

1. **Zod Schema** — 在 `src/content.config.ts` 中定义 `defineCollection` + schema
2. **注册声明** — 在 `src/content/registry.ts` 的 `contentRegistry` 数组加一条配置
3. **路由文件** — 在 `src/pages/` 下创建 `[typename]/[...slug].astro` 和 `index.astro`
4. **可选：系列配置** — 如需在首页展示，在 `src/config/series.ts` 加一条

```typescript
// 示例：在 registry.ts 中注册 "笔记" 类型
{
  id: 'notes',
  label: '笔记',
  routeKey: 'notes',       // 对应 routing.ts 中的 routes
  sidebarIncluded: true,   // 是否显示侧边栏
  series: {
    description: '学习笔记',
    countLabel: '篇笔记',
    align: 'left',
    sortField: 'pubDate',
    sortOrder: 'desc',
  },
}
```

### 路由文件编写规范

页面文件保持极薄：

```astro
---
// 只做三件事：加载数据、构造 props、渲染 layout
import DocsLayout from '@kurikana/astro-theme/layouts/DocsLayout.astro';
import { groupDocsByCategory } from '../../content/utils';

const allDocs = await getCollection('docs');
const { publishedDocs, categories } = groupDocsByCategory(allDocs);
---

<DocsLayout
  title="文档"
  categories={categories}
  totalCount={publishedDocs.length}
  // 全局配置由 Astro.locals.site 自动注入，无需手动传参
>
```

---

## Middleware 机制

`src/middleware.ts` 在每次请求时自动将全局站点配置注入 `Astro.locals.site`：

| 字段 | 来源 | 说明 |
|------|------|------|
| `title`, `description`, `author` | `src/config/site.ts` | 站点元数据 |
| `nav` | `src/config/site.ts` | 导航链接 |
| `themes` | `@kurikana/astro-theme/utils/themes` | 主题列表 |
| `defaultTheme` | `@kurikana/astro-theme/utils/themes` | 默认主题 |
| `routes` | `src/config/routing.ts` | URL 路由表 |

Layout 优先读取 `Astro.locals.site`（由 middleware 注入），也接受 props 传入作为覆盖（向后兼容）。

---

## 共享工具函数

位于 `src/content/utils.ts`：

| 函数 | 功能 | 消除的重复 |
|------|------|-----------|
| `getTagStats(posts)` | 提取标签并统计频次 | blog 三处重复 |
| `buildSidebarData(siteConfig, posts)` | 构造侧边栏数据 | blog 三处重复 |
| `groupDocsByCategory(docs)` | 按 category 分组文档 | docs 两处重复 |
| `getPublishedPosts()` | 获取已发布文章 | 统一入口 |
| `getPublishedDocs()` | 获取已发布文档 | 统一入口 |

---

## 主题包 URL 解耦

主题包组件通过可选 props 避免硬编码 URL：

| 组件 | Prop | 默认值 |
|------|------|--------|
| `PostCard` | `itemUrl?: string` | `/blog/{slug}` |
| `DocsSidebar` | `docUrlPrefix?: string` | `/docs` |
| `Sidebar` | `tagUrlPrefix?: string` | `/tags` |

外部站点可以传入自定义 URL 覆盖默认路径，主题包不依赖站点内容结构。

---

## 主题添加流程

1. `packages/chestnut-theme/src/utils/themes.ts` 添加 `{ id, name }`
2. `packages/chestnut-theme/src/styles/base.css` 添加 `[data-theme="xxx"]` 变量块

CSS 变量必须覆盖：`--bg`, `--fg`, `--accent`, `--accent-light`, `--border`, `--muted`, `--card-bg`, `--code-bg`, `--header-bg`, `--search-bg`, `--shadow-*`, `--gradient-*`, `--theme-label`, `--radius-*`。
