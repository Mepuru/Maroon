<div align="center">
    <img alt="Chestnut Astro" src="public/icon.png" width=120 height=120/>

# Chestnut-Astro

个人博客 + 文档站 — 基于 Astro 5 的静态站点

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

## 简介

个人博客 + 文档站点，记录技术探索、日语学习和生活感悟。采用 Monorepo 结构，核心主题 `@kurikana/astro-theme` 作为独立 npm workspace 包，与内容解耦。

## 特性

- **Astro 5.x** — 内容驱动，零 JS 首屏
- **Monorepo 架构** — 主题包独立，可发布复用
- **ViewTransitions** — 页面间平滑 crossfade 过渡
- **三套主题** — 奶油 / 樱花 / 星空，CSS 变量驱动，localStorage 记忆
- **博客系统** — Markdown 文章、标签筛选、阅读时间、上下篇导航
- **文档系统** — 侧边栏固定 + TOC 固定、分类折叠、上下篇导航
- **全文搜索** — Pagefind 构建时索引，零运行时依赖
- **配置驱动** — 个人信息/导航集中在 `src/config/site.ts`
- **响应式** — 桌面三列 / 平板双列 / 手机抽屉式侧边栏

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 构建 + Pagefind 索引
npm run preview    # 预览构建结果
```

## 项目结构

```
chestnut-astro/
├── packages/
│   └── chestnut-theme/        # @kurikana/astro-theme — 独立主题包
│       ├── src/
│       │   ├── components/    # UI 组件（Header, Footer, PostCard, Sidebar, TOC...）
│       │   ├── layouts/       # BaseLayout, PostLayout, DocsLayout
│       │   ├── styles/        # CSS 变量、prose 排版、theme-switcher
│       │   ├── types/         # SiteConfig, SeriesConfig, PostCardProps 等公共类型
│       │   └── utils/         # formatDate, estimateReadingTime, getTagStats 等工具
│       └── package.json
│
├── src/                       # 主应用 — 胶水层
│   ├── config/
│   │   ├── site.ts            # ⭐ 站点配置（单一修改入口）
│   │   ├── series.ts          # 系列配置（博客/文档板块）
│   │   └── routing.ts         # URL 路由模板
│   ├── content/               # Markdown 内容
│   │   ├── blog/              # 博客文章
│   │   ├── docs/              # 文档文章
│   │   ├── pages/             # 独立页面
│   │   └── utils.ts           # 转发表层 + getPublishedPosts/Docs
│   ├── content.config.ts      # Zod Schema
│   ├── middleware.ts           # 配置注入 Astro.locals.site
│   ├── pages/                 # 路由（极薄胶水层）
│   │   ├── blog/[...slug].astro  # 博客详情
│   │   ├── docs/[...slug].astro  # 文档详情
│   │   └── ...
│   └── styles/
│       └── layout.css         # 应用层布局样式
├── tsconfig.json              # 路径别名映射到主题包
└── package.json               # workspaces: ["packages/*"]
```

## 配置

所有站点级配置在 `src/config/site.ts`：

```ts
export const siteConfig = {
  title: '栗かな',
  author: '栗かな',
  avatar: '/icon.png',
  bio: '日语专业 / 技术探索中',
  nav: [
    { href: '/', label: '首页' },
    { href: '/blog', label: '博客' },
    { href: '/docs', label: '文档' },
    { href: '/about', label: '关于' },
  ],
  social: { github: 'https://github.com/Mepuru' },
  footer: { icp: '鲁ICP备...', icpUrl: 'https://...' },
  docs: { emptyTexts: [...] },
};
```

加导航页、改昵称、换头像——只改这一个文件。配置通过 `src/middleware.ts` 自动注入 `Astro.locals.site`，所有布局组件直接读取。

## 写博客

在 `src/content/blog/` 下创建 `.md` 文件：

```yaml
---
title: 文章标题
description: 文章简介
pubDate: 2026-05-16
tags: [Astro, TypeScript]
draft: false
---
```

- `draft: true` 标记草稿，构建时自动过滤
- 图片放 `public/images/` 下，引用 `/images/xxx.png`

## 写文档

在 `src/content/docs/` 下创建 `.md` 文件：

```yaml
---
title: 文档标题
pubDate: 2026-05-16
category: Astro    # 可选，侧边栏按此分组折叠
draft: false
---
```

## 架构文档

完整的代码架构说明在 [/docs/architecture](/docs/architecture)（即 `src/content/docs/architecture.md`），包含数据流、组件层级、主题系统详解和给后续开发者的规则。

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Astro 5 |
| 搜索 | Pagefind |
| 语言 | TypeScript |
| 样式 | CSS Custom Properties |
| 包管理 | npm workspaces |
| 部署 | EdgeOne Pages |

## 联系方式

- **GitHub**: [Mepuru](https://github.com/Mepuru)
- **VRChat**: KuriKana

---

<div align="center">

*"记录所思所想，留下走过的痕迹。"*

</div>
