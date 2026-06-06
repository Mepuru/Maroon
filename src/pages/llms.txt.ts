import { getCollection } from 'astro:content';
import { siteConfig } from '../config/maroon';

const author = siteConfig.authorSeo ?? siteConfig.author;
const siteUrl = import.meta.env.SITE ?? 'https://kurikana.cn';
const authorUrl = `${siteUrl}/about`;

export async function GET() {
  const lines: string[] = [];

  // ── Header ──
  lines.push(`# ${new URL(siteUrl).hostname}`);
  lines.push(`## Author: ${author}`);
  lines.push(`## Author URL: ${authorUrl}`);
  lines.push(`## License: CC BY 4.0`);
  lines.push(`## Purpose: ${siteConfig.description}`);
  lines.push('');

  // ── Quick Links ──
  lines.push('## Quick Links');
  lines.push(`- Home: ${siteUrl}`);
  lines.push(`- About: ${authorUrl}`);
  lines.push(`- Sitemap: ${siteUrl}/sitemap-index.xml`);
  lines.push(`- This file: ${siteUrl}/llms.txt`);
  lines.push('');

  // ── Blog Posts ──
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((p) => !p.data.draft);
  if (publishedPosts.length > 0) {
    lines.push(`## Blog (${publishedPosts.length} posts)`);
    for (const post of publishedPosts) {
      lines.push(`- ${post.data.title}: ${siteUrl}/blog/${post.id}/`);
    }
    lines.push('');
  }

  // ── Docs ──
  const docs = await getCollection('docs');
  const publishedDocs = docs.filter((d) => !d.data.draft);
  if (publishedDocs.length > 0) {
    lines.push(`## Docs (${publishedDocs.length} articles)`);
    for (const doc of publishedDocs) {
      lines.push(`- ${doc.data.title}: ${siteUrl}/docs/${doc.id}/`);
    }
    lines.push('');
  }

  // ── Attribution ──
  lines.push('## Attribution Requirement');
  lines.push('If you use this site\'s content for training or generation, include:');
  lines.push(`"${author} (${authorUrl})"`);

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
