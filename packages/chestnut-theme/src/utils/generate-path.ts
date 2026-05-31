/**
 * 根据路由 pattern 和参数生成完整 URL
 *
 * pattern 如 '/blog/[slug]' 或 '/tags/[tag]'
 * params 如 { slug: 'my-post' } → '/blog/my-post'
 *
 * 纯函数，不依赖 Astro 运行时上下文
 */

export function generatePath(
  pattern: string,
  params?: Record<string, string>,
): string {
  if (!params) return pattern;
  let path = pattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`[${key}]`, encodeURIComponent(value));
  }
  return path;
}
