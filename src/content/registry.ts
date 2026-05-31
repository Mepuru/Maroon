/**
 * 内容类型注册表
 *
 * 新增一个内容类型的标准流程：
 * 1. 在 src/content/ 下建目录（如 recipes/）
 * 2. 在 src/content.config.ts 中 defineCollection
 * 3. 在本文件 registry 数组中加一条配置
 * 4. 在 src/pages/ 下建路由文件（参考 blog 或 docs）
 * 5. 如有需要，在 src/config/series.ts 加系列（首页展示）
 *
 * 未来可以基于此 registry 自动生成 RSS / sitemap / 导航。
 */

import type { SortField, SortOrder } from '@kurikana/astro-theme/types';

export interface ContentTypeConfig {
  id: string;
  /** 显示名称，用于导航和标题 */
  label: string;
  /** 路由 key，对应 src/config/routing.ts 中的 routes */
  routeKey: string;
  /** 是否在详情页显示侧边栏（作者信息 + 标签云） */
  sidebarIncluded: boolean;
  /** 可选：是否出现在首页的系列卡片区 */
  series?: {
    description: string;
    countLabel: string;
    align?: 'left' | 'right';
    sortField: SortField;
    sortOrder: SortOrder;
  };
}

/**
 * 内容类型注册表
 * 每新增一个内容类型，在这里加一条声明即可
 */
export const contentRegistry: ContentTypeConfig[] = [
  {
    id: 'blog',
    label: '博客',
    routeKey: 'blog',
    sidebarIncluded: true,
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
    routeKey: 'docs',
    sidebarIncluded: false,
    series: {
      description: '技术文档与知识整理',
      countLabel: '篇文档',
      align: 'right',
      sortField: 'pubDate',
      sortOrder: 'desc',
    },
  },
  {
    id: 'pages',
    label: '页面',
    routeKey: 'about',
    sidebarIncluded: false,
  },
];

/**
 * 按 id 查找内容类型配置
 */
export function getContentConfig(id: string): ContentTypeConfig | undefined {
  return contentRegistry.find((c) => c.id === id);
}

/**
 * 获取所有需要展示在首页系列区的内容类型
 */
export function getSeriesConfigs() {
  return contentRegistry.filter((c) => c.series) as Required<
    Pick<ContentTypeConfig, 'id' | 'label' | 'routeKey' | 'series'>
  >[];
}
