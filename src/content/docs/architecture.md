---
title: "Chestnut-Astro 架构文档"
pubDate: 2026-05-16
category: "Astro"
---

## 项目概述

Chestnut-Astro 是一个基于 Astro 5 的静态个人博客，支持多主题切换（奶油/樱花/星空）、Markdown 内容管理、ViewTransitions 页面过渡动画。包含**博客**和**文档**两大内容板块，以及标签筛选、全文搜索等功能。

- **技术栈**：Astro 5 + TypeScript + CSS Custom Properties
- **Monorepo**：npm workspaces — 主应用 + `@kurikana/astro-theme` 主题包
- **构建输出**：纯静态 HTML（`output: 'static'`）

## 目录结构

```
chestnut-astro/
├── packages/
│   └── chestnut-theme/         # @kurikana/astro-theme — 可独立发布的主题包
│       ├── src/
│       │   ├── components/     #   组件（Header, Footer, PostCard, DocsSidebar, TOC...）
│       │   │   ├── blog/       #     博客卡片 (PostCard)
│       │   │   ├── docs/       #     文档侧边栏 (DocsSidebar)
│       │   │   ├── home/       #     首页 Hero / SeriesCard / SeriesSection
│       │   │   ├── shared/     #     共享组件 (Sidebar, TOC)
│       │   │   ├── Header/Footer/Search
│       │   ├── layouts/        #   布局（所有页面通过 props + Astro.locals.site 获取数据）
│       │   │   ├── BaseLayout.astro   #   ⭐ 根布局：<html>、Header、Footer、ViewTransitions
│       │   │   ├── PostLayout.astro   #   博客文章布局：正文 + TOC + 标签 + 上下篇导航
│       │   │   └── DocsLayout.astro   #   文档布局：侧边栏 + 正文 + TOC + 上下篇导航
│       │   ├── styles/
│       │   │   ├── base.css          #   3 套主题 CSS 变量、reset、布局尺寸变量
│       │   │   ├── global.css        #   样式入口（@import 其他文件）
│       │   │   ├── prose.css         #   文章排版
│       │   │   ├── theme-switcher.css#   主题切换器
│       │   │   ├── pages.css/print.css/home.css
│       │   ├── types/          #   所有公共类型定义
│       │   │   ├── site.ts     #   SiteConfig, NavItem
│       │   │   ├── series.ts   #   SeriesConfig, SortField, SeriesData
│       │   │   ├── blog.ts     #   PostCardProps, PostData
│       │   │   ├── components.ts  # 组件 Props
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   ├── date.ts         #   formatDate()
│       │   │   ├── reading-time.ts #   estimateReadingTime()
│       │   │   ├── themes.ts       #   主题列表 + 默认主题
│       │   │   └── content.ts      #   ⭐ 跨项目复用：getTagStats / buildSidebarData / groupDocsByCategory
│       │   └── index.ts            #   主题包公共 API 导出
│       └── package.json
│
├── src/                          # 主应用 — 极薄胶水层
│   ├── config/                   # 唯一入口修改点
│   │   ├── site.ts               #   ⭐ 站点配置（从 @kurikana/astro-theme 的 SiteConfig 类型）
│   │   ├── series.ts             #   系列配置（博客/文档板块元信息）
│   │   ├── routing.ts            #   URL 路由模板集中管理
│   │   └── index.ts              #   配置 barrel 导出（历史遗留，无人引用）
│   │
│   ├── content/                  # Markdown 内容
│   │   ├── blog/                 #   博客文章 (14 篇 .md)
│   │   ├── docs/                 #   文档文章 (7 篇 .md)
│   │   ├── pages/                #   独立页面 (about.md)
│   │   ├── registry.ts           #   内容类型注册表（设计预留，当前未被消费）
│   │   └── utils.ts              #   ⭐ 转发调用主题包工具 + getPublishedPosts/Docs
│   │
│   ├── config.content.ts         # 内容集合 Schema (Zod)
│   ├── middleware.ts             # ⭐ 全局配置注入 Astro.locals.site
│   ├── env.d.ts                  # Locals 类型声明
│   │
│   ├── pages/                    # 路由 — 极薄胶水层
│   │   ├── index.astro           #   首页：从主题包导入 BaseLayout/Hero/SeriesSection
│   │   ├── about.astro / 404.astro
│   │   ├── blog/index.astro      #   博客列表
│   │   ├── blog/[...slug].astro  #   博客详情（含 prev/next 导航）
│   │   ├── docs/index.astro      #   文档首页（空状态）
│   │   ├── docs/[...slug].astro  #   文档详情（含 prev/next 导航）
│   │   └── tags/[tag].astro      #   标签筛选
│   │
│   └── styles/
│       └── layout.css            # 应用层布局决策（.layout-wrapper 网格/间距/响应式断点）
│
├── tsconfig.json                 # 路径别名：@kurikana/astro-theme → packages/chestnut-theme/src
├── astro.config.mjs
└── package.json                  # workspaces: ["packages/*"]
```

## 架构模式

### 分层职责

| 层 | 目录 | 职责 | 可替换性 |
|----|------|------|---------|
| **主题包** | `packages/chestnut-theme/` | UI 组件、布局、排版、主题变量、工具函数 | 可 npm 发布，其他项目直接安装使用 |
| **配置层** | `src/config/` | 站点元数据、路由模板、系列定义 | 改配置即可换内容 |
| **内容层** | `src/content/` | Markdown 文件、Zod schema、查询工具 | 可换 CMS/数据库（只需改 pages/ 层） |
| **路由层** | `src/pages/` | 组装数据 → 调用主题包布局渲染 | 极薄，不包含业务逻辑 |

### 数据流

```
src/config/site.ts ──→ middleware.ts ──→ Astro.locals.site ──→ layouts 自动读取
                        (注入)                     (props 兜底 fallback)

src/content/ ──→ astro:content getCollection() ──→ src/pages/* ──→ 主题包 layouts
  .md 文件        (Zod schema 校验)                    (组装 props)    (渲染)
```

### 配置注入机制（middleware）

每次请求时，`src/middleware.ts` 将站点配置、主题列表、路由表注入 `Astro.locals.site`：

```ts
context.locals.site = {
  ...siteConfig,              // title, nav, social...
  themes,                     // 主题包提供
  defaultTheme,
  routes,                     // routing.ts
};
```

Layout 组件读取优先级：`props → Astro.locals.site → 硬编码兜底`，确保即使 middleware 未生效也有后备值。

### 内容层转发模式

`src/content/utils.ts` 是纯转发层：

```ts
// 主题包提供的纯函数（无 Astro 依赖）
export { getTagStats, buildSidebarData, groupDocsByCategory } from '@kurikana/astro-theme/utils/content';

// 依赖 astro:content 的查询留在 app 层
export async function getPublishedPosts() { ... getCollection('blog') ... }
export async function getPublishedDocs() { ... getCollection('docs') ... }
```

这样主题包不依赖 Astro runtime，可被任何框架使用。

## 组件层级

### 页面渲染链

```
BaseLayout (所有页面的根 — 主题包)
├── Header              # 导航栏（从 siteConfig.nav 渲染）
│   ├── ThemeSwitcher   # 主题切换器
│   └── SearchTrigger   # 搜索弹窗触发
├── .layout-wrapper     # 网格容器（CSS 来自 app 层的 layout.css）
│   └── main-content    # slot
│       ├── 首页: Hero + SeriesSection
│       │         └── SeriesCard (x2: 博客/文档)
│       ├── 博客列表: PostCard (x N)
│       ├── 博客详情: PostLayout → TOC + 上下篇导航
│       ├── 文档首页: DocsLayout → DocsSidebar + 空状态
│       └── 文档详情: DocsLayout → DocsSidebar + TOC + 上下篇导航
├── Sidebar (可选)       # 博客侧边栏（个人资料 + 标签云 + 链接）
├── Footer              # 页脚（作者 + ICP 备案号）
└── Search              # Pagefind 全文搜索弹窗
```

### 文档布局（DocsLayout）架构

```
┌─ Sidebar (fixed, left:0) ─┬─ Main Content ─┬─ TOC (fixed, right:0) ─┐
│ 260px (--sidebar-width)    │ 居中, 800px max │ 200px (--toc-width)    │
│                            │                 │                        │
│ DocsSidebar                │ <slot />        │ TOC                    │
│ ├─ 分类组 (details)        │  ← 正文内容     │  ← 页面目录            │
│ └─ 文档链接                │                 │  (h2/h3 自动高亮)      │
│                            ├─ prev/next nav ─┤                        │
│                            │  ← 上一篇 下一篇→│                        │
└────────────────────────────┴─────────────────┴────────────────────────┘
```

**注意**：DocsLayout 在 `:global(.layout-wrapper)` 中设置了 `display: block`，因为侧边栏和 TOC 都是 `position: fixed` 脱离文档流，父容器不需要 `display: grid`。这避免了 View Transitions 导航时因网格布局残留导致的内容区变窄问题。

### 博客文章布局（PostLayout）架构

```
┌─ .layout-wrapper (grid: 1fr 260px) ──────────────────────────┐
│ ┌─ Main Content ──────────┬─ Sidebar (fixed, right aligned) ─┐│
│ │ TOC (fixed left 200px)  │ 个人资料                        ││
│ │  ← 返回文章列表          │ 标签云                          ││
│ │  文章标题 + 元信息        │ 链接                            ││
│ │  正文 (.prose)           │                                 ││
│ │  上下篇导航              │                                 ││
│ └──────────────────────────┴─────────────────────────────────┘│
└───────────────────────────────────────────────────────────────┘
```

## Schema 定义

所有内容 Schema 在 `content.config.ts` 中：

```ts
// blog — 文章
z.object({ title, description, pubDate, tags[], draft })

// docs — 文档
z.object({ title, pubDate, category?, draft })

// pages — 独立页面
z.object({ title })
```

## 主题系统

三套主题通过 CSS 自定义属性 + `data-theme` 属性切换：

```css
[data-theme="cream"]  { --bg: #FBF9F6; --accent: #A0896C; ... }
[data-theme="sakura"] { --bg: #fef8fa; --accent: #d06090; ... }
[data-theme="starry"] { --bg: #1a1a2e; --accent: #7b8cde; ... }
```

**增加新主题**：改主题包的两个文件
1. `packages/chestnut-theme/src/utils/themes.ts` 加 `{ id, name }`
2. `packages/chestnut-theme/src/styles/base.css` 加 `[data-theme="xxx"]` 变量块

## ViewTransitions

`BaseLayout` 引入了 `<ViewTransitions />`，所有页面间导航使用浏览器原生 View Transition API。

**关键机制**：
- 所有带 JS 交互的组件在 `astro:after-swap` 中重初始化（Header 主题切换、TOC 滚动高亮、DocsLayout 侧边栏/TOC 切换）
- 主题切换使用内联 `<script is:inline>` 在页面加载时立即从 `localStorage` 恢复，防止闪烁
- 脚本使用外部变量保留 handler 引用，防止重复绑定事件监听器

## 添加新功能指南

### 添加新页面

1. `src/pages/` 下创建 `.astro` 文件
2. 从主题包导入对应 Layout/组件
3. 如需导航入口，改 `src/config/site.ts` 的 `nav` 数组

### 添加新内容集合

1. `content.config.ts` 定义 Schema + `defineCollection`
2. `src/content/` 下创建目录，放入 `.md` 文件
3. `src/content/utils.ts` 添加对应的 `getPublished*()` 查询函数
4. `src/pages/` 下创建路由文件（参考 blog 或 docs 模式）

### 添加新主题

1. `packages/chestnut-theme/src/utils/themes.ts` 加 `{ id, name }`
2. `packages/chestnut-theme/src/styles/base.css` 加 `[data-theme="xxx"]` 变量块

## 文档页面分类系统

每个文档可以指定 `category` 字段，侧边栏自动按分类分组折叠，不写 `category` 的归入「未分类」组。

```yaml
---
title: "文章标题"
pubDate: 2026-01-01
category: "Astro"
---
```

## 给后续开发者 / AI 的规则

### 必须遵守

1. **每个逻辑阶段完成后必须 `git commit`**，使用 Conventional Commits 格式（`feat:` / `fix:` / `refactor:` / `style:`）。
2. **修改 `siteConfig` 时，同步更新 `@kurikana/astro-theme/types/site.ts` 中的接口定义。**
3. **不要在组件中硬编码个人信息、导航链接、文案**——一律从 `siteConfig` / `Astro.locals.site` 读取。
4. **新增内容查询使用 `src/content/utils.ts` 的工具函数**，不要在各处重复 `getCollection().filter().sort()`。
5. **所有 `getCollection` 调用必须包裹 try/catch**，失败时回退空数组。
6. **CSS 关键尺寸使用 CSS 变量**（`--sidebar-width`、`--header-height`，定义在主题包 `base.css`）。
7. **发布前先 `npm run build` 验证零报错。**

### 文档维护规则

**每次完成功能开发或重大重构后，必须更新本文档**，确保目录结构、数据流、组件层级与实际代码一致。如果代码架构有变更但文档未同步，后续开发者将基于过时信息工作。

### 推送规则

**不要主动 `git push`**。所有提交保留在本地，由项目所有者决定何时推送到远程仓库。
