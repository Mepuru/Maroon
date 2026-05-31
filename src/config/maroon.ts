/**
 * Maroon 唯一配置入口
 *
 * 站点信息 + 内容类型注册表 + 自动推导函数，全部集中在此。
 * 新增内容类型只需在 contentRegistry 加一条记录。
 */

import type { SiteConfig } from 'astro-maroon/types/site';
import type { SortField, SortOrder } from 'astro-maroon/types';

// ============================================================
// 内容类型配置接口
// ============================================================

export interface ContentTypeConfig {
  /** 内容类型标识，对应 src/content/ 下的目录名 */
  id: string;
  /** 显示名称，用于导航和标题 */
  label: string;
  /** URL 路径定义 */
  route: {
    prefix: string;
    pattern: string;
  };
  /** 使用哪个 Layout（'post' = PostLayout, 'doc' = DocsLayout，可扩展） */
  layout: string;
  /** 详情页是否显示侧边栏（作者信息 + 标签云） */
  sidebarIncluded: boolean;
  /** 是否出现在导航栏 */
  showInNav?: boolean;
  /** 是否在 frontmatter 中包含 tags 字段，影响标签页聚合 */
  hasTags?: boolean;
  /** 可选：是否出现在首页的系列卡片区 */
  series?: {
    description: string;
    countLabel: string;
    align?: 'left' | 'right';
    sortField: SortField;
    sortOrder: SortOrder;
  };
}

// ============================================================
// 内容类型注册表（必须先于 siteConfig，因为 nav 依赖它）
// ============================================================

/**
 * ⭐ 新增一个内容类型，在这里加一条声明
 */
export const contentRegistry: ContentTypeConfig[] = [
  {
    id: 'blog',
    label: '博客',
    route: { prefix: '/blog', pattern: '/blog/[slug]' },
    layout: 'post',
    sidebarIncluded: true,
    showInNav: true,
    hasTags: true,
    series: {
      description: '散装的技术与生活记录',
      countLabel: '篇文章',
      align: 'left',
      sortField: 'pubDate',
      sortOrder: 'desc',
    },
  },
  {
    id: 'docs',
    label: '文档',
    route: { prefix: '/docs', pattern: '/docs/[slug]' },
    layout: 'doc',
    sidebarIncluded: false,
    showInNav: true,
    series: {
      description: '技术文档与知识整理',
      countLabel: '篇文档',
      align: 'right',
      sortField: 'pubDate',
      sortOrder: 'desc',
    },
  },
];

// ============================================================
// 站点配置
// ============================================================

/**
 * ⭐ 在这里填写你的站点信息
 * contentRegistry 必须定义在此之上，因为 nav 通过 generateNavItems 引用它
 */
export const siteConfig: SiteConfig = {
  title: '栗かな',
  description: '记录生活与技术的个人博客',
  author: '栗かな',
  avatar: '/icon.png',
  icon: '/icon.png',
  bio: '日语专业 / 技术探索中',
  // 导航由 contentRegistry 自动生成，如需自定义可在此覆盖
  nav: generateNavItems(),
  social: {
    github: 'https://github.com/Mepuru',
  },
  footer: {
    icp: '鲁ICP备2024121288号',
    icpUrl: 'https://beian.miit.gov.cn/',
  },
  docs: {
    emptyTexts: [
      '『 四季轮回 岁岁年年 』',
      '『 今天吃什么呢？ 』\n『 是啊，吃什么呢？ 』',
      '『 到处点一点试试看？ 』',
    ],
  },
};

// ============================================================
// 自动推导函数
// ============================================================

/** 路由表 */
export function generateRoutes() {
  const routes: Record<string, { prefix: string; pattern: string } | string> = {
    about: '/about',
    home: '/',
    icon: '/icon.png',
  };
  for (const c of contentRegistry) {
    routes[c.id] = c.route;
  }
  routes['tags'] = { prefix: '/tags', pattern: '/tags/[tag]' };
  return routes as typeof routes & {
    blog: { prefix: string; pattern: string };
    docs: { prefix: string; pattern: string };
    tags: { prefix: string; pattern: string };
    about: string;
    home: string;
    icon: string;
  };
}

/** 导航栏 */
export function generateNavItems() {
  const items = contentRegistry
    .filter((c) => c.showInNav)
    .map((c) => ({ href: c.route.prefix, label: c.label }));
  return [
    { href: '/', label: '首页' },
    ...items,
    { href: '/about', label: '关于' },
  ];
}

/** 带 hasTags 标记的 collection id 列表 */
export function generateTaggableCollections(): string[] {
  return contentRegistry.filter((c) => c.hasTags).map((c) => c.id);
}

/** 系列配置 */
export function generateSeriesConfigs() {
  return contentRegistry
    .filter((c) => c.series)
    .map((c) => ({
      id: c.id,
      title: c.label,
      description: c.series!.description,
      countLabel: c.series!.countLabel,
      link: c.route.prefix,
      collection: c.id,
      align: c.series!.align ?? ('left' as const),
      sortField: c.series!.sortField,
      sortOrder: c.series!.sortOrder,
    }));
}
