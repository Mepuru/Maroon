<div align="center">
  <img alt="Maroon" src="public/icon.png" width=120 height=120/>
  <h1 align="center">Maroon</h1>
  <p align="center">暖色系 Astro 博客 + 文档双用途主题</p>
  <p align="center">
    <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat&logo=astro&logoColor=white" alt="Astro"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat" alt="License"></a>
  </p>
</div>

---

## 简介

Maroon 是一个基于 **Astro 5** 的静态博客与文档双用途主题。采用 Monorepo 架构，核心主题 `astro-maroon` 作为独立 npm workspace 包，与内容解耦。

> **这是 Maroon 主题的实际使用站点。**
> 如果你只是想快速搭建一个博客，参考下方「快速开始」即可。
> 如果你想了解主题的架构设计和开发规范，访问站内 `/docs/architecture`。

## 特性

- **Astro 5** — 内容驱动，默认零 JS 输出
- **博客 + 文档** — 同一套系统支持两种内容形态
- **双主题切换** — 奶油（cream） / 星空（starry），CSS 变量驱动
- **ViewTransitions** — 页面间平滑过渡动画
- **标签筛选** — 跨内容类型的标签聚合与筛选页面
- **全文搜索** — Pagefind 构建时索引，零运行时依赖
- **代码高亮** — Expressive Code，github-dark 主题，支持行号
- **图片灯箱** — PhotoSwipe，点击放大、滚轮缩放
- **图片题注** — Markdown `![alt](src "caption")` 自动渲染为 figure + figcaption
- **响应式布局** — 桌面三栏 / 平板双栏 / 手机单栏 + 抽屉
- **配置驱动** — 站点信息、内容类型、导航全部集中在一个配置文件
- **Monorepo 架构** — 主题包独立，可发布到 npm 复用

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev        # → http://localhost:4321

# 生产构建
npm run build      # 构建 + Pagefind 搜索索引

# 预览构建产物
npm run preview
```

## 配置站点

编辑 [src/config/maroon.ts](src/config/maroon.ts) —— 这是整个站点的唯一配置入口：

```ts
export const siteConfig = {
  title: '你的站点标题',
  author: '你的名字',
  avatar: '/avatar.jpg',
  bio: '个人简介',
  social: { github: 'https://github.com/xxx' },
};
```

## 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章简介
pubDate: 2026-01-01
tags: [Astro, TypeScript]
draft: false
---

这里是正文，支持完整 Markdown 语法。
```

在 `src/content/docs/` 下创建文档，额外支持 `category` 字段用于侧边栏分组。

## 项目结构

```
maroon/
├── packages/
│   └── astro-maroon/          # 独立主题包
│       ├── src/
│       │   ├── components/    # UI 组件
│       │   ├── layouts/       # BaseLayout / PostLayout / DocsLayout
│       │   ├── styles/        # CSS 变量、排版、布局
│       │   ├── types/         # 公共类型定义
│       │   └── utils/         # 工具函数
│       └── package.json
│
├── src/
│   ├── config/maroon.ts       # ⭐ 唯一配置入口
│   ├── content/
│   │   ├── blog/              # 博客文章 (.md)
│   │   ├── docs/              # 文档 (.md)
│   │   └── pages/             # 独立页面
│   ├── content.config.ts      # Zod Schema
│   ├── middleware.ts          # 配置注入
│   └── pages/                 # 路由
├── astro.config.mjs
└── package.json
```

## 文档

| 位置 | 内容 |
|------|------|
| 站内 `/docs/architecture` | 完整架构文档：分层结构、数据流、布局系统、主题系统、开发规范、新增内容类型、常见陷阱 |

站内文档在本地运行 `npm run dev` 后访问 `/docs/architecture` 即可阅读。

## 新增内容类型

以新增「笔记」为例，四步完成：

1. **`src/config/maroon.ts`** — `contentRegistry` 加一条配置
2. **`src/content.config.ts`** — 加 `defineCollection`
3. **`src/content/notes/`** — 放 `.md` 文件
4. **`src/pages/notes/`** — 建列表页 + 详情页路由

导航栏、首页系列卡片、URL 路径自动生成。详见站内 `/docs/architecture`。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | [Astro](https://astro.build) 5 |
| 语言 | [TypeScript](https://www.typescriptlang.org) 5 |
| 样式 | CSS Custom Properties |
| 搜索 | [Pagefind](https://pagefind.app) |
| 代码高亮 | [Expressive Code](https://expressive-code.com) |
| 图片灯箱 | [PhotoSwipe](https://photoswipe.com) |
| 包管理 | npm workspaces |
| 协议 | MIT |

## 许可

[MIT](LICENSE) © 2026 Mepuru

---

<p align="center">
  <a href="https://github.com/Mepuru/Maroon">GitHub</a>
</p>
