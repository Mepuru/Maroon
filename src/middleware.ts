import { defineMiddleware } from 'astro:middleware';
import { generateRoutes } from './content/registry';

export const onRequest = defineMiddleware(async (context, next) => {
  // 懒加载避免影响 dev 启动速度
  const [siteModule, themeModule] = await Promise.all([
    import('./config/site'),
    import('@kurikana/astro-theme/utils/themes'),
  ]);

  const site = siteModule.siteConfig;

  context.locals.site = {
    ...site,
    themes: themeModule.themes,
    defaultTheme: themeModule.defaultTheme,
    routes: generateRoutes(),
  };

  return next();
});
