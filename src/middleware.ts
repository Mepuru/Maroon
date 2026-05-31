import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // 懒加载避免影响 dev 启动速度
  const [siteModule, themeModule] = await Promise.all([
    import('./config/maroon'),
    import('astro-maroon/utils/themes'),
  ]);

  const site = siteModule.siteConfig;
  const { generateRoutes } = siteModule;

  context.locals.site = {
    ...site,
    themes: themeModule.themes,
    defaultTheme: themeModule.defaultTheme,
    routes: generateRoutes(),
  };

  return next();
});
