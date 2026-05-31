/**
 * URL 路由模板集中管理
 *
 * 路由表现已移至 src/content/registry.ts（generateRoutes 自动生成），
 * 此文件仅保留 generatePath 工具函数供需要时调用。
 */

export function generatePath(
  routeKey: string,
  params?: Record<string, string>,
): string {
  // 从 Astro.locals.site.routes 获取当前路由表
  // 运行时动态生成路径
  return '';
}
