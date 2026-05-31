/**
 * Expressive Code 语言徽章插件
 *
 * 在代码块右上角显示语言名。
 * 基于 Fuwari 的实现，适配 Maroon 主题配色。
 * 鼠标悬停时徽章淡出，方便阅读代码。
 */
import { definePlugin } from '@expressive-code/core';

export function pluginLanguageBadge() {
  return definePlugin({
    name: 'Language Badge',
    baseStyles: () => `
      .ec-frame [data-language]::before {
        position: absolute;
        z-index: 2;
        right: 0.5rem;
        top: 0.5rem;
        padding: 0.1rem 0.5rem;
        content: attr(data-language);
        font-family: var(--ec-codeFontFamily);
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--muted);
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 6px;
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.2s ease;
      }
      .ec-frame:not(.has-title):not(.is-terminal):hover [data-language]::before {
        opacity: 0;
      }
    `,
  });
}
