import type { SortField, SortOrder } from '@kurikana/astro-theme/types';
import { getCollection } from 'astro:content';

import {
  getTagStats,
  buildSidebarData,
  groupDocsByCategory,
} from '@kurikana/astro-theme/utils/content';
export type {
  TagCount,
  SidebarData,
  DocNavItem,
  DocCategory,
  DocsGroupResult,
} from '@kurikana/astro-theme/utils/content';
export { getTagStats, buildSidebarData, groupDocsByCategory };

// ============================================================
// 通用排序
// ============================================================

/**
 * 对 collection entry 数组按指定字段和顺序排序
 */
export function sortContentItems<T extends { data: Record<string, unknown> }>(
  items: T[],
  sortField: SortField,
  sortOrder: SortOrder,
): T[] {
  return [...items].sort((a, b) => {
    const valueA = a.data[sortField];
    const valueB = b.data[sortField];
    if (sortOrder === 'desc') {
      return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
    }
    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  });
}

// ============================================================
// 通用查询工具
// ============================================================

/**
 * 获取指定 collection 中已发布的条目，支持自定义排序
 */
export async function getPublishedContent(
  collectionId: string,
  options?: { sortField?: SortField; sortOrder?: SortOrder },
) {
  try {
    const items = await getCollection(collectionId as 'blog' | 'docs');
    const filtered = items.filter((item) => !item.data.draft);
    const { sortField = 'pubDate', sortOrder = 'desc' } = options ?? {};
    return sortContentItems(filtered, sortField, sortOrder);
  } catch {
    return [];
  }
}

/**
 * 获取已发布的文章（blog），按日期降序
 */
export async function getPublishedPosts() {
  return getPublishedContent('blog');
}

/**
 * 获取已发布的文档，按日期降序
 */
export async function getPublishedDocs() {
  return getPublishedContent('docs');
}

// ============================================================
// 页面数据构建 helper
// ============================================================

interface SiteContext {
  avatar?: string;
  author?: string;
  bio?: string;
  social?: { github?: string };
}

/**
 * 构建侧边栏数据（封装了 site context 读取）
 */
export function buildSidebarFromContext(
  ctx: SiteContext | undefined | null,
  posts: Array<{ data: { tags?: string[] } }>,
) {
  return buildSidebarData(
    {
      avatar: ctx?.avatar ?? '/icon.png',
      author: ctx?.author ?? '',
      bio: ctx?.bio ?? '',
      social: { github: ctx?.social?.github },
    },
    posts,
  );
}

/**
 * 计算上下篇导航
 */
export function computePrevNext<T extends { id: string }>(
  items: T[],
  currentId: string,
): { prev: T | null; next: T | null } {
  const index = items.findIndex((p) => p.id === currentId);
  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}

/**
 * 获取标签统计并从 site context 构建侧边栏（博客页面通用）
 */
export async function buildBlogSidebar(ctx: SiteContext | undefined | null) {
  const posts = await getPublishedPosts();
  return {
    posts,
    sidebarData: buildSidebarFromContext(ctx, posts),
  };
}
