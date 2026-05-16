import { getCollection } from 'astro:content';

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
