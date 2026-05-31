import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kurikana.cn',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    ssr: {
      noExternal: ['astro-maroon'],
    },
  },
});
