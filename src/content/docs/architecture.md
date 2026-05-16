---
title: "Chestnut-Blog 架构文档"
pubDate: 2026-05-16
category: "Astro"
---

## 项目概述

Chestnut-Blog 是一个基于 Astro 5 的静态个人博客，支持多主题切换（奶油/樱花/星空）、Markdown 内容管理、ViewTransitions 页面过渡动画。包含**博客**和**文档**两大内容板块，以及标签筛选、全文搜索等功能。

- **技术栈**：Astro 5 + TypeScript + CSS Custom Properties
- **构建输出**：纯静态 HTML（`output: 'static'`）
- **包管理器**：npm

## 目录结构

```
src/
├── components/           # 可复用组件
│   ├── blog/             #   博客卡片 (PostCard)
│   ├── docs/             #   文档侧边栏 (DocsSidebar)
│   ├── home/             #   首页 Hero / SeriesCard / SeriesSection
│   ├── shared/           #   共享组件 (Sidebar, TOC)
│   ├── Footer.astro      #   页脚
│   ├── Header.astro      #   导航栏 + 主题切换 + 移动端菜单
│   └── Search.astro      #   Pagefind 全文搜索弹窗
│
├── config/               # 配置（唯一入口修改点）
│   ├── site.ts           #   ⭐ 站点配置：标题、导航、头像、社交、备案号、docs 个性文本
│   ├── series.ts         #   系列配置：博客/文档板块的元信息
│   └── index.ts          #   配置 barrel 导出
│
├── content/              # Markdown 内容
│   ├── blog/             #   博客文章 (.md)
│   ├── docs/             #   文档文章 (.md)
│   └── pages/            #   独立页面 (about.md)
│
├── content.config.ts     #   内容集合 Schema 定义 (Zod)
│
├── layouts/              # 页面布局
│   ├── BaseLayout.astro  #   ⭐ 根布局：<html> 骨架、Header、Footer、ViewTransitions
│   ├── DocsLayout.astro  #   文档布局：侧边栏 + 正文 + TOC + 上下篇导航
│   └── PostLayout.astro  #   博客文章布局：正文 + TOC + 标签
│
├── pages/                # 路由页面
│   ├── index.astro       #   首页
│   ├── about.astro       #   关于页
│   ├── 404.astro         #   404 页
│   ├── blog/
│   │   ├── index.astro   #   博客列表
│   │   └── [...slug].astro  # 博客详情
│   ├── docs/
│   │   ├── index.astro   #   文档首页（空状态）
│   │   └── [...slug].astro  # 文档详情
│   └── tags/
│       └── [tag].astro   #   标签筛选页
│
├── styles/               # 全局样式
│   ├── base.css          #   ⭐ CSS 变量：3 套主题色、响应式断点、布局尺寸、字体
│   ├── global.css        #   样式入口（@import 其他文件）
│   ├── prose.css         #   文章内容排版（标题、代码块、引用等）
│   ├── home.css          #   首页入场动画 (fadeIn/fadeInUp)
│   ├── pages.css         #   独立页面样式
│   └── theme-switcher.css # 主题切换器样式
│
├── types/                # TypeScript 类型定义
│   ├── index.ts          #   barrel 导出
│   ├── blog.ts           #   BlogPost, PostCardProps, PostData
│   ├── components.ts     #   组件 Props 类型
│   ├── series.ts         #   SeriesConfig, SeriesData, SortField
│   └── site.ts           #   ⭐ SiteConfig, NavItem
│
└── utils/                # 工具函数
    ├── content.ts        #   ⭐ getPublishedDocs() / getPublishedPosts()
    ├── date.ts           #   formatDate()
    ├── reading-time.ts   #   estimateReadingTime()
    └── themes.ts         #   主题列表和默认主题
```

## 数据流

### 内容加载

所有 Markdown 内容通过 Astro Content Collections 管理。

```
Markdown (.md) → content.config.ts (Zod schema) → getCollection('blog'|'docs')
                                                         ↓
                                              getPublishedDocs() / getPublishedPosts()
                                              (utils/content.ts — 统一 filter + sort + try/catch)
                                                         ↓
                                              页面/组件渲染
```

**重要**：不要直接在各处写 `getCollection().filter().sort()`，使用 `utils/content.ts` 的工具函数。

### Schema 定义

所有内容 Schema 在 `content.config.ts` 中：

- `blogSchema`：`title`, `description`, `pubDate`, `tags[]`, `draft`
- `docsSchema`：`title`, `pubDate`, `category?`, `draft`

**命名约定**：博客和文档统一使用 `pubDate` 字段名。

### 配置系统

修改站点信息只需改一个文件：`src/config/site.ts`。

```ts
// 配置文件结构
siteConfig = {
  title, description, author,    // 站点元信息
  avatar, bio,                   // 个人资料（Hero / Sidebar 共用）
  nav: [{ href, label }],        // 导航栏链接（Header 自动渲染）
  social: { github },            // 社交链接（Sidebar 渲染）
  footer: { icp, icpUrl },       // 页脚备案号
  docs: { emptyTexts: [] },      // 文档空状态随机展示文本
}
```

## 组件层级

### 页面渲染链

```
BaseLayout (所有页面的根)
├── Header          # 导航栏（从 siteConfig.nav 渲染）
├── [页面内容]       # slot
│   ├── 首页: Hero + SeriesSection
│   │         └── SeriesCard (x2)
│   ├── 博客列表: PostCard (x N)
│   ├── 博客详情: PostLayout → TOC
│   ├── 文档首页: DocsLayout → DocsSidebar
│   └── 文档详情: DocsLayout → DocsSidebar + TOC + prev/next nav
├── Sidebar         # 博客侧边栏（标签云 + 个人资料）
├── Footer          # 页脚
└── Search          # Pagefind 搜索弹窗
```

### 文档布局（DocsLayout）架构

```
┌─ Sidebar (fixed, left:0) ─┬─ Main Content ─┬─ TOC (fixed, right:0) ─┐
│ 260px                      │ 居中, 800px max │ 200px                   │
│                            │                 │                         │
│ DocsSidebar                │ <slot/>         │ TOC                     │
│ ├─ 分类组 (details)        │  ← 正文内容     │  ← 页面目录             │
│ └─ 文档链接                │                 │                         │
└────────────────────────────┴─────────────────┴─────────────────────────┘
```

**关键 CSS 变量**（定义在 `base.css`）：
- `--sidebar-width: 260px`
- `--header-height: 64px`
- `--toc-width: 200px`

### 移动端行为

| 屏幕宽度 | 侧边栏 | TOC |
|----------|--------|-----|
| ≥1201px | 固定左侧 | 固定右侧 |
| 769-1200px | 固定左侧 | 隐藏，圆形 FAB 弹出全屏浮层 |
| ≤768px | 变为左滑抽屉 + 遮罩 | 同上 FAB |

## 主题系统

三套主题通过 CSS 自定义属性 `data-theme` 切换：

```css
[data-theme="cream"]  { --bg: #FBF9F6; --accent: #A0896C; ... }
[data-theme="sakura"] { --bg: #fef8fa; --accent: #d06090; ... }
[data-theme="starry"] { --bg: #1a1a2e; --accent: #7b8cde; ... }
```

**工作原理**：
1. `BaseLayout` 的 `<head>` 中内联脚本在页面加载时从 `localStorage` 恢复主题
2. `Header` 的主题切换按钮写入 `localStorage` 并更新 `data-theme`
3. `BaseLayout` 底部脚本监听 `astro:after-swap`，导航后恢复主题（防止 ViewTransitions 回退默认）

**增加新主题**：在 `src/utils/themes.ts` 加条目，在 `src/styles/base.css` 加对应的 `[data-theme="xxx"]` 变量块。

## ViewTransitions

`BaseLayout` 引入了 `<ViewTransitions />`，所有页面间导航使用浏览器原生 View Transition API 做 crossfade 过渡。

**注意事项**：
- `Header` 的主题切换脚本使用 `<script>`（非 `is:inline`），配合 `astro:after-swap` 重初始化
- `DocsLayout` 的侧边栏/TOC 切换也在 `astro:after-swap` 重初始化，**且使用外部变量存储 handler 引用防止重复监听**
- `BaseLayout` 的 `astro:after-swap` 监听器负责在导航后从 `localStorage` 恢复主题

## 添加新功能指南

### 添加新页面

1. 在 `src/pages/` 下创建 `.astro` 文件
2. 如需导航入口，在 `src/config/site.ts` 的 `nav` 数组加一项

### 添加新内容集合

1. `content.config.ts` 中定义 Schema + `defineCollection`
2. `src/content/` 下创建目录，放入 `.md` 文件
3. 创建对应页面路由和布局
4. `utils/content.ts` 中添加对应的 `getPublished*()` 工具函数

### 添加新主题

1. `src/utils/themes.ts`：在 `themes` 数组加 `{ id, name }`
2. `src/styles/base.css`：添加 `[data-theme="xxx"]` 变量块（参考现有的 3 个）

## 文档页面分类系统

每个文档可以指定 `category` 字段：

```yaml
---
title: "文章标题"
pubDate: 2026-01-01
category: "Astro"
---
```

侧边栏会自动按分类分组，用原生 `<details>` 折叠展开。不写 `category` 的归入「未分类」组（仅在有分类组存在时显示）。

## 文档空状态

`/docs` 首页不自动打开任何文档，而是在正文区随机展示一条 `siteConfig.docs.emptyTexts` 数组中的文本。支持 `\n` 换行。


## 给后续开发者 / AI 的规则

### 必须遵守

1. **每个逻辑阶段完成后必须 `git commit`**，使用 Conventional Commits 格式（`feat:` / `fix:` / `refactor:` / `style:`）。不要等到最后一次性提交。
2. **修改 `siteConfig` 或相关类型时，同步更新 `src/types/site.ts` 中的接口定义。**
3. **不要在组件中硬编码个人信息、导航链接、文案**——一律从 `siteConfig` 读取。
4. **新增内容获取逻辑时使用 `utils/content.ts` 的工具函数**，不要在各处重复 `getCollection().filter().sort()`。
5. **所有 `getCollection` 调用必须包裹 try/catch**，失败时回退空数组/空状态。
6. **CSS 关键尺寸使用 `base.css` 中的变量**（`--sidebar-width`、`--header-height`）。
7. **发布前先 `npx astro build` 验证零报错。**

### 文档维护规则（极其重要）

**每次完成功能开发或重大重构后，必须更新本文档**，确保：

- 目录结构反映最新文件布局
- 配置系统描述与 `siteConfig` 实际字段一致
- 数据流图准确
- 组件层级包含新增/删除的组件
- 移除已废弃的功能描述
- 添加新功能的指南章节

**AI 开发者特别注意**：完成工作后，在最终 commit 之前，**务必检查本文档是否需要更新**。如果代码架构有变更但文档未同步，后续开发者将基于过时信息工作。

### 推送规则

**不要主动 `git push`**。所有提交保留在本地，由项目所有者决定何时推送到远程仓库。
