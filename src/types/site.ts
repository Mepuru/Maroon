export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  social: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export interface ThemeConfig {
  id: string;
  name: string;
}
