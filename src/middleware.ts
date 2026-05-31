import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // 懒加载避免影响 dev 启动速度
  const [siteModule, themeModule, routesModule] = await Promise.all([
    import('./config/site'),
    import('@kurikana/astro-theme/utils/themes'),
    import('./config/routing'),
  ]);

  const site = siteModule.siteConfig;

  context.locals.site = {
    ...site,
    themes: themeModule.themes,
    defaultTheme: themeModule.defaultTheme,
    routes: routesModule.routes,
  };

  return next();
});
