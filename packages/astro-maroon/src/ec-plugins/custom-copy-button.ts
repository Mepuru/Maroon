/**
 * Expressive Code 自定义复制按钮
 *
 * 替换默认复制按钮，适配 Maroon 主题配色。
 * 点击后短暂显示"已复制"反馈。
 */
import { definePlugin } from '@expressive-code/core';

export function pluginCustomCopyButton() {
  return definePlugin({
    name: 'Custom Copy Button',
    baseStyles: () => `
      .ec-frame .copy-button {
        position: absolute;
        z-index: 2;
        right: 0.5rem;
        bottom: 0.5rem;
        padding: 0.25rem 0.6rem;
        font-size: 0.7rem;
        font-family: inherit;
        line-height: 1.4;
        color: var(--muted);
        background: var(--codeblock-bg);
        border: 1px solid var(--border);
        border-radius: 6px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
      .ec-frame:hover .copy-button {
        opacity: 0.8;
      }
      .ec-frame .copy-button:hover {
        opacity: 1;
        color: var(--accent);
        border-color: var(--accent);
      }
      .ec-frame .copy-button.copied {
        color: var(--accent);
        border-color: var(--accent);
      }
    `,
  });
}
