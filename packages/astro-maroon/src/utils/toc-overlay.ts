/**
 * TOC overlay toggle — 桌面端固定定位，移动端全屏浮层
 *
 * PostLayout 和 DocsLayout 中重复的 initTocToggle/initPostToc 逻辑提取至此。
 * 通过 cleanupMap 确保 astro:after-swap 时旧事件监听器被正确移除。
 */

const cleanupMap = new Map<
  string,
  { toggleHandler: () => void; docHandler: (e: Event) => void }
>();

/**
 * 初始化 TOC overlay 切换
 * @param toggleId 切换按钮的 DOM id
 * @param overlayId 浮层面板的 DOM id
 */
export function initOverlayToggle(toggleId: string, overlayId: string): void {
  const toggle = document.getElementById(toggleId);
  const overlay = document.getElementById(overlayId);
  if (!toggle || !overlay) return;

  // 清理旧 handler，防止 astro:after-swap 时重复绑定
  const prev = cleanupMap.get(toggleId);
  if (prev) {
    toggle.removeEventListener('click', prev.toggleHandler);
    document.removeEventListener('click', prev.docHandler);
  }

  const toggleHandler = () => {
    overlay.classList.toggle('is-overlay');
    toggle.classList.toggle('open');
  };

  const docHandler = (e: Event) => {
    if (
      !overlay.contains(e.target as Node) &&
      !toggle.contains(e.target as Node)
    ) {
      overlay.classList.remove('is-overlay');
      toggle.classList.remove('open');
    }
  };

  toggle.addEventListener('click', toggleHandler);
  document.addEventListener('click', docHandler);

  cleanupMap.set(toggleId, { toggleHandler, docHandler });
}
