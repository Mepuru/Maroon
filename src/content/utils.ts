import { getCollection } from 'astro:content';

// 转发出主题包的工具函数，保证 app 层导入路径不变
export {
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
