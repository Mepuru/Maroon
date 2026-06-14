import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig, contentRegistry } from '../config/maroon';

export async function GET(context: { site: URL }) {
  const rssConfig = siteConfig.footer?.rss;
  if (!rssConfig?.enable) {
    return new Response(null, { status: 404 });
  }

  const limit = rssConfig.limit ?? 30;
  const feedTitle = rssConfig.title ?? siteConfig.title;
  const feedDescription = rssConfig.description ?? siteConfig.description;

  const includedTypes = contentRegistry.filter((c) => c.rssIncluded !== false);

  const entries = await Promise.all(
    includedTypes.map(async (ct) => {
      const items = await getCollection(ct.id as 'blog' | 'docs');
      return items
        .filter((item) => !item.data.draft && item.data.pubDate)
        .map((item) => ({
          title: item.data.title,
          description: item.data.description,
          pubDate: item.data.pubDate,
          link: ct.route.pattern.replace('[slug]', item.id),
          categories: item.data.tags,
        }));
    }),
  );

  const flat = entries
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);

  return rss({
    title: feedTitle,
    description: feedDescription,
    site: context.site,
    items: flat.map((item) => ({
      title: item.title,
      description: item.description,
      pubDate: item.pubDate,
      link: item.link,
      categories: item.categories,
    })),
    customData: '<language>zh-CN</language>',
  });
}
