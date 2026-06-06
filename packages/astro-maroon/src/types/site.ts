export interface NavItem {
  href: string;
  label: string;
}

/**
 * 路由表类型
 *
 * 已知路由（blog / docs / tags / about / home / icon）保持显式类型安全，
 * index signature 允许 registry 新增的 content type 自动通过类型检查。
 */
export interface RoutesConfig {
  [key: string]: { prefix: string; pattern: string } | string;
  blog: { prefix: string; pattern: string };
  docs: { prefix: string; pattern: string };
  tags: { prefix: string; pattern: string };
  about: string;
  home: string;
  icon: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  /** SEO 署名用作者名（不设则默认用 author） */
  authorSeo?: string;
  avatar: string;
  bio: string;
  icon: string;
  nav: NavItem[];
  social: {
    github?: string;
    twitter?: string;
    email?: string;
  };
  footer: {
    icp?: string;
    icpUrl?: string;
    themeUrl?: string;
  };
  docs: {
    emptyTexts: string[];
  };
  license?: {
    enable?: boolean;
    name?: string;
    url?: string;
  };
}

export interface ThemeConfig {
  id: string;
  name: string;
}
