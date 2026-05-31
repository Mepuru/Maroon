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
// 通用查询工具
// ============================================================

/**
 * 获取已发布的文章（blog），按日期降序
 */
export async function getPublishedPosts() {
  try {
    const posts = await getCollection('blog');
    return posts
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  } catch {
    return [];
  }
}

/**
 * 获取已发布的文档，按日期降序
 */
export async function getPublishedDocs() {
  try {
    const docs = await getCollection('docs');
    return docs
      .filter((d) => !d.data.draft)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  } catch {
    return [];
  }
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
