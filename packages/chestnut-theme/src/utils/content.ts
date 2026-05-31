import type { SiteConfig } from '../types/site';

// ============================================================
// 标签相关
// ============================================================

export interface TagCount {
  name: string;
  count: number;
}

/**
 * 从文章列表中提取标签并统计出现次数，按频次降序排列
 */
export function getTagStats(
  posts: Array<{ data: { tags?: string[] } }>,
): TagCount[] {
  const allTags = posts.flatMap((p) => p.data.tags ?? []);
  const tagCountMap = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.entries(tagCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

// ============================================================
// Sidebar 数据构造
// ============================================================

export interface SidebarData {
  avatar: string;
  author: string;
  bio: string;
  postsCount: number;
  tags: TagCount[];
  tagCount: number;
  githubUrl?: string;
}

/**
 * 构造侧边栏所需的全部数据
 */
export function buildSidebarData(
  siteConfig: Pick<SiteConfig, 'avatar' | 'author' | 'bio' | 'social'>,
  posts: Array<{ data: { tags?: string[] } }>,
): SidebarData {
  const tags = getTagStats(posts);
  return {
    avatar: siteConfig.avatar,
    author: siteConfig.author,
    bio: siteConfig.bio,
    postsCount: posts.length,
    tags,
    tagCount: tags.length,
    githubUrl: siteConfig.social.github,
  };
}

// ============================================================
// 文档分组
// ============================================================

export interface DocNavItem {
  slug: string;
  title: string;
}

export interface DocCategory {
  name: string;
  docs: DocNavItem[];
}

export interface DocsGroupResult {
  publishedDocs: Array<{ id: string; data: { title: string; pubDate: Date; category?: string } }>;
  categories: DocCategory[];
  uncategorized: DocNavItem[];
}

/**
 * 将文档按 category 字段分组，已发布的文档按 pubDate 降序排列
 */
export function groupDocsByCategory(
  docs: Array<{ id: string; data: { title: string; pubDate: Date; category?: string } }>,
): DocsGroupResult {
  const publishedDocs = docs
    .filter((d) => !d.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const groups = new Map<string, Array<{ id: string; data: { title: string } }>>();
  const uncategorized: Array<{ id: string; data: { title: string } }> = [];

  for (const doc of publishedDocs) {
    const cat = doc.data.category;
    if (cat) {
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(doc);
    } else {
      uncategorized.push(doc);
    }
  }

  const categories: DocCategory[] = [...groups.keys()].sort().map((name) => ({
    name,
    docs: groups.get(name)!.map((d) => ({ slug: d.id, title: d.data.title })),
  }));

  return {
    publishedDocs,
    categories,
    uncategorized: uncategorized.map((d) => ({ slug: d.id, title: d.data.title })),
  };
}
