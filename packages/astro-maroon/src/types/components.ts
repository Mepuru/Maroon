export interface HeroProps {
  // Hero 组件目前没有 props
}

export interface SeriesSectionProps {
  title?: string;
}

export interface SeriesCardProps {
  title: string;
  description: string;
  count: number;
  countLabel: string;
  recent: Array<{
    href: string;
    title: string;
  }>;
  link: string;
  align?: 'left' | 'right';
}

export interface SidebarProps {
  // Sidebar 组件目前没有 props
}
