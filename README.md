<div align="center">
    <img alt="Chestnut Blog" src="public/icon.png" width=120 height=120/>

# 栗かな的博客

个人博客 - 基于 Astro 构建的静态博客

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![EdgeOne](https://img.shields.io/badge/EdgeOne-Pages-006EFF?style=flat-square)](https://edgeone.ai)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

## 简介

这是我的个人博客，记录技术探索、日语学习和生活感悟。从 Hexo 迁移至 Astro，获得更好的 Markdown 支持和开发体验。

## 特性

- **Astro 5.x** - 内容驱动的静态站点框架
- **Pagefind 搜索** - 构建时自动生成全文索引，零 JS 依赖
- **Markdown 增强** - Shiki 代码高亮，统一的 Markdown 处理
- **响应式设计** - 适配桌面和移动端
- **EdgeOne 部署** - 国内 CDN 加速，访问速度快

## 技术栈

- **框架**: [Astro](https://astro.build)
- **搜索**: [Pagefind](https://pagefind.app)
- **部署**: EdgeOne Pages
- **语言**: TypeScript / Markdown

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建（含搜索索引）
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── Header.astro     # 顶部导航
│   ├── Footer.astro     # 页脚
│   ├── Search.astro     # 搜索弹窗
│   └── PostCard.astro   # 文章卡片
├── content/blog/        # Markdown 文章
├── layouts/             # 布局模板
├── pages/               # 页面路由
└── styles/              # 全局样式
public/
├── images/              # 文章图片资源
└── icon.png             # 博客图标
```

## 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章简介
pubDate: 2026-05-13
tags: [标签1, 标签2]
---

正文内容...
```

图片放在 `public/images/` 对应目录下，引用路径为 `/images/xxx/image.png`。

## 联系方式

- **GitHub**: [Mepuru](https://github.com/Mepuru)
- **VRChat**: KuriKana

---

<div align="center">

*"记录所思所想，留下走过的痕迹。"*

</div>
