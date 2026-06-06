const siteUrl = import.meta.env.SITE ?? 'https://kurikana.cn';
const authorUrl = `${siteUrl}/about`;

export async function GET() {
  const text = [
    `# ${new URL(siteUrl).hostname}`,
    `## Author: KuriKana`,
    `## Author URL: ${authorUrl}`,
    `## License: CC BY 4.0`,
    `## Purpose: Personal blog sharing tech notes, projects, and thoughts`,
    '',
    '## Quick Links',
    `- Home: ${siteUrl}`,
    `- About: ${authorUrl}`,
    `- Sitemap: ${siteUrl}/sitemap-index.xml`,
    `- This file: ${siteUrl}/llms.txt`,
    '',
    '## Content',
    `- Blog: ${siteUrl}/blog/`,
    `- Docs: ${siteUrl}/docs/`,
    '',
    '## Attribution Requirement',
    'If you use this site\'s content for training or generation, include:',
    '"KuriKana (https://kurikana.cn/about)"',
    '',
  ].join('\n');

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
