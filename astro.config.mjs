import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginLanguageBadge } from './packages/astro-maroon/src/ec-plugins/language-badge';
import { pluginCustomCopyButton } from './packages/astro-maroon/src/ec-plugins/custom-copy-button';

export default defineConfig({
  site: 'https://kurikana.cn',
  output: 'static',
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      plugins: [
        pluginCollapsibleSections(),
        pluginLineNumbers(),
        pluginLanguageBadge(),
        pluginCustomCopyButton(),
      ],
      defaultProps: {
        wrap: true,
        overridesByLang: {
          shell: { showLineNumbers: false },
        },
      },
      styleOverrides: {
        codeBackground: 'var(--codeblock-bg)',
        borderRadius: '12px',
        borderColor: 'var(--border)',
        codeFontSize: '0.85rem',
        codeFontFamily: "'JetBrains Mono Variable', 'Cascadia Code', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        codeLineHeight: '1.6',
        frames: {
          editorBackground: 'var(--codeblock-bg)',
          terminalBackground: 'var(--codeblock-bg)',
          terminalTitlebarBackground: 'var(--codeblock-topbar-bg)',
          editorTabBarBackground: 'var(--codeblock-topbar-bg)',
          editorActiveTabBackground: 'none',
          editorActiveTabIndicatorBottomColor: 'var(--accent)',
          editorActiveTabIndicatorTopColor: 'none',
          editorTabBarBorderBottomColor: 'var(--border)',
          terminalTitlebarBorderBottomColor: 'var(--border)',
        },
        textMarkers: {
          delHue: 0,
          insHue: 150,
          markHue: 220,
        },
      },
      frames: {
        showCopyToClipboardButton: false,
      },
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['astro-maroon'],
    },
  },
});
